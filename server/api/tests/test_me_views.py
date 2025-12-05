import io
import tempfile
from PIL import Image

from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Usuario
from rest_framework_simplejwt.tokens import RefreshToken


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class UserViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = Usuario.objects.create_user(
            email="user@test.com",
            password="123456",
            name="User Test",
            type="estudante"
        )

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.refresh_token = str(refresh)

        self.client.cookies["access"] = self.access_token

    # -----------------------------------------------------
    # CHECK SESSION
    # -----------------------------------------------------
    def test_check_session_success(self):
        response = self.client.get("/api/check-session/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["detail"], "Token válido")

    def test_check_session_unauthenticated(self):
        client = APIClient()
        response = client.get("/api/check-session/")
        self.assertEqual(response.status_code, 401)

    # -----------------------------------------------------
    # GET USER
    # -----------------------------------------------------
    def test_get_user_success(self):
        response = self.client.get("/api/get-user/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["email"], "user@test.com")

    def test_get_user_unauthenticated(self):
        client = APIClient()
        response = client.get("/api/get-user/")
        self.assertEqual(response.status_code, 401)

    # -----------------------------------------------------
    # LOGOUT
    # -----------------------------------------------------
def test_logout_success(self):
    response = self.client.post("/api/logout/")
    self.assertEqual(response.status_code, 200)
    self.assertIn("mensagem", response.data)

    # A resposta deve conter cookies "de remoção" (valor vazio e max-age=0)
    self.assertIn("access", response.cookies)
    self.assertIn("refresh", response.cookies)

    # Verifica que os valores foram esvaziados (indicando remoção)
    self.assertEqual(response.cookies["access"].value, "")
    self.assertEqual(response.cookies["refresh"].value, "")

    # Verifica que o max-age foi definido como 0 (expiração imediata)
    self.assertEqual(response.cookies["access"]["max-age"], "0")
    self.assertEqual(response.cookies["refresh"]["max-age"], "0")

    # Após logout, tentar acessar rota protegida deve falhar
    resp2 = self.client.get("/api/get-user/")
    self.assertEqual(resp2.status_code, status.HTTP_401_UNAUTHORIZED)
    # -----------------------------------------------------
    # REFRESH TOKEN
    # -----------------------------------------------------
    def test_refresh_token_success(self):
        client = APIClient()
        client.cookies["refresh"] = self.refresh_token

        response = client.post("/api/refresh/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.cookies)

    def test_refresh_token_missing(self):
        client = APIClient()
        response = client.post("/api/refresh/")
        self.assertEqual(response.status_code, 401)

    def test_refresh_token_invalid(self):
        client = APIClient()
        client.cookies["refresh"] = "token_invalido"
        response = client.post("/api/refresh/")
        self.assertEqual(response.status_code, 401)

def test_refresh_token_sets_domain(self):
    client = APIClient()
    client.cookies["refresh"] = self.refresh_token

    response = client.post("/api/refresh/")
    self.assertEqual(response.status_code, 200)

    # garante que o cookie foi criado
    self.assertIn("access", response.cookies)

    # garante que o domain definido na view foi aplicado
    self.assertEqual(response.cookies["access"]["domain"], "192.168.0.5")

    # -----------------------------------------------------
    # UPDATE USER
    # -----------------------------------------------------
    def test_update_user_success(self):
        response = self.client.put("/api/update-user/", {"name": "Novo Nome"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Novo Nome")

    def test_update_user_unauthenticated(self):
        client = APIClient()
        response = client.put("/api/update-user/", {"name": "Novo Nome"}, format="json")
        self.assertEqual(response.status_code, 401)

    # -----------------------------------------------------
    # AVATAR UPDATE
    # -----------------------------------------------------
    def _make_image(self):
        file = io.BytesIO()
        image = Image.new("RGB", (100, 100), "red")
        image.save(file, "JPEG")
        file.name = "avatar.jpg"
        file.seek(0)
        return file

    def test_avatar_update_success(self):
        image = self._make_image()

        response = self.client.put(
            "/api/update-avatar/",
            {"avatar": image},
            format="multipart"
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("avatar_url", response.data)

    def test_avatar_update_no_file(self):
        response = self.client.put("/api/update-avatar/", {}, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_avatar_update_invalid_file(self):
        bad = io.BytesIO(b"invalid")
        bad.name = "file.txt"

        response = self.client.put("/api/update-avatar/", {"avatar": bad}, format="multipart")
        self.assertEqual(response.status_code, 400)

    # -----------------------------------------------------
    # DELETE ACCOUNT
    # -----------------------------------------------------
    def test_delete_account_success(self):
        response = self.client.delete("/api/delete-account/")
        self.assertEqual(response.status_code, 200)

        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)
        self.assertTrue(self.user.email.startswith("deleted_"))

    def test_delete_account_unauthenticated(self):
        client = APIClient()
        response = client.delete("/api/delete-account/")
        self.assertEqual(response.status_code, 401)