# Teste de url receitas
from django.test import TestCase
from django.urls import reverse

class ReceitaUrlsTest(TestCase):
    def test_create_receita(self):
        url = reverse('receita-create')
        self.assertEqual(url, '/api/criar-receita/') 
        
    def test_update_receita(self):
        url = reverse('receita-update', args=[1])
        self.assertEqual(url, '/api/atualizar-receita/1')  

    def test_delete_receita(self):
        url = reverse('receita-delete', args=[1])
        self.assertEqual(url, '/api/excluir-receita/1')

    def test_list_receitas(self):
        url = reverse('receita-list')
        self.assertEqual(url, '/api/listar-receitas/')
