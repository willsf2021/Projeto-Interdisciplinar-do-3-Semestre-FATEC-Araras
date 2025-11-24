from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Usuario
from rest_framework_simplejwt.tokens import RefreshToken


class ChangePasswordViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Cria usuário para testes
        self.user = Usuario.objects.create_user(
            email="teste@email.com",
            password="senha_antiga",
            name="Usuario Teste",
            type="estudante",
        )

        # Gera tokens do usuário
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        # URL da view
        self.url = reverse("alterar-senha")

    def test_change_password_success(self):
        # Simula autenticação via cookie
        self.client.cookies["access"] = self.access_token

        data = {
            "old_password": "senha_antiga",
            "new_password": "senha_nova_segura"
        }

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Senha alterada com sucesso!")

        # Confirma que realmente alterou
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("senha_nova_segura"))

    def test_change_password_wrong_old_password(self):
        self.client.cookies["access"] = self.access_token

        data = {
            "old_password": "senha_errada",
            "new_password": "senha_nova_segura"
        }

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Senha antiga incorreta.")

    def test_change_password_unauthenticated(self):
        # Sem cookie -> sem autenticação
        client = APIClient()

        data = {
            "old_password": "senha_antiga",
            "new_password": "nova123"
        }

        response = client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)