
from django.test import TestCase
from django.urls import reverse

class ClienteUrlsTest(TestCase):
    def test_list_cliente(self):
        url = reverse('clientes-list')
        self.assertEqual(url, '/api/listar-clientes/') 
        
    def test_details_cliente(self):
        url = reverse('clientes-detail', args=[1])
        self.assertEqual(url, '/api/detalhes-cliente/1/')  

    def test_create_cliente(self):
        url = reverse('clientes-create')
        self.assertEqual(url, '/api/criar-cliente/')
    
    def test_delete_cliente(self):
        url = reverse('clientes-delete', args=[1])
        self.assertEqual(url, '/api/excluir-cliente/1/')

    def test_update_cliente(self):
        url = reverse('clientes-update', args=[1])
        self.assertEqual(url, '/api/atualizar-cliente/1/')

