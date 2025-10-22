# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Perfil, Cliente, Documento, FichaTecnica, IngredienteReceita, TabelaTACO

# User / Signup
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        pwd = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(pwd)
        user.save()
        Perfil.objects.create(user=user)  # cria perfil padrão
        return user

# Domain serializers (simplified)
class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredienteReceita
        fields = '__all__'

class FichaTecnicaSerializer(serializers.ModelSerializer):
    ingredientes = IngredienteSerializer(many=True, read_only=True)
    class Meta:
        model = FichaTecnica
        fields = '__all__'

class DocumentoSerializer(serializers.ModelSerializer):
    fichas_tecnicas = FichaTecnicaSerializer(many=True, read_only=True)
    class Meta:
        model = Documento
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'