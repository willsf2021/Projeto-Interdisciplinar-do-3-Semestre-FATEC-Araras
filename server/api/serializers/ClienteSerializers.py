from rest_framework import serializers
from api.models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'usuario', 'nome_completo', 'email', 'celular', 'created_at', 'updated_at']
        read_only_fields = ['id', 'usuario', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)