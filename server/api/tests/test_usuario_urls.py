from django.test import TestCase
from django.urls import reverse

class UsuarioUrlsTest(TestCase):
    def test_login_url_reverse(self):
        url = reverse('usuario-login')
        self.assertEqual(url, '/api/login/') 
        
    def test_registro_url_reverse(self):
        url = reverse('usuario-registro')
        self.assertEqual(url, '/api/registro/') 