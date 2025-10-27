from django.test import TestCase
from django.urls import reverse

class GoogleAuthUrlsTest(TestCase):
    def test_google_auth_url_reverse(self):
        url = reverse('google_auth')
        self.assertEqual(url, '/api/google-auth/') 