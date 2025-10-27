from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from api.models import Usuario

class RegistroView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        type = request.data.get('type')

        if not email or not password or not type:
            return Response({"erro": "Campos obrigatórios: email, password e type."}, status=400)

        if Usuario.objects.filter(email=email).exists():
            return Response({"erro": "Usuário já existe."}, status=400)

        user = Usuario.objects.create_user(email=email, password=password, type=type)

        refresh = RefreshToken.for_user(user)

        return Response({
            "mensagem": "Usuário registrado com sucesso.",
            "email": user.email,
            "type": user.type,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"erro": "Credenciais inválidas."}, status=401)

        refresh = RefreshToken.for_user(user)

        return Response({
            "mensagem": "Login bem-sucedido.",
            "email": user.email,
            "type": user.type,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
