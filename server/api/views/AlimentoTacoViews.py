from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from api.models import AlimentoTaco
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.serializers import AlimentoTacoSerializer

class AlimentoTacoView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):

        alimentos = AlimentoTaco.objects.all()
        nome = request.GET.get('nome')
        if nome:
            alimentos = alimentos.filter(nome__icontains=nome)
        
        categoria = request.GET.get('categoria')
        if categoria:
            alimentos = alimentos.filter(categoria__icontains=categoria)

        serializer = AlimentoTacoSerializer(alimentos, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)