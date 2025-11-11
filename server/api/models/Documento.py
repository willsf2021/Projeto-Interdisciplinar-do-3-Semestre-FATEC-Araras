from django.db import models
from django.conf import settings
from .Cliente import Cliente
from .Receita import Receita

class Documento(models.Model):
    FORMATO_DOCUMENTO_CHOICES = [
        ('completo', 'Completo (Receita + Rótulo)'),
        ('rotulo_apenas', 'Apenas Rótulo Nutricional'),
        ('receita_apenas', 'Apenas Receita'),
    ]

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documentos',
        verbose_name='Usuário'
    )
    receita = models.ForeignKey(
        Receita,
        on_delete=models.CASCADE,
        related_name='documentos',
        verbose_name='Receita'
    )
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documentos',
        verbose_name='Cliente'
    )
    declaracao_alergenicos = models.TextField(
        blank=True,
        verbose_name='Declaração de Alergênicos',
        help_text='Campo livre para declaração de alergênicos'
    )
    arquivo_pdf = models.FileField(
        upload_to='documentos/%Y/%m/',
        null=True,
        blank=True,
        verbose_name='Arquivo PDF',
        help_text='PDF contendo ficha técnica, rótulos e precificação'
    )
    formato_documento = models.CharField(
        max_length=20,
        choices=FORMATO_DOCUMENTO_CHOICES,
        default='completo',
        verbose_name='Formato do Documento'
    )
    pdf_gerado = models.BooleanField(default=False, verbose_name='PDF Gerado')
    data_geracao_pdf = models.DateTimeField(null=True, blank=True, verbose_name='Data de Geração do PDF')
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        db_table = 'documentos'
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'
        ordering = ['-created_at']

    def __str__(self):
        cliente_nome = self.cliente.nome_completo if self.cliente else 'Sem cliente'
        return f"Documento - {self.receita.nome} ({cliente_nome})"