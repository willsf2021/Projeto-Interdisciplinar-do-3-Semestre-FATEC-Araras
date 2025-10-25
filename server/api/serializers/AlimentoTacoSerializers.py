# api/serializers.py
from rest_framework import serializers
from api.models import AlimentoTaco

class AlimentoTacoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlimentoTaco
        fields = '__all__'