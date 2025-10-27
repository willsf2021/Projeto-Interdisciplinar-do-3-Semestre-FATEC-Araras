from django.test import TestCase
from django.contrib.auth.models import Group, Permission
from api.models import Usuario


class UsuarioManagerTest(TestCase):
    def test_create_user_success(self):
        """Testa criação bem-sucedida de usuário normal"""
        user = Usuario.objects.create_user(
            email='test@example.com',
            password='password123',
            tipo='estudante'
        )
        
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.tipo, 'estudante')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.check_password('password123'))
        # novos campos do google
        self.assertEqual(user.login_social, 'manual')
        self.assertIsNone(user.google_id)
        self.assertIsNone(user.avatar)

    def test_create_user_without_email_raises_error(self):
        """Testa que criar usuário sem email levanta erro"""
        with self.assertRaises(ValueError) as context:
            Usuario.objects.create_user(
                email='',
                password='password123',
                tipo='estudante'
            )
        self.assertEqual(str(context.exception), 'O email é obrigatório')

    def test_create_superuser_success(self):
        """Testa criação bem-sucedida de superusuário"""
        superuser = Usuario.objects.create_superuser(
            email='admin@example.com',
            password='admin123',
            tipo='professor'
        )
        
        self.assertEqual(superuser.email, 'admin@example.com')
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_active)
        self.assertEqual(superuser.login_social, 'manual')

    def test_create_superuser_default_fields(self):
        """Testa que superusuário tem campos padrão corretos"""
        superuser = Usuario.objects.create_superuser(
            email='admin2@example.com',
            password='admin123',
            tipo='profissional'
        )
        
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertEqual(superuser.login_social, 'manual')


class UsuarioModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'user@example.com',
            'password': 'testpass123',
            'tipo': 'estudante'
        }

    def test_create_usuario(self):
        """Testa criação básica do modelo Usuario"""
        user = Usuario.objects.create_user(**self.user_data)
        
        self.assertEqual(user.email, 'user@example.com')
        self.assertEqual(user.tipo, 'estudante')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertIsNotNone(user.created_at)
        self.assertIsNotNone(user.updated_at)
        # novos campos padrão
        self.assertEqual(user.login_social, 'manual')
        self.assertIsNone(user.google_id)
        self.assertIsNone(user.avatar)

    def test_email_unique_constraint(self):
        """Testa que email deve ser único"""
        Usuario.objects.create_user(**self.user_data)
        
        with self.assertRaises(Exception):
            Usuario.objects.create_user(
                email='user@example.com',
                password='otherpass123',
                tipo='profissional'
            )

    def test_tipo_choices(self):
        """Testa que tipo aceita apenas valores válidos"""
        valid_tipos = ['estudante', 'profissional', 'professor']
        for tipo in valid_tipos:
            user = Usuario.objects.create_user(
                email=f'{tipo}@example.com',
                password='pass123',
                tipo=tipo
            )
            self.assertEqual(user.tipo, tipo)

    def test_login_social_choices(self):
        """Testa que login_social aceita apenas valores válidos"""
        valid_choices = ['manual', 'google']
        for choice in valid_choices:
            user = Usuario.objects.create_user(
                email=f'{choice}@example.com',
                password='pass123',
                tipo='profissional',
                login_social=choice
            )
            self.assertEqual(user.login_social, choice)

    def test_string_representation(self):
        """Testa o método __str__"""
        user = Usuario.objects.create_user(**self.user_data)
        expected_str = f"{user.email} ({user.get_tipo_display()})"
        self.assertEqual(str(user), expected_str)

    def test_get_tipo_display(self):
        """Testa a exibição do tipo"""
        user = Usuario.objects.create_user(
            email='prof@example.com',
            password='pass123',
            tipo='professor'
        )
        self.assertEqual(user.get_tipo_display(), 'Professor')

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
        """Testa que REQUIRED_FIELDS inclui tipo"""
        self.assertEqual(Usuario.REQUIRED_FIELDS, ['tipo'])

    def test_username_field_is_email(self):
        """Testa que USERNAME_FIELD é email"""
        self.assertEqual(Usuario.USERNAME_FIELD, 'email')

    def test_meta_options(self):
        """Testa as opções do Meta"""
        meta = Usuario._meta
        self.assertEqual(meta.db_table, 'usuarios')
        self.assertEqual(meta.verbose_name, 'Usuário')
        self.assertEqual(meta.verbose_name_plural, 'Usuários')

    def test_can_set_google_fields(self):
        """Testa que é possível definir google_id e avatar"""
        user = Usuario.objects.create_user(
            email='google@example.com',
            password=None,
            tipo='profissional',
            login_social='google',
            google_id='1234567890',
            avatar='https://example.com/avatar.jpg'
        )
        self.assertEqual(user.login_social, 'google')
        self.assertEqual(user.google_id, '1234567890')
        self.assertEqual(user.avatar, 'https://example.com/avatar.jpg')


class UsuarioIntegrationTest(TestCase):
    """Testes de integração mais complexos"""
    
    def test_full_user_creation_flow(self):
        """Testa o fluxo completo de criação e uso do usuário"""
        user = Usuario.objects.create_user(
            email='integration@example.com',
            password='securepass',
            tipo='profissional'
        )
        self.assertTrue(user.is_authenticated)
        self.assertTrue(user.check_password('securepass'))

        group = Group.objects.create(name='Profissionais')
        user.groups.add(group)
        permission = Permission.objects.get(codename='view_usuario')
        user.user_permissions.add(permission)

        self.assertEqual(user.email, 'integration@example.com')
        self.assertEqual(user.tipo, 'profissional')
        self.assertIn(group, user.groups.all())
        self.assertIn(permission, user.user_permissions.all())
        self.assertEqual(user.login_social, 'manual')

    def test_superuser_has_all_permissions(self):
        """Testa que superusuário tem todas as permissões"""
        superuser = Usuario.objects.create_superuser(
            email='super@example.com',
            password='superpass',
            tipo='professor'
        )
        self.assertTrue(superuser.has_perm('auth.view_user'))
        self.assertTrue(superuser.has_perm('auth.add_user'))
        self.assertTrue(superuser.has_perm('any_app.any_permission'))
        self.assertEqual(superuser.login_social, 'manual')