# serializers.py
from rest_framework import serializers
from api.models import Receita

class ReceitaSerializer(serializers.ModelSerializer):
    # Campos somente leitura (calculados)
    peso_liquido_total = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    rendimento = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    custo_total = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    lucro = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    preco_sugerido = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    
    class Meta:
        model = Receita
        fields = [
            'id',
            'nome',
            'categoria',
            'tempo_preparo_horas',
            'tempo_preparo_minutos',
            'porcao_individual',
            'medida',
            'modo_preparo',
            'habilitar_precificacao',
            'markup',
            'habilitar_rotulo_nutricional',
            'formato_rotulo',
            'peso_liquido_total',
            'rendimento',
            'custo_total',
            'lucro',
            'preco_sugerido',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_porcao_individual(self, value):
        """Valida que a porção individual é positiva"""
        if value <= 0:
            raise serializers.ValidationError(
                "A porção individual deve ser maior que zero."
            )
        return value
    
    def validate_tempo_preparo_horas(self, value):
        """Valida que as horas não são negativas"""
        if value < 0:
            raise serializers.ValidationError(
                "As horas não podem ser negativas."
            )
        return value
    
    def validate_tempo_preparo_minutos(self, value):
        """Valida que os minutos estão no range correto"""
        if value < 0:
            raise serializers.ValidationError(
                "Os minutos não podem ser negativos."
            )
        if value >= 60:
            raise serializers.ValidationError(
                "Os minutos devem ser menores que 60."
            )
        return value
    
    def validate_markup(self, value):
        """Valida que o markup não é negativo"""
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "O markup não pode ser negativo."
            )
        return value
    
    def validate(self, data):
        """Validação cruzada de campos"""
        # Se a precificação não estiver habilitada, zera markup
        if not data.get('habilitar_precificacao', False):
            data['markup'] = None
        # Se habilitada mas markup não informado, define None (ou você pode setar 0)
        elif data.get('habilitar_precificacao') and data.get('markup') is None:
            data['markup'] = None
        
        # Garantir formato de rótulo apenas se rótulo nutricional habilitado
        if not data.get('habilitar_rotulo_nutricional', False):
            data['formato_rotulo'] = 'vertical'  # default

        return data
