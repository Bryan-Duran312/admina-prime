from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.db.models import Sum
from .models import Estudiante, Pago, Nota, HistorialModificacion

def vista_login(request):
    error = None
    if request.method == 'POST':
        usuario_txt = request.POST.get('username')
        clave_txt = request.POST.get('password')
        
        # Verificamos si el usuario y contraseña existen en la base de datos
        user = authenticate(request, username=usuario_txt, password=clave_txt)
        
        if user is not None:
            login(request, user)
            return redirect('panel_inicio') # Si es correcto, lo mandamos al inicio público
        else:
            error = "Usuario o contraseña incorrectos. Intenta de nuevo."
            
    return render(request, 'gestion_colegio/login.html', {'error': error})

def vista_inicio(request):
    # Esta será la pantalla de bienvenida amigable del colegio
    if not request.user.is_authenticated:
        return redirect('login') # Si no ha iniciado sesión, lo echa al login
    return render(request, 'gestion_colegio/inicio.html', {'usuario': request.user})

def vista_registrar_pago(request):
    if not request.user.is_authenticated:
        return redirect('login')

    mensaje = None
    error = None

    if request.method == 'POST':
        estudiante_id = request.POST.get('estudiante')
        monto = request.POST.get('monto')
        metodo = request.POST.get('metodo_pago')
        comprobante = request.POST.get('referencia_comprobante', '')

        try:
            estudiante_obj = Estudiante.objects.get(id=estudiante_id)
            
            # Guardamos el pago en la base de datos de SGAF
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

    # Traemos la lista de estudiantes para el menú desplegable
    estudiantes = Estudiante.objects.all()
    
    return render(request, 'gestion_colegio/registrar_pago.html', {
        'estudiantes': estudiantes,
        'mensaje': mensaje,
        'error': error
    })

def vista_registrar_nota(request):
    if not request.user.is_authenticated:
        return redirect('login')

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

    # Si es SUPERUSUARIO ve todas las notas, si es PROFESOR solo ve las que ÉL ha subido
    if request.user.is_superuser:
        mis_notas = Nota.objects.all().order_by('-fecha_registro')
    else:
        mis_notas = Nota.objects.filter(profesor_que_registro=request.user).order_by('-fecha_registro')
    
    return render(request, 'gestion_colegio/registrar_nota.html', {
        'estudiantes': estudiantes,
        'mis_notas': mis_notas,
        'mensaje': mensaje,
        'error': error
    })

def vista_reportes_director(request):
    if not request.user.is_authenticated:
        return redirect('login')

    # Calculamos el total de dinero ingresado en el colegio
    total_recaudado = Pago.objects.aggregate(Sum('monto'))['monto__sum'] or 0

    # Traemos las listas para las tablas del reporte
    ultimos_pagos = Pago.objects.all().order_by('-fecha_pago')[:10]  # Últimos 10 pagos
    ultimas_notas = Nota.objects.all().order_by('-fecha_registro')[:10]  # Últimas 10 notas
    historial_cambios = HistorialModificacion.objects.all().order_by('-fecha_modificacion')[:10]

    return render(request, 'gestion_colegio/reportes_director.html', {
        'total_recaudado': total_recaudado,
        'ultimos_pagos': ultimos_pagos,
        'ultimas_notas': ultimas_notas,
        'historial_cambios': historial_cambios,
    })

def vista_editar_nota(request, nota_id):
    if not request.user.is_authenticated:
        return redirect('login')

    nota = Nota.objects.get(id=nota_id)
    mensaje = None
    error = None

    if request.method == 'POST':
        nueva_nota = request.POST.get('valor_nota')
        justificacion = request.POST.get('justificacion')

        if not justificacion.strip():
            error = "⚠️ Es obligatorio escribir una justificación para corregir la nota."
        else:
            valor_anterior = str(nota.valor_nota)
            
            # 1. Guardamos el registro en la Bitácora de Auditoría
            HistorialModificacion.objects.create(
                tipo='NOTA',
                usuario_que_modifico=request.user,
                valor_anterior=f"Nota de {nota.materia}: {valor_anterior}",
                valor_nuevo=f"Nota de {nota.materia}: {nueva_nota}",
                justificacion=justificacion
            )

            # 2. Actualizamos la nota real en la base de datos
            nota.valor_nota = nueva_nota
            nota.save()

            mensaje = "✅ La nota ha sido corregida y el cambio se ha registrado en la Bitácora de Auditoría."

    return render(request, 'gestion_colegio/editar_nota.html', {
        'nota': nota,
        'mensaje': mensaje,
        'error': error
    })

def vista_gestion_estudiantes(request):
    if not request.user.is_authenticated:
        return redirect('login')

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
        'error': error
    })