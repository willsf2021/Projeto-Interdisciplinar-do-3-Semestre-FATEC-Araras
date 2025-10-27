from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from api.models import Usuario
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth(request):
    token = request.data.get("token")
    user_type = request.data.get("type")  # precisa vir do frontend (ex: 'estudante')

    if not token:
        return Response(
            {"error": "Token não fornecido", "status": False},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user_type:
        return Response(
            {"error": "Tipo de usuário é obrigatório", "status": False},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Verifica o token com o Google
        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_OAUTH_CLIENT_ID
        )

        email = id_info.get("email")
        given_name = id_info.get("given_name", "")
        family_name = id_info.get("family_name", "")
        avatar_url = id_info.get("picture", "")

        if not email:
            return Response(
                {"error": "Email não encontrado no token", "status": False},
                status=status.HTTP_400_BAD_REQUEST
            )

        full_name = f"{given_name} {family_name}".strip()

        # Cria ou busca o usuário
        user, created = Usuario.objects.get_or_create(
            email=email,
            defaults={
                "name": full_name or email.split("@")[0],
                "type": user_type,
                "avatar_url": avatar_url,
            },
        )

        if not created:
            # Atualiza informações do perfil, caso venham atualizadas do Google
            updated = False
            if not user.avatar_url and avatar_url:
                user.avatar_url = avatar_url
                updated = True
            if not user.name and full_name:
                user.name = full_name
                updated = True
            if updated:
                user.save()

        # Gera tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                "user": {
                    "email": user.email,
                    "name": user.name,
                    "type": user.type,
                    "avatar_url": user.avatar_url,
                },
                "status": True,
            },
            status=status.HTTP_200_OK,
        )

    except ValueError:
        return Response(
            {"error": "Token inválido", "status": False},
            status=status.HTTP_400_BAD_REQUEST
        )
