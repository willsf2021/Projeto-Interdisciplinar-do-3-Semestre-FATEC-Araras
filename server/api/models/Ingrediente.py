from django.db import models
from .Receita import Receita
from .AlimentoTaco import AlimentoTaco


class Ingrediente(models.Model):
    receita = models.ForeignKey(
        Receita,
        on_delete=models.CASCADE,
        related_name='ingredientes',
        verbose_name='Receita'
    )
    alimento = models.ForeignKey(
        AlimentoTaco,
        on_delete=models.PROTECT,
        verbose_name='Alimento'
    )
    peso_bruto = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Peso Bruto (g/ml)'
    )
    peso_liquido = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Peso Líquido (g/ml)'
    )
    peso_processado = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        null=True,
        blank=True,
        verbose_name='Peso Processado (g/ml)',
        help_text='Peso após cozimento/fritura/processamento. Se não preenchido, será igual ao peso líquido'
    )
    
    # Precificação (opcional)
    custo_embalagem = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Custo por Embalagem (R$)'
    )
    quantidade_embalagem = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Quantidade por Embalagem (g/ml)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        db_table = 'ingredientes'
        verbose_name = 'Ingrediente'
        verbose_name_plural = 'Ingredientes'
        ordering = ['id']

    def __str__(self):
        return f"{self.alimento.nome} - {self.receita.nome}"

    def save(self, *args, **kwargs):
        # Se peso_processado não foi preenchido, iguala ao peso_liquido
        if self.peso_processado is None:
            self.peso_processado = self.peso_liquido
        super().save(*args, **kwargs)

    @property
    def per_capita_bruto(self):
        """Per capita bruto: peso processado ÷ rendimento (número de porções)"""
        if self.receita.rendimento > 0:
            return self.peso_processado / self.receita.rendimento
        return 0

    @property
    def custo_unitario(self):
        """
        Custo unitário por ingrediente por porção:
        (custo_embalagem ÷ quantidade_embalagem) × per_capita_bruto
        """
        if not self.receita.habilitar_precificacao:
            return 0
        if not self.custo_embalagem or not self.quantidade_embalagem:
            return 0
        if self.quantidade_embalagem == 0:
            return 0
        return (self.custo_embalagem / self.quantidade_embalagem) * self.per_capita_bruto

    @property
    def custo_total(self):
        """Custo total do ingrediente na receita: custo_unitario × número de porções"""
        if not self.receita.habilitar_precificacao:
            return 0
        return self.custo_unitario * self.receita.rendimento