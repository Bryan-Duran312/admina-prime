"""
WSGI config for admina_prime_core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admina_prime_core.settings')

application = get_wsgi_application()
app = application

def _initialize_vercel_database():
	from django.core.management import call_command
	from django.contrib.auth.models import User
	from django.utils import timezone

	from gestion_colegio.models import (
		Asistencia,
		Estudiante,
		Grado,
		HistorialModificacion,
		Nota,
		Pago,
		PerfilUsuario,
	)

	call_command('migrate', interactive=False, verbosity=0)

	users = {
		'Admin': ('Colegio2030', 'ADMINISTRADOR'),
		'Docente': ('Colegio2026*', 'PROFESOR'),
		'Director': ('Colegio2026*', 'DIRECTOR'),
	}
	created_users = {}
	for username, (password, role) in users.items():
		user, _ = User.objects.get_or_create(username=username)
		user.set_password(password)
		user.first_name = username
		user.is_active = True
		user.save()
		PerfilUsuario.objects.update_or_create(user=user, defaults={'rol': role})
		created_users[username] = user

	grado_primero, _ = Grado.objects.get_or_create(nombre='Primero A', defaults={'activo': True})
	grado_segundo, _ = Grado.objects.get_or_create(nombre='Segundo A', defaults={'activo': True})

	estudiantes = [
		('Ana', 'García', 'VERCEL-0001', grado_primero),
		('Luis', 'Rodríguez', 'VERCEL-0002', grado_primero),
		('Sofía', 'Martínez', 'VERCEL-0003', grado_segundo),
	]
	created_students = []
	for nombre, apellido, documento, grado in estudiantes:
		student, _ = Estudiante.objects.get_or_create(
			documento_identidad=documento,
			defaults={
				'nombre': nombre,
				'apellido': apellido,
				'grado': grado,
			},
		)
		created_students.append(student)

	for student, subject, value in [
		(created_students[0], 'Matemáticas', '4.50'),
		(created_students[1], 'Ciencias', '4.00'),
		(created_students[2], 'Lengua', '4.25'),
	]:
		Nota.objects.get_or_create(
			estudiante=student,
			materia=subject,
			profesor_que_registro=created_users['Docente'],
			defaults={'valor_nota': value},
		)

	for student in created_students:
		Pago.objects.get_or_create(
			estudiante=student,
			registrado_por=created_users['Admin'],
			defaults={
				'monto': '150000.00',
				'metodo_pago': 'EFECTIVO',
				'referencia_comprobante': 'VERCEL-DEMO',
			},
		)
		Asistencia.objects.get_or_create(
			estudiante=student,
			fecha=timezone.localdate(),
			defaults={
				'grado': student.grado.nombre,
				'estado': 'PRESENTE',
				'registrado_por': created_users['Docente'],
			},
		)

	HistorialModificacion.objects.get_or_create(
		tipo='NOTA',
		usuario_que_modifico=created_users['Docente'],
		valor_anterior='4.00',
		valor_nuevo='4.50',
		defaults={'justificacion': 'Registro inicial de demostración en Vercel.'},
	)


if 'VERCEL' in os.environ:
	_initialize_vercel_database()
