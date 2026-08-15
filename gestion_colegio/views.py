from decimal import Decimal, InvalidOperation

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import PermissionDenied
from django.db.models import Sum
from django.http import JsonResponse
from datetime import date, datetime
from .models import Estudiante, Pago, Nota, HistorialModificacion, Asistencia


def get_user_rol(user):
    if not user or not user.is_authenticated:
        return 'VISITANTE'
    if user.is_superuser:
        return 'ADMINISTRADOR'
    perfil = getattr(user, 'perfil', None)
    if perfil is None:
        return 'ADMINISTRADOR'
    return perfil.rol


def _get_monthly_income_data():
    current_year = datetime.now().year
    labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    totals_by_month = {month: 0 for month in range(1, 13)}

    for entry in Pago.objects.filter(fecha_pago__year=current_year).values('fecha_pago__month').annotate(total=Sum('monto')):
        month_number = entry.get('fecha_pago__month')
        if month_number:
            totals_by_month[int(month_number)] = float(entry['total'] or 0)

    return labels, [totals_by_month[month] for month in range(1, 13)]


def vista_login(request):
    error = None
    if request.method == 'POST':
        usuario_txt = request.POST.get('username')
        clave_txt = request.POST.get('password')

        user = authenticate(request, username=usuario_txt, password=clave_txt)

        if user is not None:
            login(request, user)
            return redirect('panel_inicio')
        error = "Usuario o contraseña incorrectos. Intenta de nuevo."

    return render(request, 'gestion_colegio/login.html', {'error': error})


def vista_logout(request):
    """Cierra la sesión del usuario y redirige al login."""
    logout(request)
    return redirect('login')


def vista_inicio(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol == 'PROFESOR':
        return redirect('dashboard_docente')
    if rol == 'ADMINISTRADOR':
        return redirect('admin_inicio')
    if rol == 'DIRECTOR':
        return redirect('director_inicio')

    return render(request, 'gestion_colegio/inicio.html', {
        'usuario': request.user,
        'user_rol': rol,
        'total_estudiantes': Estudiante.objects.count(),
        'total_recaudado': Pago.objects.aggregate(Sum('monto'))['monto__sum'] or 0,
        'total_notas': Nota.objects.count(),
        'recientes': [],
        'monthly_income_labels': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        'monthly_income_values': [120000, 150000, 90000, 180000, 200000, 130000],
    })


def vista_director_dashboard(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'DIRECTOR':
        messages.warning(request, 'El tablero ejecutivo es exclusivo para la dirección.')
        return redirect('panel_inicio')

    total_estudiantes = Estudiante.objects.count()
    total_recaudado = Pago.objects.aggregate(Sum('monto'))['monto__sum'] or 0
    total_notas = Nota.objects.count()
    monthly_labels, monthly_values = _get_monthly_income_data()

    return render(request, 'gestion_colegio/director_dashboard.html', {
        'usuario': request.user,
        'user_rol': rol,
        'total_estudiantes': total_estudiantes,
        'total_recaudado': total_recaudado,
        'total_notas': total_notas,
        'monthly_income_labels': monthly_labels,
        'monthly_income_values': monthly_values,
    })


def vista_admin_dashboard(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El panel administrativo es exclusivo para administración.')
        return redirect('panel_inicio')

    monthly_labels, monthly_values = _get_monthly_income_data()

    return render(request, 'gestion_colegio/admin_dashboard.html', {
        'usuario': request.user,
        'user_rol': rol,
        'total_estudiantes': Estudiante.objects.count(),
        'total_recaudado': Pago.objects.aggregate(Sum('monto'))['monto__sum'] or 0,
        'total_notas': Nota.objects.count(),
        'monthly_income_labels': monthly_labels,
        'monthly_income_values': monthly_values,
    })


def _get_queryset_notas_docente(user):
    if user.is_superuser:
        return Nota.objects.all().order_by('-fecha_registro')
    return Nota.objects.filter(profesor_que_registro=user).order_by('-fecha_registro')


def vista_dashboard_docente(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'PROFESOR':
        messages.warning(request, 'La vista docente es exclusiva para el personal docente.')
        return redirect('panel_inicio')

    total_estudiantes = Estudiante.objects.count()
    grados_asignados = Estudiante.objects.values_list('grado', flat=True).distinct().count()
    notas_registradas = _get_queryset_notas_docente(request.user).count()
    asistencias_hoy = Asistencia.objects.filter(fecha=date.today(), registrado_por=request.user).count()

    return render(request, 'gestion_colegio/docente_dashboard.html', {
        'user_rol': rol,
        'total_estudiantes': total_estudiantes,
        'grados_asignados': grados_asignados,
        'notas_registradas': notas_registradas,
        'asistencias_hoy': asistencias_hoy,
        'mis_notas': _get_queryset_notas_docente(request.user)[:5],
    })


def vista_registrar_pago(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol == 'PROFESOR' or rol == 'DIRECTOR':
        messages.warning(request, 'El módulo de pagos no está disponible para este rol.')
        return redirect('panel_inicio')

    mensaje = None
    error = None

    if request.method == 'POST':
        estudiante_id = request.POST.get('estudiante')
        monto = request.POST.get('monto')
        metodo = request.POST.get('metodo_pago')
        comprobante = request.POST.get('referencia_comprobante', '')

        try:
            estudiante_obj = Estudiante.objects.get(id=estudiante_id)
            Pago.objects.create(
                estudiante=estudiante_obj,
                monto=monto,
                metodo_pago=metodo,
                referencia_comprobante=comprobante,
                registrado_por=request.user
            )
            mensaje = f"✅ Pago de ${monto} registrado exitosamente para {estudiante_obj.nombre} {estudiante_obj.apellido}."
        except Exception as e:
            error = f"Ocurrió un error al registrar el pago: {str(e)}"

    estudiantes = Estudiante.objects.all()

    return render(request, 'gestion_colegio/registrar_pago.html', {
        'estudiantes': estudiantes,
        'mensaje': mensaje,
        'error': error,
        'user_rol': rol,
    })


def vista_registrar_nota(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'PROFESOR':
        messages.warning(request, 'El módulo de calificación es de uso exclusivo para el personal docente.')
        return redirect('panel_inicio')

    return redirect('docente_registrar_nota')


def vista_docente_registrar_nota(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'PROFESOR':
        messages.warning(request, 'El módulo de calificación es de uso exclusivo para el personal docente.')
        return redirect('panel_inicio')

    mensaje = None
    error = None

    if request.method == 'POST':
        estudiante_id = request.POST.get('estudiante')
        materia = request.POST.get('materia')
        valor_nota = request.POST.get('valor_nota')

        try:
            estudiante_obj = Estudiante.objects.get(id=estudiante_id)
            Nota.objects.create(
                estudiante=estudiante_obj,
                materia=materia,
                valor_nota=valor_nota,
                profesor_que_registro=request.user
            )
            mensaje = f"✅ Nota de {valor_nota} en {materia} asignada a {estudiante_obj.nombre} {estudiante_obj.apellido}."
        except Exception as e:
            error = f"Error al registrar la nota: {str(e)}"

    estudiantes = Estudiante.objects.all()

    return render(request, 'gestion_colegio/docente_registrar_nota.html', {
        'estudiantes': estudiantes,
        'mensaje': mensaje,
        'error': error,
        'user_rol': rol,
    })


def vista_docente_historial_notas(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'PROFESOR':
        messages.warning(request, 'El historial de notas es exclusivo del personal docente.')
        return redirect('panel_inicio')

    mis_notas = _get_queryset_notas_docente(request.user)

    return render(request, 'gestion_colegio/docente_historial_notas.html', {
        'mis_notas': mis_notas,
        'user_rol': rol,
    })


def vista_reportes_director(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol not in ['ADMINISTRADOR', 'DIRECTOR']:
        messages.warning(request, 'No tienes permisos para consultar reportes del sistema.')
        return redirect('panel_inicio')

    total_recaudado = Pago.objects.aggregate(Sum('monto'))['monto__sum'] or 0
    ultimos_pagos = Pago.objects.all().order_by('-fecha_pago')[:10]
    ultimas_notas = Nota.objects.all().order_by('-fecha_registro')[:10]
    historial_cambios = HistorialModificacion.objects.all().order_by('-fecha_modificacion')[:10]

    return render(request, 'gestion_colegio/reportes_director.html', {
        'total_recaudado': total_recaudado,
        'ultimos_pagos': ultimos_pagos,
        'ultimas_notas': ultimas_notas,
        'historial_cambios': historial_cambios,
        'user_rol': rol,
    })


def vista_director_ultimos_pagos(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'DIRECTOR':
        messages.warning(request, 'El módulo de pagos es de lectura exclusiva para la dirección.')
        return redirect('panel_inicio')

    ultimos_pagos = Pago.objects.all().order_by('-fecha_pago')[:10]
    return render(request, 'gestion_colegio/director_ultimos_pagos.html', {
        'ultimos_pagos': ultimos_pagos,
        'user_rol': rol,
    })


def vista_director_ultimas_notas(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'DIRECTOR':
        messages.warning(request, 'El historial de calificaciones es de lectura exclusiva para la dirección.')
        return redirect('panel_inicio')

    ultimas_notas = Nota.objects.all().order_by('-fecha_registro')[:10]
    return render(request, 'gestion_colegio/director_ultimas_notas.html', {
        'ultimas_notas': ultimas_notas,
        'user_rol': rol,
    })


def vista_director_auditoria(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'DIRECTOR':
        messages.warning(request, 'La auditoría es de lectura exclusiva para la dirección.')
        return redirect('panel_inicio')

    historial_cambios = HistorialModificacion.objects.all().order_by('-fecha_modificacion')[:10]
    return render(request, 'gestion_colegio/director_auditoria.html', {
        'historial_cambios': historial_cambios,
        'user_rol': rol,
    })


GRADOS_ACADEMICOS = [
    'Transición', '1° Grado', '2° Grado', '3° Grado', '4° Grado', '5° Grado',
    '6° Grado', '7° Grado', '8° Grado', '9° Grado', '10° Grado', '11° Grado'
]


def vista_asistencia_por_grado(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'PROFESOR':
        raise PermissionDenied('La asistencia por grado es exclusiva del personal docente.')

    grado_seleccionado = request.GET.get('grado') or '5° Grado'
    if grado_seleccionado not in GRADOS_ACADEMICOS:
        grado_seleccionado = '5° Grado'

    estudiantes = Estudiante.objects.filter(grado=grado_seleccionado).order_by('apellido', 'nombre')
    fecha_hoy = date.today().strftime('%d/%m/%Y')
    mensaje = None
    error = None

    if request.method == 'POST':
        try:
            for estudiante in estudiantes:
                estado = request.POST.get(f'estado_{estudiante.id}', 'AUSENTE')
                Asistencia.objects.update_or_create(
                    estudiante=estudiante,
                    fecha=date.today(),
                    defaults={
                        'grado': grado_seleccionado,
                        'estado': estado,
                        'registrado_por': request.user,
                    },
                )
            mensaje = f"✅ Asistencia del día registrada para {grado_seleccionado}."
        except Exception as exc:
            error = f"Error al guardar la asistencia: {str(exc)}"

    return render(request, 'gestion_colegio/asistencia_grado.html', {
        'user_rol': rol,
        'grados_academicos': GRADOS_ACADEMICOS,
        'grado_seleccionado': grado_seleccionado,
        'estudiantes': estudiantes,
        'fecha_hoy': fecha_hoy,
        'mensaje': mensaje,
        'error': error,
    })


def vista_editar_nota(request, nota_id):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'PROFESOR':
        message = 'La corrección de notas es exclusiva del personal docente.'
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': message}, status=403)
        raise PermissionDenied(message)

    nota = get_object_or_404(Nota, id=nota_id)

    if request.method != 'POST':
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': 'Método no permitido.'}, status=405)
        return redirect('registrar_nota')

    nueva_nota = request.POST.get('valor_nota')
    justificacion = (request.POST.get('justificacion') or '').strip()

    if not nueva_nota or not justificacion:
        message = '⚠️ Es obligatorio escribir una justificación para corregir la nota.'
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': message}, status=400)
        messages.error(request, message)
        return redirect('registrar_nota')

    try:
        valor_decimal = Decimal(str(nueva_nota).replace(',', '.'))
    except InvalidOperation:
        message = '⚠️ La nota ingresada no es válida.'
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': message}, status=400)
        messages.error(request, message)
        return redirect('registrar_nota')

    if valor_decimal < 0 or valor_decimal > 5:
        message = '⚠️ La nota debe estar entre 0.00 y 5.00.'
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': message}, status=400)
        messages.error(request, message)
        return redirect('registrar_nota')

    valor_anterior = str(nota.valor_nota)
    HistorialModificacion.objects.create(
        tipo='NOTA',
        usuario_que_modifico=request.user,
        valor_anterior=f"Nota de {nota.materia}: {valor_anterior}",
        valor_nuevo=f"Nota de {nota.materia}: {nueva_nota}",
        justificacion=justificacion,
    )
    nota.valor_nota = valor_decimal
    nota.save()

    success_message = '¡Corrección registrada con éxito!'
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': success_message,
            'nota_nueva': str(nota.valor_nota),
            'nota_id': nota.id,
        })

    messages.success(request, success_message)
    return redirect('registrar_nota')


def vista_admin_matricular_estudiante(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El módulo de estudiantes está reservado para administración.')
        return redirect('panel_inicio')

    mensaje = None
    error = None

    if request.method == 'POST':
        nombre = (request.POST.get('nombre') or '').strip()
        apellido = (request.POST.get('apellido') or '').strip()
        grado = (request.POST.get('grado') or '').strip()
        documento = (request.POST.get('documento_identidad') or '').strip()

        if not nombre or not apellido or not grado:
            error = 'Debe completar nombre, apellido y grado para matricular el estudiante.'
        else:
            if not documento:
                documento = f"ADM-{nombre[:2].upper()}{apellido[:2].upper()}-{Estudiante.objects.count() + 1:04d}"

            try:
                Estudiante.objects.create(
                    nombre=nombre,
                    apellido=apellido,
                    documento_identidad=documento,
                    grado=grado,
                )
                mensaje = f"✅ Estudiante {nombre} {apellido} matriculado exitosamente en el grado {grado}."
            except Exception as e:
                error = f"Error al registrar estudiante: {str(e)}"

    return render(request, 'gestion_colegio/admin_matricular_estudiante.html', {
        'mensaje': mensaje,
        'error': error,
        'user_rol': rol,
    })


def vista_admin_lista_estudiantes(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El módulo de estudiantes está reservado para administración.')
        return redirect('panel_inicio')

    estudiantes = Estudiante.objects.all().order_by('grado', 'apellido', 'nombre')

    return render(request, 'gestion_colegio/admin_lista_estudiantes.html', {
        'estudiantes': estudiantes,
        'user_rol': rol,
    })


def vista_gestion_estudiantes(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El módulo de estudiantes está reservado para administración.')
        return redirect('panel_inicio')

    return redirect('admin_lista_estudiantes')


def vista_admin_registrar_pago(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El módulo de pagos es exclusivo del administrador.')
        return redirect('panel_inicio')

    return vista_registrar_pago(request)


def vista_admin_ultimos_pagos(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El módulo de pagos es exclusivo del administrador.')
        return redirect('panel_inicio')

    ultimos_pagos = Pago.objects.all().order_by('-fecha_pago')[:10]

    return render(request, 'gestion_colegio/admin_ultimos_pagos.html', {
        'ultimos_pagos': ultimos_pagos,
        'user_rol': rol,
    })


def vista_admin_ultimas_notas(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El historial de calificaciones es exclusivo del administrador.')
        return redirect('panel_inicio')

    ultimas_notas = Nota.objects.all().order_by('-fecha_registro')[:10]

    return render(request, 'gestion_colegio/admin_ultimas_notas.html', {
        'ultimas_notas': ultimas_notas,
        'user_rol': rol,
    })


def vista_admin_auditoria(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'La auditoría es exclusiva del administrador.')
        return redirect('panel_inicio')

    historial_cambios = HistorialModificacion.objects.all().order_by('-fecha_modificacion')[:10]

    return render(request, 'gestion_colegio/admin_auditoria.html', {
        'historial_cambios': historial_cambios,
        'user_rol': rol,
    })


def vista_certificado_paz_y_salvo(request, estudiante_id):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol not in ['ADMINISTRADOR', 'DIRECTOR']:
        messages.warning(request, 'No tienes permisos para generar certificados de paz y salvo.')
        return redirect('panel_inicio')

    estudiante = get_object_or_404(Estudiante, id=estudiante_id)
    fecha_actual = datetime.now().strftime("%d de %B de %Y")

    return render(request, 'gestion_colegio/certificado_paz_y_salvo.html', {
        'estudiante': estudiante,
        'fecha': fecha_actual,
        'emisor': request.user.get_full_name() or request.user.username,
        'user_rol': rol,
    })