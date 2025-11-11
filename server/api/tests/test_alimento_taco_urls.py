from django.test import TestCase
from django.urls import reverse

class AlimentoTacoUrlsTest(TestCase):
    def test_alimentos_list_url_reverse(self):
        url = reverse('alimentos-list')
        self.assertEqual(url, '/api/alimentos/')
