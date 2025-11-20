import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from api.models import Receita
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestRotuloNutricionalView:

    @pytest.fixture
    def usuario(self):
        return User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="123456"
        )

    @pytest.fixture
    def usuario2(self):
        return User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="123456"
        )

    @pytest.fixture
    def receita(self, usuario, mocker):
        """
        Cria uma receita e MOCKA os métodos de cálculo para retornar valores fixos.
        """
        receita = Receita.objects.create(
            usuario=usuario,
            nome="Receita Teste",
            rendimento=4,
            porcao_individual=100,
            medida="g"
        )

        # Mock dos métodos de cálculo
        mocker.patch.object(
            receita,
            "calcular_nutrientes_totais",
            return_value={"ok": True}
        )

        mocker.patch.object(
            receita,
            "calcular_nutrientes_por_100g",
            return_value={
                'valor_energetico': 200,
                'proteinas': 10,
                'carboidratos': 30,
                'acucares_totais': 5,
                'acucares_adicionados': 2,
                'gorduras_totais': 8,
                'gorduras_saturadas': 3,
                'gorduras_trans': 0,
                'fibra_alimentar': 4,
                'sodio': 120
            }
        )

        mocker.patch.object(
            receita,
            "calcular_nutrientes_por_porcao",
            return_value={
                'valor_energetico': 150,
                'proteinas': 8,
                'carboidratos': 20,
                'acucares_totais': 4,
                'acucares_adicionados': 1,
                'gorduras_totais': 6,
                'gorduras_saturadas': 2,
                'gorduras_trans': 0,
                'fibra_alimentar': 3,
                'sodio': 100
            }
        )

        mocker.patch.object(
            receita,
            "calcular_valores_diarios",
            return_value={
                'valor_energetico': 7,
                'carboidratos': 10,
                'proteinas': 16,
                'gorduras_totais': 12,
                'gorduras_saturadas': 9,
                'fibra_alimentar': 15,
                'sodio': 5
            }
        )

        return receita

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def token(self, usuario, api_client):
        """
        Obtém JWT usando rota padrão do simplejwt.
        """
        response = api_client.post("/api/token/", {
            "username": usuario.username,
            "password": "123456"
        })

        return response.data["access"]

    def test_rotulo_nutricional_retorna_200(self, api_client, token, receita):
        url = f"/api/rotulo/{receita.id}/"

        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = api_client.get(url)

        assert response.status_code == 200
        data = response.json()

        # Verifica alguns campos esperados
        assert data["porcoes_por_embalagem"] == 4
        assert data["porcao"] == 100
        assert data["medida_caseira"] == "100g"

        assert data["valor_energetico_100g"] == 200
        assert data["valor_energetico_porcao"] == 150
        assert data["vd_valor_energetico"] == 7

    def test_usuario_sem_permissao_recebe_403(self, api_client, usuario2, receita):
        # Token do user2 (não dono da receita)
        response_token = api_client.post("/api/token/", {
            "username": usuario2.username,
            "password": "123456"
        })
        token2 = response_token.data["access"]

        url = f"/api/rotulo/{receita.id}/"
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token2}")

        response = api_client.get(url)

        assert response.status_code == 403
        assert "não tem permissão" in response.json()["error"].lower()

    def test_sem_autenticacao_recebe_401(self, api_client, receita):
        url = f"/api/rotulo/{receita.id}/"

        response = api_client.get(url)

        assert response.status_code == 401