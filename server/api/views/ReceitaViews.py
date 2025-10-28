from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Receita
from api.serializers import ReceitaSerializer
from django.shortcuts import get_object_or_404
from decimal import Decimal, InvalidOperation

class ReceitaBaseView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
class ReceitaCreateView(ReceitaBaseView):
    def post(self, request):
        serializer = ReceitaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ReceitaUpdateView(ReceitaBaseView):
    def put(self, request, receita_id):
        receita = get_object_or_404(Receita, id=receita_id)
        if receita.usuario != request.user:
            return Response({"error": "Você não tem permissão para editar esta receita."}, status=403)
        serializer = ReceitaSerializer(receita, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

class ReceitaDeleteView(ReceitaBaseView):
    def delete(self, request, receita_id):
        receita = get_object_or_404(Receita, id=receita_id)
        if receita.usuario != request.user:
            return Response({"error": "Você não tem permissão para deletar esta receita."}, status=403)
        receita_nome = receita.nome
        receita.delete()
        return Response({"message": f"Receita '{receita_nome}' deletada com sucesso."}, status=200)

class ReceitaListView(ReceitaBaseView):
    def get(self, request):
        receitas = Receita.objects.filter(usuario=request.user)
        serializer = ReceitaSerializer(receitas, many=True)
        return Response(serializer.data, status=200)