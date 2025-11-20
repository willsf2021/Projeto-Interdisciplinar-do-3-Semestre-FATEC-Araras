from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

User = get_user_model()


class TestPasswordResetRequestView(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_password_reset_request_success(self):
        user = User.objects.create_user(
            email="teste@example.com",
            password="123456",
            name="Teste User"
        )

        url = reverse("solicitar-recuperacao")
        response = self.client.post(url, {"email": user.email})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["detail"], "E-mail de redefinição enviado com sucesso!")

        # Verifica envio do email
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(user.email, mail.outbox[0].to)

    def test_password_reset_request_missing_email(self):
        url = reverse("solicitar-recuperacao")
        response = self.client.post(url, {})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "O campo de e-mail é obrigatório.")

    def test_password_reset_request_user_not_found(self):
        url = reverse("solicitar-recuperacao")
        response = self.client.post(url, {"email": "naoexiste@example.com"})

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["detail"], "Nenhum usuário encontrado com esse e-mail.")


class TestPasswordResetConfirmView(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_password_reset_confirm_success(self):
        user = User.objects.create_user(
            email="teste@example.com",
            password="123456",
            name="Teste User"
        )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        url = reverse("redefinir-senha", args=[uid, token])
        response = self.client.post(url, {"new_password": "novaSenha123"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["detail"], "Senha redefinida com sucesso!")

        user.refresh_from_db()
        self.assertTrue(user.check_password("novaSenha123"))

    def test_password_reset_confirm_missing_password(self):
        user = User.objects.create_user(
            email="teste@example.com",
            password="123456",
            name="Teste User"
        )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        url = reverse("redefinir-senha", args=[uid, token])
        response = self.client.post(url, {})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "A nova senha é obrigatória.")

    def test_password_reset_confirm_invalid_uid(self):
        url = reverse("redefinir-senha", args=["uid-invalido", "token"])
        response = self.client.post(url, {"new_password": "123"})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "Link inválido.")

    def test_password_reset_confirm_invalid_token(self):
        user = User.objects.create_user(
            email="teste@example.com",
            password="123456",
            name="Teste User"
        )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = "token-invalido"

        url = reverse("redefinir-senha", args=[uid, token])
        response = self.client.post(url, {"new_password": "novaSenha123"})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["detail"], "Token inválido ou expirado.")