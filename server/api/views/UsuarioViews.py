from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from api.models import Usuario
from rest_framework.permissions import AllowAny


from rest_framework.authtoken.models import Token

class RegistroView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        tipo = request.data.get('tipo')

        if not email or not password or not tipo:
            return Response({"erro": "Campos obrigatórios: email, password e tipo."}, status=400)

        if Usuario.objects.filter(email=email).exists():
            return Response({"erro": "Usuário já existe."}, status=400)

        user = Usuario.objects.create_user(email=email, password=password, tipo=tipo)
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "mensagem": "Usuário registrado com sucesso.",
            "email": user.email,
            "tipo": user.tipo,
            "token": token.key
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

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "mensagem": "Login bem-sucedido.",
            "email": user.email,
            "tipo": user.tipo,
            "token": token.key
        })
