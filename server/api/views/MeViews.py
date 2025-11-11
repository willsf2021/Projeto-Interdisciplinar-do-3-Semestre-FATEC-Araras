# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.conf import settings


class CheckSessionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"detail": "Token válido"}, status=200)


class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "type": user.type,
            "avatar_url": user.avatar_url,
        }, status=200)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"mensagem": "Logout realizado com sucesso"}, status=200)

        response.delete_cookie("access")
        response.delete_cookie("refresh")
        
        return response


class RefreshTokenView(APIView):
    """
    Renova o access token usando o refresh token do cookie
    """
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            return Response(
                {"erro": "Refresh token não encontrado"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)

            access_max_age = int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())

            response = Response(
                {"mensagem": "Token renovado com sucesso"},
                status=status.HTTP_200_OK
            )

            response.set_cookie(
                key="access",
                value=new_access_token,
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=access_max_age,
            )

            return response

        except Exception as e:
            return Response(
                {"erro": f"Token inválido ou expirado: {str(e)}"},
                status=status.HTTP_401_UNAUTHORIZED
            )