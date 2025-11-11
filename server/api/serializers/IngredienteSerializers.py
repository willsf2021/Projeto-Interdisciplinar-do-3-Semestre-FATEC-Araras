# serializers.py
from rest_framework import serializers
from api.models import Ingrediente, Receita, AlimentoTaco


class IngredienteSerializer(serializers.ModelSerializer):

    per_capita_bruto = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    custo_unitario = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    custo_total = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    alimento_nome = serializers.CharField(source='alimento.nome', read_only=True)
    receita_nome = serializers.CharField(source='receita.nome', read_only=True)
    
    class Meta:
        model = Ingrediente
        fields = [
            'id',
            'receita',
            'receita_nome',
            'alimento',
            'alimento_nome',
            'peso_bruto',
            'peso_liquido',
            'peso_processado',
            'custo_embalagem',
            'quantidade_embalagem',
            'per_capita_bruto',
            'custo_unitario',
            'custo_total',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_receita(self, value):
        """Valida que a receita existe e pertence ao usuário autenticado"""
        request = self.context.get('request')
        if request and request.user:
            if value.usuario != request.user:
                raise serializers.ValidationError(
                    "Você não tem permissão para adicionar ingredientes a esta receita."
                )
        return value
    
    def validate_alimento(self, value):
        """Valida que o alimento existe"""
        if not value:
            raise serializers.ValidationError("O alimento é obrigatório.")
        return value
    
    def validate_peso_bruto(self, value):
        """Valida que o peso bruto é positivo"""
        if value <= 0:
            raise serializers.ValidationError(
                "O peso bruto deve ser maior que zero."
            )
        return value
    
    def validate_peso_liquido(self, value):
        """Valida que o peso líquido é positivo"""
        if value <= 0:
            raise serializers.ValidationError(
                "O peso líquido deve ser maior que zero."
            )
        return value
    
    def validate_peso_processado(self, value):
        """Valida que o peso processado é positivo (se fornecido)"""
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                "O peso processado deve ser maior que zero."
            )
        return value
    
    def validate(self, data):
        """Validações cruzadas"""
        peso_bruto = data.get('peso_bruto')
        peso_liquido = data.get('peso_liquido')
        peso_processado = data.get('peso_processado')
        
        # Peso líquido não pode ser maior que peso bruto
        if peso_bruto and peso_liquido and peso_liquido > peso_bruto:
            raise serializers.ValidationError({
                'peso_liquido': 'O peso líquido não pode ser maior que o peso bruto.'
            })
        
        # Validação de precificação
        custo_embalagem = data.get('custo_embalagem')
        quantidade_embalagem = data.get('quantidade_embalagem')
        
        # Se um dos campos de precificação for preenchido, ambos devem ser
        if (custo_embalagem and not quantidade_embalagem) or (quantidade_embalagem and not custo_embalagem):
            raise serializers.ValidationError(
                "Para habilitar precificação, informe tanto o custo quanto a quantidade da embalagem."
            )
        
        # Validação de valores positivos para precificação
        if custo_embalagem is not None and custo_embalagem < 0:
            raise serializers.ValidationError({
                'custo_embalagem': 'O custo da embalagem não pode ser negativo.'
            })
        
        if quantidade_embalagem is not None and quantidade_embalagem <= 0:
            raise serializers.ValidationError({
                'quantidade_embalagem': 'A quantidade da embalagem deve ser maior que zero.'
            })
        
        return data


class IngredienteListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem"""
    alimento_nome = serializers.CharField(source='alimento.nome', read_only=True)
    
    # Campos calculados (apenas se precificação estiver habilitada)
    per_capita_bruto = serializers.SerializerMethodField()
    custo_unitario = serializers.SerializerMethodField()
    custo_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Ingrediente
        fields = [
            'id',
            'alimento',
            'alimento_nome',
            'peso_bruto',
            'peso_liquido',
            'peso_processado',
            'custo_embalagem',
            'quantidade_embalagem',
            'per_capita_bruto',
            'custo_unitario',
            'custo_total',
        ]
    
    def get_per_capita_bruto(self, obj):
        """Retorna per capita apenas se precificação estiver habilitada"""
        if obj.receita.habilitar_precificacao:
            return obj.per_capita_bruto
        return None
    
    def get_custo_unitario(self, obj):
        """Retorna custo unitário apenas se precificação estiver habilitada"""
        if obj.receita.habilitar_precificacao:
            return obj.custo_unitario
        return None
    
    def get_custo_total(self, obj):
        """Retorna custo total apenas se precificação estiver habilitada"""
        if obj.receita.habilitar_precificacao:
            return obj.custo_total
        return None