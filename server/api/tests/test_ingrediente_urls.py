# Teste de urls de ingredientes
from django.test import TestCase
from django.urls import reverse

class IngredienteUrlsTest(TestCase):
    def test_create_ingrediente(self):
        url = reverse('ingrediente-create', args=[1])
        self.assertEqual(url, '/api/criar-ingrediente/1/')

    def test_list_ingredientes(self):
        url = reverse('ingrediente-list', args=[1])
        self.assertEqual(url, '/api/listar-ingredientes/1/') 

    def test_update_ingrediente(self):
        url = reverse('ingrediente-update', args=[1])
        self.assertEqual(url, '/api/atualizar-ingrediente/1/')

    def test_delete_ingrediente(self):
        url = reverse('ingrediente-delete', args=[1])
        self.assertEqual(url, '/api/excluir-ingrediente/1/')
    
    def test_detail_ingrediente(self):
        url = reverse('ingrediente-detail', args=[1])
        self.assertEqual(url, '/api/detalhes-ingrediente/1/')