from django.db import models
from django.conf import settings


class Receita(models.Model):
    MEDIDA_CHOICES = [
        ('g', 'Gramas (g)'),
        ('ml', 'Mililitros (ml)'),
    ]

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='receitas',
        verbose_name='Usuário'
    )
    nome = models.CharField(max_length=255, verbose_name='Nome da Receita')
    categoria = models.CharField(max_length=100, verbose_name='Categoria')
    tempo_preparo_horas = models.IntegerField(default=0, verbose_name='Tempo de Preparo (Horas)')
    tempo_preparo_minutos = models.IntegerField(default=0, verbose_name='Tempo de Preparo (Minutos)')
    porcao_individual = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Porção Individual'
    )
    medida = models.CharField(
        max_length=2, 
        choices=MEDIDA_CHOICES, 
        verbose_name='Medida da Porção'
    )
    modo_preparo = models.TextField(verbose_name='Modo de Preparo')
    
    # Precificação (opcional)
    habilitar_precificacao = models.BooleanField(default=False, verbose_name='Habilitar Precificação')
    markup = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        verbose_name='Markup (%)',
        help_text='Percentual de markup sobre o custo total'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        db_table = 'receitas'
        verbose_name = 'Receita'
        verbose_name_plural = 'Receitas'
        ordering = ['-created_at']

    def __str__(self):
        return self.nome

    @property
    def peso_liquido_total(self):
        """Soma dos pesos líquidos de todos os ingredientes"""
        return sum(
            ing.peso_liquido for ing in self.ingredientes.all()
        )

    @property
    def rendimento(self):
        """Número de porções: peso líquido total ÷ porção individual"""
        if self.porcao_individual > 0:
            return self.peso_liquido_total / self.porcao_individual
        return 0

    @property
    def custo_total(self):
        """Soma dos custos totais de todos os ingredientes"""
        if not self.habilitar_precificacao:
            return 0
        return sum(
            ing.custo_total for ing in self.ingredientes.all()
        )

    @property
    def lucro(self):
        """Lucro: custo total × (markup ÷ 100)"""
        if not self.habilitar_precificacao or not self.markup:
            return 0
        return self.custo_total * (self.markup / 100)

    @property
    def preco_sugerido(self):
        """Preço sugerido: custo total + lucro"""
        if not self.habilitar_precificacao:
            return 0
        return self.custo_total + self.lucro