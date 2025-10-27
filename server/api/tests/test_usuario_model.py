# tests/test_models.py
from django.test import TestCase
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import ValidationError
from api.models import Usuario, UsuarioManager


class UsuarioManagerTest(TestCase):
    def test_create_user_success(self):
        """Testa criação bem-sucedida de usuário normal"""
        user = Usuario.objects.create_user(
            email='test@example.com',
            password='password123',
            type='estudante',
            name='Test User'
        )
        
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.type, 'estudante')
        self.assertEqual(user.name, 'Test User')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.check_password('password123'))

    def test_create_user_without_email_raises_error(self):
        """Testa que criar usuário sem email levanta erro"""
        with self.assertRaises(ValueError) as context:
            Usuario.objects.create_user(
                email='',
                password='password123',
                type='estudante',
                name='Test User'
            )
        self.assertEqual(str(context.exception), 'O email é obrigatório')

    def test_create_user_with_avatar_url(self):
        """Testa criação de usuário com avatar_url"""
        user = Usuario.objects.create_user(
            email='avatar@example.com',
            password='password123',
            type='profissional',
            name='Avatar User',
            avatar_url='https://example.com/avatar.jpg'
        )
        
        self.assertEqual(user.avatar_url, 'https://example.com/avatar.jpg')

    def test_create_user_without_avatar_url(self):
        """Testa criação de usuário sem avatar_url (campo opcional)"""
        user = Usuario.objects.create_user(
            email='noavatar@example.com',
            password='password123',
            type='estudante',
            name='No Avatar'
        )
        
        self.assertIsNone(user.avatar_url)

    def test_create_superuser_success(self):
        """Testa criação bem-sucedida de superusuário"""
        superuser = Usuario.objects.create_superuser(
            email='admin@example.com',
            password='admin123',
            type='professor',
            name='Admin User'
        )
        
        self.assertEqual(superuser.email, 'admin@example.com')
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_active)

    def test_create_superuser_default_fields(self):
        """Testa que superusuário tem campos padrão corretos"""
        superuser = Usuario.objects.create_superuser(
            email='admin2@example.com',
            password='admin123',
            type='profissional',
            name='Admin 2'
        )
        
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)


class UsuarioModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'user@example.com',
            'password': 'testpass123',
            'type': 'estudante',
            'name': 'Test User'
        }

    def test_create_usuario(self):
        """Testa criação básica do modelo Usuario"""
        user = Usuario.objects.create_user(**self.user_data)
        
        self.assertEqual(user.email, 'user@example.com')
        self.assertEqual(user.type, 'estudante')
        self.assertEqual(user.name, 'Test User')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertIsNotNone(user.created_at)
        self.assertIsNotNone(user.updated_at)

    def test_email_unique_constraint(self):
        """Testa que email deve ser único"""
        Usuario.objects.create_user(**self.user_data)
        
        with self.assertRaises(Exception):  # IntegrityError
            Usuario.objects.create_user(
                email='user@example.com',
                password='otherpass123',
                type='profissional',
                name='Another User'
            )

    def test_type_choices(self):
        """Testa que type aceita apenas valores válidos"""
        valid_types = ['estudante', 'profissional', 'professor']
        
        for tipo in valid_types:
            user = Usuario.objects.create_user(
                email=f'{tipo}@example.com',
                password='pass123',
                type=tipo,
                name=f'{tipo.capitalize()} User'
            )
            self.assertEqual(user.type, tipo)

    def test_string_representation(self):
        """Testa o método __str__"""
        user = Usuario.objects.create_user(**self.user_data)
        expected_str = f"{user.email} ({user.get_type_display()})"
        self.assertEqual(str(user), expected_str)

    def test_get_type_display(self):
        """Testa a exibição do type"""
        user = Usuario.objects.create_user(
            email='prof@example.com',
            password='pass123',
            type='professor',
            name='Professor User'
        )
        self.assertEqual(user.get_type_display(), 'Professor')

    def test_name_max_length(self):
        """Testa o comprimento máximo do campo name"""
        user = Usuario.objects.create_user(
            email='longname@example.com',
            password='pass123',
            type='estudante',
            name='X' * 20  # Exatamente o máximo permitido
        )
        self.assertEqual(len(user.name), 20)

    def test_avatar_url_optional(self):
        """Testa que avatar_url é opcional"""
        user = Usuario.objects.create_user(
            email='optional@example.com',
            password='pass123',
            type='profissional',
            name='Optional Avatar'
        )
        self.assertIsNone(user.avatar_url)
        
        # Adiciona avatar depois
        user.avatar_url = 'https://example.com/new-avatar.jpg'
        user.save()
        user.refresh_from_db()
        self.assertEqual(user.avatar_url, 'https://example.com/new-avatar.jpg')

    def test_user_permissions_relationship(self):
        """Testa o relacionamento com permissões personalizado"""
        user = Usuario.objects.create_user(**self.user_data)
        permission = Permission.objects.first()
        
        user.user_permissions.add(permission)
        self.assertIn(permission, user.user_permissions.all())
        self.assertEqual(user.user_permissions.count(), 1)

    def test_groups_relationship(self):
        """Testa o relacionamento com grupos personalizado"""
        user = Usuario.objects.create_user(**self.user_data)
        group = Group.objects.create(name='Test Group')
        
        user.groups.add(group)
        self.assertIn(group, user.groups.all())
        self.assertEqual(user.groups.count(), 1)

    def test_required_fields(self):
        """Testa que REQUIRED_FIELDS inclui type"""
        self.assertEqual(Usuario.REQUIRED_FIELDS, ['type'])

    def test_username_field_is_email(self):
        """Testa que USERNAME_FIELD é email"""
        self.assertEqual(Usuario.USERNAME_FIELD, 'email')

    def test_meta_options(self):
        """Testa as opções do Meta"""
        meta = Usuario._meta
        self.assertEqual(meta.db_table, 'usuarios')
        self.assertEqual(meta.verbose_name, 'Usuário')
        self.assertEqual(meta.verbose_name_plural, 'Usuários')

    def test_timestamps_auto_update(self):
        """Testa que updated_at é atualizado automaticamente"""
        user = Usuario.objects.create_user(**self.user_data)
        created_time = user.created_at
        updated_time = user.updated_at
        
        user.name = 'Updated Name'
        user.save()
        user.refresh_from_db()
        
        self.assertEqual(user.created_at, created_time)
        self.assertGreater(user.updated_at, updated_time)


class UsuarioIntegrationTest(TestCase):
    """Testes de integração mais complexos"""
    
    def test_full_user_creation_flow(self):
        """Testa o fluxo completo de criação e uso do usuário"""
        # Criar usuário
        user = Usuario.objects.create_user(
            email='integration@example.com',
            password='securepass',
            type='profissional',
            name='Integration User',
            avatar_url='https://example.com/avatar.jpg'
        )
        
        # Verificar autenticação
        self.assertTrue(user.is_authenticated)
        self.assertTrue(user.check_password('securepass'))
        
        # Adicionar a grupos
        group = Group.objects.create(name='Profissionais')
        user.groups.add(group)
        
        # Adicionar permissão específica
        permission = Permission.objects.filter(codename='view_usuario').first()
        if permission:
            user.user_permissions.add(permission)
        
        # Verificar estado final
        self.assertEqual(user.email, 'integration@example.com')
        self.assertEqual(user.type, 'profissional')
        self.assertEqual(user.name, 'Integration User')
        self.assertEqual(user.avatar_url, 'https://example.com/avatar.jpg')
        self.assertIn(group, user.groups.all())
        
    def test_superuser_has_all_permissions(self):
        """Testa que superusuário tem todas as permissões"""
        superuser = Usuario.objects.create_superuser(
            email='super@example.com',
            password='superpass',
            type='professor',
            name='Super User'
        )
        
        self.assertTrue(superuser.has_perm('auth.view_user'))
        self.assertTrue(superuser.has_perm('auth.add_user'))
        self.assertTrue(superuser.has_perm('any_app.any_permission'))

    def test_multiple_users_different_types(self):
        """Testa criação de múltiplos usuários com tipos diferentes"""
        types = ['estudante', 'profissional', 'professor']
        users = []
        
        for tipo in types:
            user = Usuario.objects.create_user(
                email=f'{tipo}@test.com',
                password='pass123',
                type=tipo,
                name=f'{tipo.capitalize()} User'
            )
            users.append(user)
        
        self.assertEqual(Usuario.objects.count(), 3)
        
        # Verifica cada tipo
        estudantes = Usuario.objects.filter(type='estudante')
        profissionais = Usuario.objects.filter(type='profissional')
        professores = Usuario.objects.filter(type='professor')
        
        self.assertEqual(estudantes.count(), 1)
        self.assertEqual(profissionais.count(), 1)
        self.assertEqual(professores.count(), 1)