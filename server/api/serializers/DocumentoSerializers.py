from rest_framework import serializers
from api.models import Documento

class DocumentoSerializer(serializers.ModelSerializer):
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
        ]
        read_only_fields = ["usuario", "created_at", "updated_at"]
