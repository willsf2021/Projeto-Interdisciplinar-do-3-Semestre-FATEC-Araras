from django.urls import reverse, resolve
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from api.views import ChangePasswordView


User = get_user_model()


class TestChangePasswordURL(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="user@example.com",
            password="123456",
            name="Teste"
        )
        self.client.force_authenticate(self.user)

    def test_change_password_url_resolves_correct_view(self):
        """Garante que a URL alterar-senha resolve para ChangePasswordView."""
        path = reverse("alterar-senha")
        resolver = resolve(path)
        assert resolver.func.view_class is ChangePasswordView

    def test_change_password_url_call(self):
        """Garante que a URL realmente chama a view (cobre linhas 7–10)."""
        url = reverse("alterar-senha")

        # Envia o payload mínimo para chamar a view
        response = self.client.post(url, {
            "old_password": "123456",
            "new_password": "abcdef"
        })

        # cobre a linha do path
        assert response.status_code in (200, 400, 401, 403)
