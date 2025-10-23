from django.db import models
from django.conf import settings


class Cliente(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='clientes',
        verbose_name='Usuário'
    )
    nome_completo = models.CharField(max_length=255, verbose_name='Nome Completo')
    email = models.EmailField(verbose_name='Email')
    celular = models.CharField(max_length=20, verbose_name='Celular')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        db_table = 'clientes'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        ordering = ['nome_completo']

    def __str__(self):
        return self.nome_completo