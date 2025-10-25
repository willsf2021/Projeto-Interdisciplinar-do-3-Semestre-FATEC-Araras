from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Usuario
from rest_framework.authtoken.models import Token

class AlimentoTacoViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url="/api/alimentos/"

    def test_return_all_alimentos(self):    
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_nome(self):
        response = self.client.get(self.url, {'nome': 'Arroz, integral, cozido'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome'], 'Arroz, integral, cozido')

    def test_filter_by_categoria(self):
        response = self.client.get(self.url, {'categoria': 'Cereais e derivados'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)