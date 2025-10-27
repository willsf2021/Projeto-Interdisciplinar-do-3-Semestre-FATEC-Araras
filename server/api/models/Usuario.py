from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    TYPE_CHOICES = [
        ('estudante', 'Estudante'),
        ('profissional', 'Profissional'),
        ('professor', 'Professor'),
    ]
    
    name = models.CharField(max_length=20, verbose_name='Nome do Usuário')
    email = models.EmailField(unique=True, verbose_name='Email')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='Tipo de Usuário')
    avatar_url = models.URLField(null=True, blank=True, verbose_name='URL do Avatar')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado a')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    # 👇 Sobrescreve para evitar conflito com auth.User
    groups = models.ManyToManyField(
        Group,
        related_name='usuario_groups',
        blank=True,
        help_text='Os grupos aos quais este usuário pertence.',
        verbose_name='grupos'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='usuario_permissions',
        blank=True,
        help_text='Permissões específicas para este usuário.',
        verbose_name='permissões de usuário'
    )

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['type']

    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

    def __str__(self):
        return f"{self.email} ({self.get_type_display()})"
