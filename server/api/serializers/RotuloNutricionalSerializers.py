from rest_framework import serializers
from api.models import Receita, Ingrediente, Documento, Cliente
from decimal import Decimal

class RotuloNutricionalSerializer(serializers.Serializer):
    porcoes_por_embalagem = serializers.IntegerField()
    porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    
    # Valores por 100g
    valor_energetico_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    proteinas_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    carboidratos_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    acucares_totais_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    acucares_adicionados_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    gorduras_totais_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    gorduras_saturadas_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    gorduras_trans_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    fibra_alimentar_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    sodio_100g = serializers.DecimalField(max_digits=8, decimal_places=2)
    
    # Valores por porção
    valor_energetico_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    proteinas_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    carboidratos_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    acucares_totais_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    acucares_adicionados_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    gorduras_totais_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    gorduras_saturadas_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    gorduras_trans_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    fibra_alimentar_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    sodio_porcao = serializers.DecimalField(max_digits=8, decimal_places=2)
    
    # % Valores Diários
    vd_valor_energetico = serializers.DecimalField(max_digits=8, decimal_places=2)
    vd_carboidratos = serializers.DecimalField(max_digits=8, decimal_places=2)
    vd_proteinas = serializers.DecimalField(max_digits=8, decimal_places=2)
    vd_gorduras_totais = serializers.DecimalField(max_digits=8, decimal_places=2)
    vd_gorduras_saturadas = serializers.DecimalField(max_digits=8, decimal_places=2)
    vd_fibra_alimentar = serializers.DecimalField(max_digits=8, decimal_places=2)
    vd_sodio = serializers.DecimalField(max_digits=8, decimal_places=2)

class DocumentoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = ['receita', 'cliente', 'declaracao_alergenicos', 'formato_documento']
    
    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)