import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from .models import Estudiante, Nota, PerfilUsuario, Grado


class NotaCorrectionAjaxTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='profesor', password='secure123')
        PerfilUsuario.objects.create(user=self.user, rol='PROFESOR')
        self.grado = Grado.objects.create(nombre='Grado 5')
        self.estudiante = Estudiante.objects.create(
            nombre='Ana',
            apellido='García',
            documento_identidad='123456789',
            grado=self.grado,
        )
        self.nota = Nota.objects.create(
            estudiante=self.estudiante,
            materia='Matemáticas',
            valor_nota='3.80',
            profesor_que_registro=self.user,
        )

    def test_admin_views_are_available_and_hide_correction_actions(self):
        admin_user = User.objects.create_user(username='admin', password='secure123')
        PerfilUsuario.objects.create(user=admin_user, rol='ADMINISTRADOR')
        self.client.login(username='admin', password='secure123')

        for view_name in [
            'admin_inicio',
            'admin_matricular_estudiante',
            'admin_lista_estudiantes',
            'admin_registrar_pago',
            'admin_ultimos_pagos',
            'admin_ultimas_notas',
            'admin_auditoria',
        ]:
            response = self.client.get(reverse(view_name))
            self.assertEqual(response.status_code, 200, f'{view_name} should be reachable for admin users.')

        notes_page = self.client.get(reverse('admin_ultimas_notas'))
        self.assertContains(notes_page, 'Últimas Calificaciones Subidas')
        self.assertNotContains(notes_page, 'Corregir')

    def test_ajax_correction_returns_success_json(self):
        self.client.login(username='profesor', password='secure123')

        response = self.client.post(
            reverse('editar_nota', args=[self.nota.id]),
            {
                'valor_nota': '4.50',
                'justificacion': 'Se corrigió el valor por error de captura.'
            },
            HTTP_X_REQUESTED_WITH='XMLHttpRequest',
        )

        self.assertEqual(response.status_code, 200)
        payload = json.loads(response.content)
        self.assertTrue(payload['success'])
        self.assertIn('Corrección', payload['message'])

        self.nota.refresh_from_db()
        self.assertEqual(str(self.nota.valor_nota), '4.50')

    def test_teacher_dashboard_and_split_note_views_are_available(self):
        self.client.login(username='profesor', password='secure123')

        dashboard = self.client.get(reverse('dashboard_docente'))
        self.assertEqual(dashboard.status_code, 200)
        self.assertContains(dashboard, 'Bienvenido de nuevo')

        register = self.client.get(reverse('docente_registrar_nota'))
        self.assertEqual(register.status_code, 200)
        self.assertContains(register, 'Registrar Calificación')

        history = self.client.get(reverse('docente_historial_notas'))
        self.assertEqual(history.status_code, 200)
        self.assertContains(history, 'Historial de Calificaciones')

    def test_admin_grade_management_and_teacher_view_are_dynamic(self):
        admin_user = User.objects.create_user(username='admin_grade', password='secure123')
        PerfilUsuario.objects.create(user=admin_user, rol='ADMINISTRADOR')
        grado_db = Grado.objects.create(nombre='6°A')
        Grado.objects.create(nombre='Transición')

        self.client.login(username='admin_grade', password='secure123')
        admin_response = self.client.get(reverse('admin_gestion_grados'))
        self.assertEqual(admin_response.status_code, 200)
        self.assertContains(admin_response, 'Crear / Gestionar Grados')
        self.assertContains(admin_response, grado_db.nombre)

        self.client.logout()
        self.client.login(username='profesor', password='secure123')
        response = self.client.get(reverse('asistencia_grado'), {'grado': grado_db.nombre})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, grado_db.nombre)
        self.assertNotContains(response, '1° Grado')
