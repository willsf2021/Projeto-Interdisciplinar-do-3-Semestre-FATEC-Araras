from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Receita
from api.serializers import RotuloNutricionalSerializer
from django.shortcuts import get_object_or_404

class RotuloNutricionalView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, receita_id):
        receita = get_object_or_404(Receita, id=receita_id)
        
        if receita.usuario != request.user:
            return Response(
                {"error": "Você não tem permissão para visualizar esta receita."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Calcular todos os dados do rótulo
        nutrientes_totais = receita.calcular_nutrientes_totais()
        nutrientes_porcao = receita.calcular_nutrientes_por_porcao()
        valores_diarios = receita.calcular_valores_diarios(nutrientes_porcao)
        
        # Preparar dados para o serializer
        rotulo_data = {
            'porcoes_por_embalagem': int(receita.rendimento),
            'porcao': receita.porcao_individual,
            'medida_caseira': f"{receita.porcao_individual}{receita.medida}",
            
            # Valores por 100g
            'valor_energetico_100g': nutrientes_totais['valor_energetico'],
            'proteinas_100g': nutrientes_totais['proteinas'],
            'carboidratos_100g': nutrientes_totais['carboidratos'],
            'acucares_totais_100g': nutrientes_totais['acucares_totais'],
            'acucares_adicionados_100g': nutrientes_totais['acucares_adicionados'],
            'gorduras_totais_100g': nutrientes_totais['gorduras_totais'],
            'gorduras_saturadas_100g': nutrientes_totais['gorduras_saturadas'],
            'gorduras_trans_100g': nutrientes_totais['gorduras_trans'],
            'fibra_alimentar_100g': nutrientes_totais['fibra_alimentar'],
            'sodio_100g': nutrientes_totais['sodio'],
            
            # Valores por porção
            'valor_energetico_porcao': nutrientes_porcao['valor_energetico'],
            'proteinas_porcao': nutrientes_porcao['proteinas'],
            'carboidratos_porcao': nutrientes_porcao['carboidratos'],
            'acucares_totais_porcao': nutrientes_porcao['acucares_totais'],
            'acucares_adicionados_porcao': nutrientes_porcao['acucares_adicionados'],
            'gorduras_totais_porcao': nutrientes_porcao['gorduras_totais'],
            'gorduras_saturadas_porcao': nutrientes_porcao['gorduras_saturadas'],
            'gorduras_trans_porcao': nutrientes_porcao['gorduras_trans'],
            'fibra_alimentar_porcao': nutrientes_porcao['fibra_alimentar'],
            'sodio_porcao': nutrientes_porcao['sodio'],
            
            # % Valores Diários
            'vd_valor_energetico': valores_diarios['valor_energetico'],
            'vd_carboidratos': valores_diarios['carboidratos'],
            'vd_proteinas': valores_diarios['proteinas'],
            'vd_gorduras_totais': valores_diarios['gorduras_totais'],
            'vd_gorduras_saturadas': valores_diarios['gorduras_saturadas'],
            'vd_fibra_alimentar': valores_diarios['fibra_alimentar'],
            'vd_sodio': valores_diarios['sodio'],
        }
        
        serializer = RotuloNutricionalSerializer(rotulo_data)
        return Response(serializer.data)