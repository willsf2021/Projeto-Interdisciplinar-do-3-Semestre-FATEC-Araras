from rest_framework import serializers
from api.models import Documento

class DocumentoSerializer(serializers.ModelSerializer):
     # Campos que apontam para atributos relacionados
    receita_nome = serializers.CharField(source='receita.nome', read_only=True)
    receita_categoria = serializers.CharField(source='receita.categoria', read_only=True)
    cliente_nome = serializers.CharField(source='cliente.nome_completo', read_only=True)
    
    class Meta:
        model = Documento
        fields = [
            "id",
            "usuario",
            "receita",
            "cliente",
            "declaracao_alergenicos",
            "arquivo_pdf",
            "created_at",
            "updated_at",
            "receita_nome", 
            "cliente_nome",  
            "receita_categoria",  
        ]
        read_only_fields = ["usuario", "created_at", "updated_at"]
