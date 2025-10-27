from django.test import TestCase
from django.urls import reverse
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from api.models import Usuario


class GoogleAuthViewTest(TestCase):
    """Testes para a view de autenticação Google OAuth"""
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('google_auth')

        self.mock_google_data = {
            'email': 'testuser@gmail.com',
            'given_name': 'Test',
            'family_name': 'User',
            'picture': 'https://example.com/avatar.jpg'
        }
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_new_user_success(self, mock_verify):
        """Testa autenticação bem-sucedida com novo usuário"""
        mock_verify.return_value = self.mock_google_data
        
        data = {
            'token': 'valid_google_token_123',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['status'])

        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])

        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'testuser@gmail.com')
        self.assertEqual(response.data['user']['name'], 'Test User')
        self.assertEqual(response.data['user']['type'], 'estudante')
        self.assertEqual(response.data['user']['avatar_url'], 'https://example.com/avatar.jpg')

        user = Usuario.objects.get(email='testuser@gmail.com')
        self.assertEqual(user.name, 'Test User')
        self.assertEqual(user.type, 'estudante')
        self.assertEqual(user.avatar_url, 'https://example.com/avatar.jpg')
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_existing_user_success(self, mock_verify):
        """Testa autenticação com usuário já existente"""
        
        existing_user = Usuario.objects.create_user(
            email='existing@gmail.com',
            password='temp_pass',
            type='profissional',
            name='Existing User'
        )
        
        mock_verify.return_value = {
            'email': 'existing@gmail.com',
            'given_name': 'Existing',
            'family_name': 'User',
            'picture': 'https://example.com/new-avatar.jpg'
        }
        
        data = {
            'token': 'valid_google_token_456',
            'type': 'estudante' 
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['status'])
        

        user = Usuario.objects.get(email='existing@gmail.com')
        self.assertEqual(user.type, 'profissional')
        self.assertEqual(user.name, 'Existing User') 
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_updates_avatar_if_missing(self, mock_verify):
        """Testa que avatar é atualizado se estava vazio"""

        Usuario.objects.create_user(
            email='noavatar@gmail.com',
            password='temp_pass',
            type='estudante',
            name='No Avatar User',
            avatar_url=None
        )
        
        mock_verify.return_value = {
            'email': 'noavatar@gmail.com',
            'given_name': 'No Avatar',
            'family_name': 'User',
            'picture': 'https://example.com/new-avatar.jpg'
        }
        
        data = {
            'token': 'valid_google_token_789',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = Usuario.objects.get(email='noavatar@gmail.com')
        self.assertEqual(user.avatar_url, 'https://example.com/new-avatar.jpg')
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_does_not_update_existing_avatar(self, mock_verify):
        """Testa que avatar existente não é sobrescrito"""

        Usuario.objects.create_user(
            email='hasavatar@gmail.com',
            password='temp_pass',
            type='estudante',
            name='Has Avatar User',
            avatar_url='https://example.com/original-avatar.jpg'
        )
        
        mock_verify.return_value = {
            'email': 'hasavatar@gmail.com',
            'given_name': 'Has Avatar',
            'family_name': 'User',
            'picture': 'https://example.com/new-avatar.jpg'
        }
        
        data = {
            'token': 'valid_google_token_abc',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        user = Usuario.objects.get(email='hasavatar@gmail.com')
        self.assertEqual(user.avatar_url, 'https://example.com/original-avatar.jpg')
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_updates_name_if_missing(self, mock_verify):
        """Testa que nome é atualizado se estava vazio"""
        
        Usuario.objects.create_user(
            email='noname@gmail.com',
            password='temp_pass',
            type='estudante',
            name='',
            avatar_url=None
        )
        
        mock_verify.return_value = {
            'email': 'noname@gmail.com',
            'given_name': 'New',
            'family_name': 'Name',
            'picture': ''
        }
        
        data = {
            'token': 'valid_google_token_def',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = Usuario.objects.get(email='noname@gmail.com')
        self.assertEqual(user.name, 'New Name')
        
    def test_google_auth_missing_token(self):
        """Testa erro quando token não é fornecido"""
        data = {
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['status'])
        self.assertIn('error', response.data)
        self.assertIn('Token não fornecido', response.data['error'])
        
    def test_google_auth_missing_type(self):
        """Testa erro quando type não é fornecido"""
        data = {
            'token': 'some_token'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['status'])
        self.assertIn('error', response.data)
        self.assertIn('Tipo de usuário é obrigatório', response.data['error'])
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_invalid_token(self, mock_verify):
        """Testa erro com token inválido"""
        mock_verify.side_effect = ValueError('Invalid token')
        
        data = {
            'token': 'invalid_token',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['status'])
        self.assertIn('error', response.data)
        self.assertIn('Token inválido', response.data['error'])
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_missing_email_in_token(self, mock_verify):
        """Testa erro quando email não está no token Google"""
        mock_verify.return_value = {
            'given_name': 'Test',
            'family_name': 'User',
            'picture': 'https://example.com/avatar.jpg'
        }
        
        data = {
            'token': 'token_without_email',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['status'])
        self.assertIn('error', response.data)
        self.assertIn('Email não encontrado', response.data['error'])
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_with_all_user_types(self, mock_verify):
        """Testa autenticação com todos os tipos de usuário"""
        types = ['estudante', 'profissional', 'professor']
        
        for idx, user_type in enumerate(types):
            mock_verify.return_value = {
                'email': f'{user_type}{idx}@gmail.com',
                'given_name': user_type.capitalize(),
                'family_name': 'User',
                'picture': f'https://example.com/{user_type}.jpg'
            }
            
            data = {
                'token': f'token_{user_type}',
                'type': user_type
            }
            
            response = self.client.post(self.url, data, format='json')
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['user']['type'], user_type)
            
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_without_name_uses_email_prefix(self, mock_verify):
        """Testa que usa prefixo do email quando nome não está disponível"""
        mock_verify.return_value = {
            'email': 'johndoe@gmail.com',
            'given_name': '',
            'family_name': '',
            'picture': ''
        }
        
        data = {
            'token': 'token_no_name',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = Usuario.objects.get(email='johndoe@gmail.com')
        self.assertEqual(user.name, 'johndoe')
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_partial_name(self, mock_verify):
        """Testa autenticação com apenas given_name ou family_name"""

        mock_verify.return_value = {
            'email': 'onlygivenname@gmail.com',
            'given_name': 'John',
            'family_name': '',
            'picture': ''
        }
        
        data = {
            'token': 'token_only_given',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = Usuario.objects.get(email='onlygivenname@gmail.com')
        self.assertEqual(user.name, 'John')

        mock_verify.return_value = {
            'email': 'onlyfamilyname@gmail.com',
            'given_name': '',
            'family_name': 'Doe',
            'picture': ''
        }
        
        data = {
            'token': 'token_only_family',
            'type': 'profissional'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = Usuario.objects.get(email='onlyfamilyname@gmail.com')
        self.assertEqual(user.name, 'Doe')
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_tokens_are_valid_jwt(self, mock_verify):
        """Testa que os tokens retornados são JWTs válidos"""
        mock_verify.return_value = self.mock_google_data
        
        data = {
            'token': 'valid_google_token',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        access_token = response.data['tokens']['access']
        refresh_token = response.data['tokens']['refresh']

        self.assertIsInstance(access_token, str)
        self.assertIsInstance(refresh_token, str)
        self.assertGreater(len(access_token), 50)
        self.assertGreater(len(refresh_token), 50)

        self.assertNotEqual(access_token, refresh_token)


class GoogleAuthIntegrationTest(TestCase):
    """Testes de integração para autenticação Google"""
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('google_auth')
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_complete_google_auth_flow(self, mock_verify):
        """Testa fluxo completo: autenticação inicial -> login subsequente"""
        mock_google_data = {
            'email': 'flowtest@gmail.com',
            'given_name': 'Flow',
            'family_name': 'Test',
            'picture': 'https://example.com/flow.jpg'
        }
        
        mock_verify.return_value = mock_google_data

        data = {
            'token': 'google_token_1',
            'type': 'estudante'
        }
        
        response1 = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(Usuario.objects.count(), 1)
        
        token1_access = response1.data['tokens']['access']

        data = {
            'token': 'google_token_2',
            'type': 'profissional'
        }
        
        response2 = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(Usuario.objects.count(), 1)
        
        token2_access = response2.data['tokens']['access']

        user = Usuario.objects.get(email='flowtest@gmail.com')
        self.assertEqual(user.type, 'estudante')

        self.assertNotEqual(token1_access, token2_access)
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_multiple_users_google_auth(self, mock_verify):
        """Testa autenticação de múltiplos usuários diferentes"""
        users_data = [
            {
                'email': 'user1@gmail.com',
                'given_name': 'User',
                'family_name': 'One',
                'picture': 'https://example.com/user1.jpg',
                'type': 'estudante'
            },
            {
                'email': 'user2@gmail.com',
                'given_name': 'User',
                'family_name': 'Two',
                'picture': 'https://example.com/user2.jpg',
                'type': 'profissional'
            },
            {
                'email': 'user3@gmail.com',
                'given_name': 'User',
                'family_name': 'Three',
                'picture': 'https://example.com/user3.jpg',
                'type': 'professor'
            }
        ]
        
        for user_data in users_data:
            user_type = user_data.pop('type')
            mock_verify.return_value = user_data
            
            data = {
                'token': f'token_{user_data["email"]}',
                'type': user_type
            }
            
            response = self.client.post(self.url, data, format='json')
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['user']['email'], user_data['email'])
            self.assertEqual(response.data['user']['type'], user_type)

        self.assertEqual(Usuario.objects.count(), 3)
        
    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_auth_with_protected_endpoint(self, mock_verify):
        """Testa uso do token JWT em endpoint protegido após autenticação Google"""
        mock_verify.return_value = {
            'email': 'protected@gmail.com',
            'given_name': 'Protected',
            'family_name': 'User',
            'picture': ''
        }

        data = {
            'token': 'google_token_protected',
            'type': 'estudante'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        access_token = response.data['tokens']['access']
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
