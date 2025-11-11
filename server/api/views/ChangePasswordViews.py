from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.serializers import ChangePasswordSerializer


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']

        # Verifica se a senha antiga confere
        if not user.check_password(old_password):
            return Response({'detail': 'Senha antiga incorreta.'}, status=status.HTTP_400_BAD_REQUEST)

        # Define a nova senha
        user.set_password(new_password)
        user.save()

        return Response({'detail': 'Senha alterada com sucesso!'}, status=status.HTTP_200_OK)
