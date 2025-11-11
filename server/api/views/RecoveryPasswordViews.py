from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
User = get_user_model()



class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'detail': 'O campo de e-mail é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Nenhum usuário encontrado com esse e-mail.'}, status=status.HTTP_404_NOT_FOUND)

        # Gera token e UID codificado
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

        send_mail(
            subject='Redefinição de senha',
            message=f'Olá {user.name},\n\nClique no link para redefinir sua senha:\n{reset_link}',
            from_email=None,  # usa DEFAULT_FROM_EMAIL
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({'detail': 'E-mail de redefinição enviado com sucesso!'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, uidb64, token):
        new_password = request.data.get('new_password')

        if not new_password:
            return Response({'detail': 'A nova senha é obrigatória.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({'detail': 'Link inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Token inválido ou expirado.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Senha redefinida com sucesso!'}, status=status.HTTP_200_OK)
