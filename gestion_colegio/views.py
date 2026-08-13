from decimal import Decimal, InvalidOperation

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import PermissionDenied
from django.db.models import Sum
from django.http import JsonResponse
from datetime import datetime
from .models import Estudiante, Pago, Nota, HistorialModificacion


def get_user_rol(user):
    if not user or not user.is_authenticated:
        return 'VISITANTE'
    if user.is_superuser:
        return 'ADMINISTRADOR'
    perfil = getattr(user, 'perfil', None)
    if perfil is None:
        return 'ADMINISTRADOR'
    return perfil.rol


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
        return redirect('registrar_nota')

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

    if request.user.is_superuser:
        mis_notas = Nota.objects.all().order_by('-fecha_registro')
    else:
        mis_notas = Nota.objects.filter(profesor_que_registro=request.user).order_by('-fecha_registro')

    return render(request, 'gestion_colegio/registrar_nota.html', {
        'estudiantes': estudiantes,
        'mis_notas': mis_notas,
        'mensaje': mensaje,
        'error': error,
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


def vista_gestion_estudiantes(request):
    if not request.user.is_authenticated:
        return redirect('login')

    rol = get_user_rol(request.user)
    if rol != 'ADMINISTRADOR':
        messages.warning(request, 'El módulo de estudiantes está reservado para administración.')
        return redirect('panel_inicio')

    mensaje = None
    error = None

    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        apellido = request.POST.get('apellido')
        grado = request.POST.get('grado')

        try:
            Estudiante.objects.create(
                nombre=nombre,
                apellido=apellido,
                grado=grado
            )
            mensaje = f"✅ Estudiante {nombre} {apellido} matriculado exitosamente en el grado {grado}."
        except Exception as e:
            error = f"Error al registrar estudiante: {str(e)}"

    estudiantes = Estudiante.objects.all().order_by('grado', 'apellido')

    return render(request, 'gestion_colegio/estudiantes.html', {
        'estudiantes': estudiantes,
        'mensaje': mensaje,
        'error': error,
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