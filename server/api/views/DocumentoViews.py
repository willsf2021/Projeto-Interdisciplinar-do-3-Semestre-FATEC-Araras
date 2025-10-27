from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Documento, Receita, Cliente
from api.serializers import DocumentoSerializer
from django.shortcuts import get_object_or_404


class DocumentoCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        usuario = request.user
        data = request.data

        receita_id = data.get("receita_id")
        cliente_id = data.get("cliente_id")
        declaracao_alergenicos = data.get("declaracao_alergenicos", "")
        arquivo_pdf = data.get("arquivo_pdf")

        if not receita_id:
            return Response(
                {"error": "Receita é obrigatória", "status": False},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not arquivo_pdf:
            return Response(
                {"error": "Arquivo PDF é obrigatório", "status": False},
                status=status.HTTP_400_BAD_REQUEST
            )

        receita = get_object_or_404(Receita, id=receita_id)
        cliente = None
        if cliente_id:
            cliente = get_object_or_404(Cliente, id=cliente_id)

        documento = Documento.objects.create(
            usuario=usuario,
            receita=receita,
            cliente=cliente,
            declaracao_alergenicos=declaracao_alergenicos,
            arquivo_pdf=arquivo_pdf
        )

        serializer = DocumentoSerializer(documento)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
