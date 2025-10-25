from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Usuario
from rest_framework.authtoken.models import Token

class UsuarioViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Usuario.objects.create_user(
            email="existente@email.com",
            password="123456",
            tipo="estudante"
        )

    def test_registro_usuario_success(self):
        data = {
            "email": "novo@email.com",
            "password": "123456",
            "tipo": "profissional"
        }
        response = self.client.post("/api/registro/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("mensagem", response.data)
        self.assertTrue(Usuario.objects.filter(email="novo@email.com").exists())

    def test_registro_usuario_exists(self):
        data = {
            "email": "existente@email.com",
            "password": "123456",
            "tipo": "estudante"
        }
        response = self.client.post("/api/registro/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("erro", response.data)

    def test_registro_usuario_required_fields(self):
        data = {"email": "", "password": "", "tipo": ""}
        response = self.client.post("/api/registro/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("erro", response.data)


    def test_login_usuario_success(self):
        data = {"email": "existente@email.com", "password": "123456"}
        response = self.client.post("/api/login/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("mensagem", response.data)
        self.assertIn("email", response.data)
        self.assertIn("tipo", response.data)
        self.assertIn("token", response.data)

    def test_login_usuario_invalids_credentials(self):
        data = {"email": "existente@email.com", "password": "senhaerrada"}
        response = self.client.post("/api/login/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("erro", response.data)

    def test_login_usuario_not_exists(self):
        data = {"email": "naoexiste@email.com", "password": "123456"}
        response = self.client.post("/api/login/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("erro", response.data)
