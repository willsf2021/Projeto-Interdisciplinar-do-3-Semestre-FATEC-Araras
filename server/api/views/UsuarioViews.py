from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from api.models import Usuario


class UsuarioBaseView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

class RegistroView(UsuarioBaseView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name')
        type = request.data.get('type')
        avatar_url = request.data.get('avatar_url', None)

        if not email or not password or not name or not type:
            return Response(
                {"erro": "Campos obrigatórios: E-mail, Senha, Nome e Tipo de Usuário."},
                status=400
            )

        if Usuario.objects.filter(email=email).exists():
            return Response({"erro": "Usuário já existe."}, status=400)

        user = Usuario.objects.create_user(
            email=email,
            password=password,
            name=name,
            type=type,
            avatar_url=avatar_url
        )
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            "mensagem": "Usuário registrado com sucesso.",
            "email": user.email,
            "name": user.name,
            "type": user.type,
            "avatar_url": user.avatar_url,
        }, status=201)
        
        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=None,
        )
        response.set_cookie(
            key="refresh",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=None,
        )
        return response

class LoginView(UsuarioBaseView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        remember = request.data.get("remember", False)

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"erro": "Credenciais inválidas."}, status=401)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        max_age = 7 * 24 * 60 * 60 if remember else None

        response = Response({
            "mensagem": "Login bem-sucedido.",
            "email": user.email,
            "name": user.name,
            "type": user.type,
            "avatar_url": user.avatar_url,
        })
        
        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=max_age,
        )
        response.set_cookie(
            key="refresh",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=max_age,
        )
        return response
