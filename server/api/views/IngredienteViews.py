# views.py - INGREDIENTES
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Ingrediente, Receita
from api.serializers import IngredienteSerializer, IngredienteListSerializer
from django.shortcuts import get_object_or_404


class IngredienteCreateView(APIView):
    """Adicionar ingrediente a uma receita"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, receita_id):

        receita = get_object_or_404(Receita, id=receita_id)
        
        if receita.usuario != request.user:
            return Response(
                {"error": "Você não tem permissão para adicionar ingredientes a esta receita."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data['receita'] = receita_id
        
        serializer = IngredienteSerializer(
            data=data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IngredienteUpdateView(APIView):
    """Editar ingrediente"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, ingrediente_id):
        ingrediente = get_object_or_404(Ingrediente, id=ingrediente_id)
        
        if ingrediente.receita.usuario != request.user:
            return Response(
                {"error": "Você não tem permissão para editar este ingrediente."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = IngredienteSerializer(
            ingrediente,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IngredienteDeleteView(APIView):
    """Deletar ingrediente"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, ingrediente_id):
        ingrediente = get_object_or_404(Ingrediente, id=ingrediente_id)
        
        # Verifica permissão
        if ingrediente.receita.usuario != request.user:
            return Response(
                {"error": "Você não tem permissão para deletar este ingrediente."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        alimento_nome = ingrediente.alimento.nome
        ingrediente.delete()
        
        return Response(
            {"message": f"Ingrediente '{alimento_nome}' removido com sucesso."},
            status=status.HTTP_200_OK
        )


class IngredienteListByReceitaView(APIView):
    """Listar todos os ingredientes de uma receita"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, receita_id):
        receita = get_object_or_404(Receita, id=receita_id)
        
        # Verifica permissão
        if receita.usuario != request.user:
            return Response(
                {"error": "Você não tem permissão para visualizar os ingredientes desta receita."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        ingredientes = Ingrediente.objects.filter(receita=receita)
        serializer = IngredienteListSerializer(ingredientes, many=True)
        
        return Response({
            'receita_id': receita.id,
            'receita_nome': receita.nome,
            'total_ingredientes': ingredientes.count(),
            'ingredientes': serializer.data
        }, status=status.HTTP_200_OK)


class IngredienteDetailView(APIView):
    """Ver detalhes de um ingrediente específico"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, ingrediente_id):
        ingrediente = get_object_or_404(Ingrediente, id=ingrediente_id)

        if ingrediente.receita.usuario != request.user:
            return Response(
                {"error": "Você não tem permissão para visualizar este ingrediente."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = IngredienteSerializer(ingrediente)
        return Response(serializer.data, status=status.HTTP_200_OK)