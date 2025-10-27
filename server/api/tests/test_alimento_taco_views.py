from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import AlimentoTaco
from django.contrib.auth import get_user_model

class AlimentoTacoViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/alimentos/"
        
        # Cria usuário e faz login
        self.user = get_user_model().objects.create_user(
            email='teste@example.com',
            password='senha123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.alimento = AlimentoTaco.objects.create(
            codigo_taco='TACO888',
            nome='Alimento Original',
            categoria='Original',
            valor_energetico=1.2,
            proteinas=1.0,
            carboidratos=1.0,
            acucares_totais=1.0,
            acucares_adicionados=1.0,
            gorduras_totais=1.0,
            gorduras_saturadas=1.0,
            gorduras_trans=1.0,
            fibra_alimentar=1.0,
            sodio=1.0
        )

    def test_return_all_alimentos(self):    
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_nome(self):
        response = self.client.get(self.url, {'nome': 'Alimento Original'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome'], 'Alimento Original')

    def test_filter_by_categoria(self):
        response = self.client.get(self.url, {'categoria': 'Original'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)