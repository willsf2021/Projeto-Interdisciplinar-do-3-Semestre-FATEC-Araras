# api/tests/test_google_auth_views.py
from django.test import TestCase, override_settings
from django.urls import reverse
from unittest import mock
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

GOOGLE_TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo'

@override_settings(ROOT_URLCONF='server.urls')  # ajuste se necessário
class GoogleAuthViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/google-auth/'  # ajuste se incluiu prefixo diferente

    @mock.patch('requests.get')
    def test_google_login_creates_user_and_returns_token(self, mock_get):
        # simular resposta do Google tokeninfo
        mock_resp = mock.Mock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            'email': 'googleuser@example.com',
            'sub': 'google-sub-id-123',
            'picture': 'https://example.com/avatar.jpg',
            'email_verified': 'true',
            'aud': 'some-client-id'
        }
        mock_get.return_value = mock_resp

        response = self.client.post(self.url, data={'id_token': 'valid-token'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        user = User.objects.get(email='googleuser@example.com')
        self.assertEqual(user.login_social, 'google')
        self.assertEqual(user.google_id, 'google-sub-id-123')
        self.assertEqual(user.avatar, 'https://example.com/avatar.jpg')

        token = Token.objects.get(user=user)
        self.assertEqual(response.data['token'], token.key)

    @mock.patch('requests.get')
    def test_google_login_invalid_token(self, mock_get):
        mock_resp = mock.Mock()
        mock_resp.status_code = 400
        mock_get.return_value = mock_resp

        response = self.client.post(self.url, data={'id_token': 'invalid-token'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_google_login_missing_token(self):
        response = self.client.post(self.url, data={}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)