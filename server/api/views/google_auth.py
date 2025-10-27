import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from pathlib import Path
import os
from dotenv import load_dotenv
# se estiver usando token auth do DRF
from rest_framework.authtoken.models import Token

# obtém o modelo de usuário customizado
User = get_user_model()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Lê variáveis de ambiente
load_dotenv(BASE_DIR / '.env')

# Busca a url de conulta Google 
GOOGLE_TOKENINFO_URL = os.getenv('GOOGLE_TOKEN_INFO_URL')

class GoogleAuthView(APIView):
    """
    POST /api/google-auth/
    Body: { "id_token": "<ID_TOKEN_FROM_GOOGLE>" }
    Resposta: usuário e token DRF
    """

    def post(self, request, *args, **kwargs):
        id_token = request.data.get('id_token')
        if not id_token:
            return Response({'detail': 'id_token é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        # validar token com Google
        try:
            resp = requests.get(GOOGLE_TOKENINFO_URL, params={'id_token': id_token}, timeout=5)
            if resp.status_code != 200:
                return Response({'detail': 'Token inválido ou expirado.'}, status=status.HTTP_400_BAD_REQUEST)
            token_info = resp.json()
        except requests.RequestException:
            return Response({'detail': 'Erro ao validar token com Google.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # token_info deve conter: email, sub (id), picture, email_verified
        email = token_info.get('email')
        google_id = token_info.get('sub')
        picture = token_info.get('picture')
        email_verified = token_info.get('email_verified') in ['true', 'True', True, '1', 1]

        if not email:
            return Response({'detail': 'Google token não forneceu email.'}, status=status.HTTP_400_BAD_REQUEST)

        # opcional: verificar audience (client_id) para segurança
        expected_aud = getattr(settings, 'GOOGLE_CLIENT_ID', None)
        aud = token_info.get('aud')
        if expected_aud and aud != expected_aud:
            return Response({'detail': 'Audience inválida no token do Google.'}, status=status.HTTP_400_BAD_REQUEST)

        # obter ou criar usuário
        try:
            user = User.objects.filter(email__iexact=email).first()
            if user:
                # se já existir e não tiver google_id, atualiza
                if not user.google_id:
                    user.google_id = google_id
                user.login_social = 'google'
                if picture:
                    user.avatar = picture
                user.save()
            else:
                # create user with a default tipo (você pode alterar isso conforme regra de negócio)
                user = User.objects.create_user(
                    email=email,
                    password=None,  # set_unusable_password via create_user implementado
                    tipo=getattr(settings, 'DEFAULT_USER_TIPO', 'estudante'),
                    login_social='google',
                    google_id=google_id,
                    avatar=picture
                )
        except Exception as e:
            return Response({'detail': 'Erro ao criar/atualizar usuário.', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        token, _ = Token.objects.get_or_create(user=user)

        data = {
            'token': token.key,
            'user': {
                'id': user.pk,
                'email': user.email,
                'tipo': user.tipo,
                'login_social': user.login_social,
                'google_id': user.google_id,
                'avatar': user.avatar,
            }
        }
        return Response(data, status=status.HTTP_200_OK)
