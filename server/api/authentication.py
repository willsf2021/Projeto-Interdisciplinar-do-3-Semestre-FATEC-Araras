from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access")

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
        except TokenError as e:
            raise AuthenticationFailed(f"Token inválido ou expirado: {e}")
        except Exception:
            raise AuthenticationFailed("Usuário inválido ou token expirado.")

        return (user, validated_token)
