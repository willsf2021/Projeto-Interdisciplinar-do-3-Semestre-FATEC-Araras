import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from api.views import (
    CheckSessionView,
    GetUserView,
    LogoutView,
    RefreshTokenView,
    UpdateUserView,
    AvatarUpdateView,
    DeleteAccountView,
)


client = APIClient()


def test_url_check_session():
    url = reverse("me-check-session")
    response = client.get(url)
    assert response.status_code in (200, 401)


def test_url_get_user():
    url = reverse("me-get-user")
    response = client.get(url)
    assert response.status_code in (200, 401)


def test_url_logout():
    url = reverse("logout-user")
    response = client.post(url)
    assert response.status_code in (200, 401)


def test_url_refresh():
    url = reverse("token-refresh")
    response = client.post(url, {"refresh": "token-invalido"})
    assert response.status_code in (200, 400, 401)


def test_url_update_user():
    url = reverse("update-user")
    response = client.patch(url, {"name": "novo"})
    assert response.status_code in (200, 400, 401)


def test_url_update_avatar():
    url = reverse("update-avatar")
    response = client.post(url, {})
    assert response.status_code in (200, 400, 401)


def test_url_delete_account():
    url = reverse("delete-account")
    response = client.delete(url)
    assert response.status_code in (200, 400, 401)