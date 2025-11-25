from django.urls import reverse, resolve
from api.views import ChangePasswordView


def test_change_password_url_resolves_correct_view():
    """Garante que a URL alterar-senha resolve para ChangePasswordView."""
    path = reverse("alterar-senha")
    resolver = resolve(path)

    assert resolver.func.view_class is ChangePasswordView
