# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.conf import settings
from api.models import Usuario
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated


class CheckSessionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"detail": "Token válido"}, status=200)


class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        avatar_url = user.avatar.url if user.avatar else None
        
        return Response({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "type": user.type,
            "avatar_url": avatar_url,
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
            
            
            
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        data = request.data
        new_name = data.get("name")
        
        if new_name is not None:
            user.name = new_name

        user.save()
        return Response(
            {
                "message": "Usuário atualizado com sucesso.",
                "name": user.name,
            },
            status=status.HTTP_200_OK
        )
        
        
class AvatarUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        user = request.user
        
        if 'avatar' not in request.FILES:
            return Response({"erro": "Nenhuma imagem enviada."}, status=400)
        
        avatar_file = request.FILES['avatar']
        
        # Validações
        if avatar_file.size > 5 * 1024 * 1024:  # 5MB
            return Response({"erro": "Arquivo muito grande. Tamanho máximo: 5MB."}, status=400)
        
        if not avatar_file.content_type.startswith('image/'):
            return Response({"erro": "Apenas arquivos de imagem são permitidos."}, status=400)
        
        try:
            # Remove avatar anterior se existir
            if user.avatar:
                user.avatar.delete(save=False)
            
            # Salva o novo avatar
            user.avatar = avatar_file
            user.save()
            
            return Response({
                "mensagem": "Avatar atualizado com sucesso.",
                "avatar_url": user.avatar.url
            })
            
        except Exception as e:
            return Response({
                "erro": f"Erro ao atualizar avatar: {str(e)}"
            }, status=500)