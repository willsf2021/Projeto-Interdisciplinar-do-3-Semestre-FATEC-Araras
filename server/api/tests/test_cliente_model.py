# tests/test_cliente_model.py
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.conf import settings
from api.models import Cliente

from api.models import Usuario


class ClienteModelTest(TestCase):
    def setUp(self):
        # Crie o usuário usando o modelo Usuario
        self.usuario = Usuario.objects.create_user(
            email='user@example.com',
            password='testpass123',
            tipo='profissional'
        )
        
        self.cliente_data = {
            'usuario': self.usuario,
            'nome_completo': 'João Silva',
            'email': 'joao@example.com',
            'celular': '+55 (11) 99999-9999'
        }

    def test_create_cliente_success(self):
        """Testa criação bem-sucedida de cliente"""
        cliente = Cliente.objects.create(**self.cliente_data)
        
        self.assertEqual(cliente.nome_completo, 'João Silva')
        self.assertEqual(cliente.email, 'joao@example.com')
        self.assertEqual(cliente.celular, '+55 (11) 99999-9999')
        self.assertEqual(cliente.usuario, self.usuario)
        self.assertIsNotNone(cliente.created_at)
        self.assertIsNotNone(cliente.updated_at)

    def test_cliente_relationship_with_usuario(self):
        """Testa o relacionamento com o modelo Usuario"""
        cliente = Cliente.objects.create(**self.cliente_data)
        
        # Testa o relacionamento direto
        self.assertEqual(cliente.usuario.email, 'user@example.com')
        self.assertEqual(cliente.usuario.tipo, 'profissional')
        
        # Testa o related_name
        self.assertIn(cliente, self.usuario.clientes.all())
        self.assertEqual(self.usuario.clientes.count(), 1)

    def test_required_fields(self):
        """Testa que campos obrigatórios são validados"""
        # Testa sem nome_completo - deve falhar
        cliente = Cliente(
            usuario=self.usuario,
            email='test@example.com',
            celular='+55 (11) 99999-9999'
         )
        with self.assertRaises(ValidationError):
            cliente.full_clean() 

    def test_string_representation(self):
        """Testa o método __str__"""
        cliente = Cliente.objects.create(**self.cliente_data)
        self.assertEqual(str(cliente), 'João Silva')

    def test_meta_options(self):
        """Testa as opções do Meta"""
        meta = Cliente._meta
        self.assertEqual(meta.db_table, 'clientes')
        self.assertEqual(meta.verbose_name, 'Cliente')
        self.assertEqual(meta.verbose_name_plural, 'Clientes')
        self.assertEqual(meta.ordering, ['nome_completo'])

    def test_email_format_validation(self):
        """Testa a validação do formato do email"""
        # Primeiro crie um cliente válido
        cliente = Cliente.objects.create(**self.cliente_data)
        
        # Agora tente atualizar com email inválido
        cliente.email = 'email-invalido'
        
        with self.assertRaises(ValidationError) as context:
            cliente.full_clean()
        self.assertIn('email', context.exception.error_dict)

    def test_celular_max_length_validation(self):
        """Testa o comprimento máximo do campo celular"""
        # Crie um cliente primeiro
        cliente = Cliente.objects.create(**self.cliente_data)
        
        # Tente atualizar com celular muito longo
        cliente.celular = 'A' * 21  # Excede o max_length=20
        
        with self.assertRaises(ValidationError) as context:
            cliente.full_clean()
        
        errors = context.exception.error_dict
        self.assertIn('celular', errors)

    def test_nome_completo_max_length_validation(self):
        """Testa o comprimento máximo do campo nome_completo"""
        # Crie um cliente primeiro
        cliente = Cliente.objects.create(**self.cliente_data)
        
        cliente.nome_completo = 'A' * 256  # Excede o max_length=255
        
        with self.assertRaises(ValidationError) as context:
            cliente.full_clean()
        
        errors = context.exception.error_dict
        self.assertIn('nome_completo', errors)

    def test_auto_timestamps(self):
        """Testa a criação automática de created_at e updated_at"""
        cliente = Cliente.objects.create(**self.cliente_data)
        
        self.assertIsNotNone(cliente.created_at)
        self.assertIsNotNone(cliente.updated_at)
        
        # Testa se updated_at é atualizado
        import time
        original_updated_at = cliente.updated_at
        time.sleep(0.001)  # Pequena pausa para garantir diferença de tempo
        
        cliente.nome_completo = 'Nome Atualizado'
        cliente.save()
        
        cliente.refresh_from_db()
        self.assertNotEqual(cliente.updated_at, original_updated_at)


class ClienteIntegrationTest(TestCase):
    """Testes de integração mais complexos para Cliente"""
    
    def setUp(self):
        self.usuario1 = Usuario.objects.create_user(
            email='user1@example.com',
            password='pass123',
            tipo='profissional'
        )
        
        self.usuario2 = Usuario.objects.create_user(
            email='user2@example.com',
            password='pass123',
            tipo='estudante'
        )

    def test_multiple_clientes_per_usuario(self):
        """Testa que um usuário pode ter múltiplos clientes"""
        cliente1 = Cliente.objects.create(
            usuario=self.usuario1,
            nome_completo='Cliente 1',
            email='cliente1@example.com',
            celular='(11) 1111-1111'
        )
        
        cliente2 = Cliente.objects.create(
            usuario=self.usuario1,
            nome_completo='Cliente 2',
            email='cliente2@example.com',
            celular='(11) 2222-2222'
        )
        
        clientes_usuario1 = self.usuario1.clientes.all()
        self.assertEqual(clientes_usuario1.count(), 2)
        self.assertIn(cliente1, clientes_usuario1)
        self.assertIn(cliente2, clientes_usuario1)

    def test_clientes_ordering(self):
        """Testa que clientes são ordenados por nome_completo"""
        Cliente.objects.create(
            usuario=self.usuario1,
            nome_completo='Zélia Silva',
            email='zelia@example.com',
            celular='(11) 9999-9999'
        )
        
        Cliente.objects.create(
            usuario=self.usuario1,
            nome_completo='Ana Souza',
            email='ana@example.com',
            celular='(11) 8888-8888'
        )
        
        Cliente.objects.create(
            usuario=self.usuario1,
            nome_completo='Carlos Lima',
            email='carlos@example.com',
            celular='(11) 7777-7777'
        )
        
        clientes_ordenados = Cliente.objects.all()
        nomes_ordenados = [cliente.nome_completo for cliente in clientes_ordenados]
        
        expected_ordering = ['Ana Souza', 'Carlos Lima', 'Zélia Silva']
        self.assertEqual(nomes_ordenados, expected_ordering)

    def test_cliente_deletion_on_usuario_delete(self):
        """Testa se cliente é deletado quando usuário é deletado (CASCADE)"""
        cliente = Cliente.objects.create(
            usuario=self.usuario1,
            nome_completo='Cliente Teste',
            email='cliente@example.com',
            celular='(11) 9999-9999'
        )
        
        cliente_id = cliente.id
        self.usuario1.delete()
        
        # Verifica que o cliente foi deletado
        with self.assertRaises(Cliente.DoesNotExist):
            Cliente.objects.get(id=cliente_id)

    def test_different_usuarios_have_separate_clientes(self):
        """Testa que diferentes usuários têm listas separadas de clientes"""
        cliente_usuario1 = Cliente.objects.create(
            usuario=self.usuario1,
            nome_completo='Cliente User1',
            email='cliente1@example.com',
            celular='(11) 1111-1111'
        )
        
        cliente_usuario2 = Cliente.objects.create(
            usuario=self.usuario2,
            nome_completo='Cliente User2',
            email='cliente2@example.com',
            celular='(11) 2222-2222'
        )
        
        # Verifica que cada usuário tem apenas seu próprio cliente
        self.assertEqual(self.usuario1.clientes.count(), 1)
        self.assertEqual(self.usuario2.clientes.count(), 1)
        self.assertIn(cliente_usuario1, self.usuario1.clientes.all())
        self.assertIn(cliente_usuario2, self.usuario2.clientes.all())
        self.assertNotIn(cliente_usuario1, self.usuario2.clientes.all())
        self.assertNotIn(cliente_usuario2, self.usuario1.clientes.all())


# Testes mais simples para evitar problemas complexos
class ClienteBasicTest(TestCase):
    """Testes básicos para o modelo Cliente"""
    
    def test_cliente_creation_minimal(self):
        """Teste mínimo de criação de cliente"""
        usuario = Usuario.objects.create_user(
            email='test@example.com',
            password='pass123',
            tipo='profissional'
        )
        
        cliente = Cliente.objects.create(
            usuario=usuario,
            nome_completo='Test Cliente',
            email='cliente@example.com',
            celular='123456789'
        )
        
        self.assertEqual(cliente.nome_completo, 'Test Cliente')
        self.assertEqual(cliente.usuario, usuario)

    def test_cliente_str_method(self):
        """Testa o método __str__"""
        usuario = Usuario.objects.create_user(
            email='test@example.com',
            password='pass123',
            tipo='profissional'
        )
        
        cliente = Cliente.objects.create(
            usuario=usuario,
            nome_completo='Maria Silva',
            email='maria@example.com',
            celular='123456789'
        )
        
        self.assertEqual(str(cliente), 'Maria Silva')