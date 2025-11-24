from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Receita
from api.serializers import RotuloNutricionalSerializer
from django.shortcuts import get_object_or_404

class RotuloNutricionalBaseView(APIView):
    permission_classes = [IsAuthenticated]
    
class RotuloNutricionalView(RotuloNutricionalBaseView):
    def get(self, request, receita_id):
        receita = get_object_or_404(Receita, id=receita_id)
        
        if receita.usuario != request.user:
            return Response(
                {"error": "Você não tem permissão para visualizar esta receita."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        nutrientes_totais = receita.calcular_nutrientes_totais()
        nutrientes_por_100g = receita.calcular_nutrientes_por_100g()
        nutrientes_porcao = receita.calcular_nutrientes_por_porcao()
        valores_diarios = receita.calcular_valores_diarios(nutrientes_porcao)

        porcao_formatada = f"{receita.medida_caseira} ({receita.porcao_individual}{receita.get_medida_display()})"

        rotulo_data = {
            'porcoes_por_embalagem': int(receita.rendimento),
            'porcao': porcao_formatada, 
            
            # Valores por 100g (mantém igual)
            'valor_energetico_100g': nutrientes_por_100g['valor_energetico'],
            'proteinas_100g': nutrientes_por_100g['proteinas'],
            'carboidratos_100g': nutrientes_por_100g['carboidratos'],
            'acucares_totais_100g': nutrientes_por_100g['acucares_totais'],
            'acucares_adicionados_100g': nutrientes_por_100g['acucares_adicionados'],
            'gorduras_totais_100g': nutrientes_por_100g['gorduras_totais'],
            'gorduras_saturadas_100g': nutrientes_por_100g['gorduras_saturadas'],
            'gorduras_trans_100g': nutrientes_por_100g['gorduras_trans'],
            'fibra_alimentar_100g': nutrientes_por_100g['fibra_alimentar'],
            'sodio_100g': nutrientes_por_100g['sodio'],

            # Valores por porção (mantém igual)
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

            # % Valores Diários (mantém igual)
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