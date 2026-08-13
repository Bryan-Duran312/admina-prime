import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from .models import Estudiante, Nota, PerfilUsuario


class NotaCorrectionAjaxTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='profesor', password='secure123')
        PerfilUsuario.objects.create(user=self.user, rol='PROFESOR')
        self.estudiante = Estudiante.objects.create(
            nombre='Ana',
            apellido='García',
            documento_identidad='123456789',
            grado='Grado 5',
        )
        self.nota = Nota.objects.create(
            estudiante=self.estudiante,
            materia='Matemáticas',
            valor_nota='3.80',
            profesor_que_registro=self.user,
        )

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
