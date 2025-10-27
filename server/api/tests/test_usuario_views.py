from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from api.models import Usuario
from rest_framework.authtoken.models import Token


class UsuarioViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Usuario.objects.create_user(
            email="existente@email.com",
            password="123456",
            tipo="estudante"
        )

    # --------------------
    # REGISTRO NORMAL
    # --------------------
    def test_registro_usuario_success(self):
        """Testa registro de novo usuário manual"""
        data = {
            "email": "novo@email.com",
            "password": "123456",
            "tipo": "profissional"
        }
        response = self.client.post("/api/registro/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("mensagem", response.data)
        self.assertTrue(Usuario.objects.filter(email="novo@email.com").exists())
        user = Usuario.objects.get(email="novo@email.com")
        self.assertEqual(user.login_social, "manual")
        self.assertIsNone(user.google_id)

    def test_registro_usuario_exists(self):
        """Testa erro ao registrar usuário já existente"""
        data = {
            "email": "existente@email.com",
            "password": "123456",
            "tipo": "estudante"
        }
        response = self.client.post("/api/registro/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("erro", response.data)

    def test_registro_usuario_required_fields(self):
        """Testa erro ao não enviar campos obrigatórios"""
        data = {"email": "", "password": "", "tipo": ""}
        response = self.client.post("/api/registro/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("erro", response.data)

    # --------------------
    # LOGIN NORMAL
    # --------------------
    def test_login_usuario_success(self):
        """Testa login com credenciais corretas"""
        data = {"email": "existente@email.com", "password": "123456"}
        response = self.client.post("/api/login/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("mensagem", response.data)
        self.assertIn("email", response.data)
        self.assertIn("tipo", response.data)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["email"], "existente@email.com")

    def test_login_usuario_invalid_credentials(self):
        """Testa login com senha incorreta"""
        data = {"email": "existente@email.com", "password": "senhaerrada"}
        response = self.client.post("/api/login/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("erro", response.data)

    def test_login_usuario_not_exists(self):
        """Testa login com usuário inexistente"""
        data = {"email": "naoexiste@email.com", "password": "123456"}
        response = self.client.post("/api/login/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("erro", response.data)


# --------------------
# AUTENTICAÇÃO GOOGLE
# --------------------
class GoogleAuthViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/google-auth/"
        self.mock_tokeninfo = {
            "email": "googleuser@example.com",
            "sub": "1234567890",
            "picture": "https://example.com/avatar.jpg",
            "email_verified": True,
            "aud": "mock_client_id"
        }

    @patch("api.views.google_auth.requests.get")
    def test_google_auth_creates_new_user(self, mock_get):
        """Testa criação de usuário novo via Google ID token"""
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = self.mock_tokeninfo

        response = self.client.post(self.url, {"id_token": "fake_id_token"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertIn("user", response.data)
        user_data = response.data["user"]

        user = Usuario.objects.get(email=self.mock_tokeninfo["email"])
        self.assertEqual(user_data["email"], user.email)
        self.assertEqual(user.login_social, "google")
        self.assertEqual(user.google_id, self.mock_tokeninfo["sub"])
        self.assertEqual(user.avatar, self.mock_tokeninfo["picture"])
        self.assertIsNone(user.password)

    @patch("api.views.google_auth.requests.get")
    def test_google_auth_existing_user_returns_token(self, mock_get):
        """Testa login com usuário Google já existente"""
        user = Usuario.objects.create_user(
            email="googleuser2@example.com",
            password=None,
            tipo="professor",
            login_social="google",
            google_id="abc123",
            avatar="https://example.com/a.png"
        )
        token = Token.objects.create(user=user)

        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "email": "googleuser2@example.com",
            "sub": "abc123",
            "picture": "https://example.com/a.png",
            "email_verified": True,
            "aud": "mock_client_id"
        }

        response = self.client.post(self.url, {"id_token": "fake_token"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["token"], token.key)
        self.assertEqual(response.data["user"]["email"], user.email)

    @patch("api.views.google_auth.requests.get")
    def test_google_auth_invalid_token(self, mock_get):
        """Testa resposta para token inválido"""
        mock_get.return_value.status_code = 400

        response = self.client.post(self.url, {"id_token": "invalid_token"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_google_auth_missing_token(self):
        """Testa erro se não for enviado id_token"""
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)