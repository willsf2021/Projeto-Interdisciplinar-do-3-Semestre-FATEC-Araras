from django.template.loader import render_to_string
from django.http import HttpResponse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from weasyprint import HTML, CSS
from api.models import Documento, Receita
from api.serializers import DocumentoCreateSerializer
from django.shortcuts import get_object_or_404
import os
from django.conf import settings


vertical = """
    @page {
        margin: 2cm;
        size: A4;
    }
    
    * {
        font-family: Arial, Helvetica, sans-serif;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
      }
      
      body {
        height: 100vh;
        width: 100vw;
        display:flex;
        align-items: center;
        justify-content: center;
      }
      
      main {
        border: 2px solid black;
        padding: 8px;
        max-width: fit-content;
      }
      main h1 {
        text-align: center;
        font-size: 26px;
        font-weight: 600;
      }
      p {
        font-size: 22px;
        white-space: nowrap;
      }
      #hr {
        height: 2px;
        background-color: black;
      }
      #hr2 {
        height: 8px;
        background-color: black;
      }

      .th {
        font-weight: normal;
        text-align: left;
      }

      .padding_12 {
        padding-left: 12px;
      }

      .th_porcoes {
        font-size: 22px;
      }

      table {
        margin-top: 4px;
        border-bottom: 4px solid black;
        border-collapse: collapse; 
      }

      th,
      td {
        border: 1px solid black;
        padding: 4px;
        text-align: left;
      }

      th:first-child,
      td:first-child {
        border-left: none;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }
      
      td {
        min-width: 72px;
      }

      tr:first-child th,
      tr:first-child td {
        border-top: none;
      }

      .th_porcoes {
        text-align: center;
      }
"""

horizontal = """
    @page {
        margin: 2cm;
        size: A4;
    }
    
    * {
        font-family: Arial, Helvetica, sans-serif;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
      }

      body {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      main {
        border: 2px solid black;
        padding: 8px;
        max-width: min-content;
        display: flex;
        column-gap: 12px;
      }

      main h1 {
        text-align: left;
        font-size: 26px;
        font-weight: 600;
      }

      header {
        width: 187px;
      }

      p {
        font-size: 22px;
      }

      .th p {
        white-space: nowrap;
      }
      #hr {
        height: 8px;
        background-color: black;
      }
      #hr2 {
        display: none;
      }

      .th {
        font-weight: normal;
        text-align: left;
      }

      .padding_12 {
        padding-left: 12px;
      }

      .th_porcoes {
        font-size: 22px;
      }

      table {
        margin-top: 4px;
        border-bottom: 4px solid black;
        border-collapse: collapse;
      }

      th,
      td {
        border: 1px solid black;
        padding: 4px;
        text-align: left;
      }

      th:first-child,
      td:first-child {
        border-left: none;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }

      td {
        min-width: 72px;
      }

      tr:first-child th,
      tr:first-child td {
        border-top: none;
      }

      .th_porcoes {
        text-align: center;
      }
"""   

vertical_quebrado = """
      @page {
          margin: 2cm;
          size: A4 landscape;
      }
      
      * {
        font-family: Arial, Helvetica, sans-serif;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
      }

      body {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      main {
        border: 2px solid black;
        padding: 8px;
        max-width: fit-content;
      }
      main h1 {
        text-align: center;
        font-size: 26px;
        font-weight: 600;
      }
      p {
        font-size: 22px;
        white-space: nowrap;
      }
      #hr {
        height: 2px;
        background-color: black;
      }
      #hr2 {
        height: 8px;
        background-color: black;
      }

      .th {
        font-weight: normal;
        text-align: left;
      }

      .padding_12 {
        padding-left: 12px;
      }

      .th_porcoes {
        font-size: 22px;
      }

      table {
        margin-top: 4px;
        border-bottom: 4px solid black;
        border-collapse: collapse;
      }

      th,
      td {
        border: 1px solid black;
        padding: 4px;
        text-align: left;
      }

      th:first-child,
      td:first-child {
        border-left: none;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }

      td {
        min-width: 72px;
      }

      tr:first-child th,
      tr:first-child td {
        border-top: none;
      }

      .th_porcoes {
        text-align: center;
      }

      .container_tables {
        display: flex;
        flex-direction: column;
      }

      .main_container_tables {
        display: flex;
        column-gap: 8px;
      }
      
      .main_container_tables table:nth-child(2){
        margin-right: 8px;
      }

      .container_porcoes {
        display: flex;
        padding: 4px 0px;
      }

      .container_porcoes p:nth-child(1)::after {
        content: "";
        background-color: black;
        display: inline-block;
        min-width: 12px;
        min-height: 12px;
        border-radius: 50%;
        margin: 0px 8px;
      }
""" 

horizontal_quebrado = """
@page {
          margin: 2cm;
          size: A3 landscape;
      }
* {
        font-family: Arial, Helvetica, sans-serif;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
      }

      body {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      main {
        border: 2px solid black;
        padding: 8px;
        max-width: min-content;
        display: flex;
        column-gap: 12px;
      }

      main h1 {
        text-align: left;
        font-size: 26px;
        font-weight: 600;
      }

      header {
        width: 187px;
      }
   
      p {
        font-size: 22px;
      }

      .th p {
        white-space: nowrap;
      }

      #hr {
        height: 8px;
        background-color: black;
      }

      .th {
        font-weight: normal;
        text-align: left;
      }

      .padding_12 {
        padding-left: 12px;
      }

      .th_porcoes {
        font-size: 22px;
      }

      table {
        margin-top: 4px;
        border-bottom: 4px solid black;
        border-collapse: collapse;
      }

      th,
      td {
        border: 1px solid black;
        padding: 4px;
        text-align: left;
      }

      th:first-child,
      td:first-child {
        border-left: none;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }

      td {
        min-width: 72px;
      }

      tr:first-child th,
      tr:first-child td {
        border-top: none;
      }

      .th_porcoes {
        text-align: center;
      }

      .container_tables {
        display: flex;
        flex-direction: column;
      }

      .main_container_tables {
        display: flex;
        column-gap: 8px;
      }
"""

class DocumentoPdfView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, documento_id):
        documento = get_object_or_404(Documento, id=documento_id)

        if documento.usuario != request.user:
            return Response({"error": "Sem permissão"}, status=status.HTTP_403_FORBIDDEN)

        receita = documento.receita
        context = {
            'documento': documento,
            'cliente': documento.cliente,
            'ingredientes': receita.ingredientes.all(),
            'precificacao': {
                'habilitada': receita.habilitar_precificacao,
                'custo_total': receita.custo_total,
                'lucro': receita.lucro,
                'preco_sugerido': receita.preco_sugerido,
                'markup': receita.markup,
            } if receita.habilitar_precificacao else None,
        }

        html_string = render_to_string("documento_completo.html", context)

        try:
            pdf_file = HTML(string=html_string).write_pdf(stylesheets=[CSS(string=self._get_css_generico())])
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        filename = f"documento_{documento_id}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(settings.MEDIA_ROOT, 'documentos', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        with open(filepath, 'wb') as f:
            f.write(pdf_file)

        documento.arquivo_pdf = f'documentos/{filename}'
        documento.pdf_gerado = True
        documento.data_geracao_pdf = timezone.now()
        documento.save()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response
    
    def _get_css_generico(self):
        return """
        @page {
            margin: 1cm;
            size: A4;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            background-color: #f5f5f5;
            padding: 5px;
        }
        
        .receita-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .receita-table, .receita-table th, .receita-table td {
            border: 1px solid #ddd;
        }
        .receita-table th, .receita-table td {
            padding: 8px;
            text-align: left;
        }
        .receita-table th {
            background-color: #f2f2f2;
        }

        .rotulo-container * {
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }
        
        .rotulo-container table {
            border-collapse: collapse !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .rotulo-container th,
        .rotulo-container td {
            border: 1px solid black !important;
            padding: 4px !important;
            text-align: left !important;
            font-weight: normal !important;
            background: transparent !important;
        }
        
        .rotulo-container h1 {
            text-align: center !important;
            font-size: 26px !important;
            font-weight: 600 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .rotulo-container p {
            font-size: 22px !important;
            white-space: nowrap !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        """
    
class RotuloPdfView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    CSS_MAP = {
        'vertical': vertical,
        'horizontal': horizontal,
        'vertical_quebrado': vertical_quebrado,
        'horizontal_quebrado': horizontal_quebrado,
    }

    def get(self, request, documento_id):
        documento = get_object_or_404(Documento, id=documento_id)
        receita = documento.receita

        if documento.usuario != request.user:
            return Response({"error": "Sem permissão"}, status=status.HTTP_403_FORBIDDEN)

        if not receita.habilitar_rotulo_nutricional:
            return Response({"error": "Rótulo não habilitado"}, status=status.HTTP_400_BAD_REQUEST)

        template_name = "rotulo_quebrado.html" if receita.formato_rotulo in ['vertical_quebrado','horizontal_quebrado'] else "rotulo.html"
        css_string = self.CSS_MAP.get(receita.formato_rotulo, vertical)

        context = {
            'documento': documento,
            'receita': receita,
            'ingredientes': receita.ingredientes.all(),
            'rotulo_nutricional': self._preparar_dados_rotulo(receita),
            'formato_rotulo': receita.formato_rotulo,
        }

        html_string = render_to_string(template_name, context)

        try:
            pdf_file = HTML(string=html_string).write_pdf(stylesheets=[CSS(string=css_string)])
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        filename = f"rotulo_{documento_id}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(settings.MEDIA_ROOT, 'documentos', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        with open(filepath, 'wb') as f:
            f.write(pdf_file)

        documento.arquivo_rotulo_pdf = f'documentos/{filename}'
        documento.save()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response
    
    def _preparar_dados_rotulo(self, receita):
        """Prepara dados específicos para o rótulo nutricional"""
        try:
            nutrientes_totais = receita.calcular_nutrientes_totais()
            nutrientes_por_100g = receita.calcular_nutrientes_por_100g()  # ✅ NOVO MÉTODO
            nutrientes_porcao = receita.calcular_nutrientes_por_porcao()
            valores_diarios = receita.calcular_valores_diarios(nutrientes_porcao)
            
            print(f"DEBUG - Nutrientes totais: {nutrientes_totais}")
            print(f"DEBUG - Nutrientes por 100g: {nutrientes_por_100g}")
            print(f"DEBUG - Rendimento: {receita.rendimento}")
            
            return {
                'porcoes_embalagem': int(receita.rendimento),
                'porcao': f"{receita.porcao_individual}{receita.medida}",
                'valores_100g': nutrientes_por_100g,  # ✅ CORRIGIDO
                'valores_porcao': nutrientes_porcao,
                'valores_diarios': valores_diarios,
            }
        except Exception as e:
            print(f"DEBUG - Erro ao preparar dados do rótulo: {str(e)}")
            return None
  
class DocumentoCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def post(self, request):
        serializer = DocumentoCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            documento = serializer.save()
            return Response({
                "id": documento.id,
                "message": "Documento criado com sucesso. Use o endpoint de geração de PDF para gerar o arquivo."
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentoListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        documentos = Documento.objects.filter(usuario=request.user)
        data = []
        for doc in documentos:
            data.append({
                'id': doc.id,
                'receita_nome': doc.receita.nome,
                'cliente_nome': doc.cliente.nome_completo if doc.cliente else None,
                'formato_documento': doc.formato_documento,
                'pdf_gerado': doc.pdf_gerado,
                'data_geracao': doc.data_geracao_pdf,
                'created_at': doc.created_at,
            })
        return Response(data)