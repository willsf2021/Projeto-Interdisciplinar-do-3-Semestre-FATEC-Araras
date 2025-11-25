import importlib
import unittest
from unittest.mock import MagicMock, patch

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import TokenError


def find_cookie_jwt_auth_class():
    """
    Tenta importar CookieJWTAuthentication de locais comuns.
    Se não encontrar, levanta ImportError com instruções.
    """
    candidates = [
        "api.authentication",
        "api.auth",
        "api.views",
        "api.jwt_auth",
        "api.utils",
        "authentication",
        "auth",
    ]
    for module_name in candidates:
        try:
            mod = importlib.import_module(module_name)
        except Exception:
            continue
        if hasattr(mod, "CookieJWTAuthentication"):
            return getattr(mod, "CookieJWTAuthentication")
    # Tenta varredura direta em pacote 'api'
    try:
        mod = importlib.import_module("api")
        if hasattr(mod, "CookieJWTAuthentication"):
            return getattr(mod, "CookieJWTAuthentication")
    except Exception:
        pass

    raise ImportError(
        "Não foi possível localizar `CookieJWTAuthentication`. "
        "Coloque a classe em um desses módulos: "
        + ", ".join(candidates)
        + " ou ajuste este teste para apontar o caminho correto."
    )


# Tenta obter a classe (levanta ImportError explicativo caso não encontre)
CookieJWTAuthentication = find_cookie_jwt_auth_class()


class TestCookieJWTAuthentication(unittest.TestCase):
    def setUp(self):
        self.auth = CookieJWTAuthentication()

    def test_authenticate_without_cookie_returns_none(self):
        """Se não houver cookie 'access', retorna None."""
        request = MagicMock()
        request.COOKIES = {}

        result = self.auth.authenticate(request)
        self.assertIsNone(result)

    @patch.object(CookieJWTAuthentication, "get_validated_token")
    @patch.object(CookieJWTAuthentication, "get_user")
    def test_authenticate_success(self, mock_get_user, mock_get_validated_token):
        """Fluxo completo: token válido e usuário retornado."""
        request = MagicMock()
        request.COOKIES = {"access": "valid_token"}

        mock_get_validated_token.return_value = "validated_token"
        mock_get_user.return_value = "mock_user"

        user, token = self.auth.authenticate(request)

        self.assertEqual(user, "mock_user")
        self.assertEqual(token, "validated_token")
        mock_get_validated_token.assert_called_once_with("valid_token")
        mock_get_user.assert_called_once_with("validated_token")

    @patch.object(CookieJWTAuthentication, "get_validated_token")
    def test_authenticate_tokenerror_raises_authenticationfailed(self, mock_get_validated_token):
        """TokenError deve levantar AuthenticationFailed com mensagem específica."""
        mock_get_validated_token.side_effect = TokenError("invalid")
        request = MagicMock()
        request.COOKIES = {"access": "bad_token"}

        with self.assertRaises(AuthenticationFailed) as cm:
            self.auth.authenticate(request)

        self.assertIn("Token inválido ou expirado", str(cm.exception))

    @patch.object(CookieJWTAuthentication, "get_validated_token")
    def test_authenticate_generic_exception_raises_authenticationfailed(self, mock_get_validated_token):
        """Exceção genérica gera AuthenticationFailed com mensagem genérica."""
        mock_get_validated_token.side_effect = Exception("some error")
        request = MagicMock()
        request.COOKIES = {"access": "bad_token"}

        with self.assertRaises(AuthenticationFailed) as cm:
            self.auth.authenticate(request)

        # Mensagem definida no seu código para exceção genérica
        self.assertIn("Usuário inválido ou token expirado", str(cm.exception))


if __name__ == "__main__":
    unittest.main()