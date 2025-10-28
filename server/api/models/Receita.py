from django.db import models
from django.conf import settings
from decimal import Decimal

class Receita(models.Model):
    MEDIDA_CHOICES = [
        ('g', 'Gramas (g)'),
        ('ml', 'Mililitros (ml)'),
    ]
    
    FORMATO_ROTULO_CHOICES = [
        ('vertical', 'Vertical'),
        ('horizontal', 'Horizontal'),
        ('quebrado_vertical', 'Quebrado Vertical'),
        ('quebrado_horizontal', 'Quebrado Horizontal'),
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
    
    # Rótulo Nutricional
    habilitar_rotulo_nutricional = models.BooleanField(
        default=False, 
        verbose_name='Habilitar Rótulo Nutricional'
    )
    formato_rotulo = models.CharField(
        max_length=20,
        choices=FORMATO_ROTULO_CHOICES,
        default='vertical',
        verbose_name='Formato do Rótulo'
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
    def peso_total_processado(self):
        """Soma dos pesos processados de todos os ingredientes"""
        return sum(
            ing.peso_processado for ing in self.ingredientes.all()
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
            return Decimal('0.00')
        return sum(
            ing.custo_total for ing in self.ingredientes.all()
        )

    @property
    def lucro(self):
        """Lucro: custo total × (markup ÷ 100)"""
        if not self.habilitar_precificacao or not self.markup:
            return Decimal('0.00')
        return self.custo_total * (self.markup / Decimal('100.00'))

    @property
    def preco_sugerido(self):
        """Preço sugerido: custo total + lucro"""
        if not self.habilitar_precificacao:
            return Decimal('0.00')
        return self.custo_total + self.lucro
    
    
    def calcular_nutrientes_por_100g(self):
        """Calcula nutrientes por 100g da preparação completa"""
        nutrientes_totais = self.calcular_nutrientes_totais()
        nutrientes_100g = {}
        
        if self.peso_liquido_total > 0:
            for nutriente, valor in nutrientes_totais.items():
                nutrientes_100g[nutriente] = (valor / self.peso_liquido_total) * Decimal('100.00')
        else:
            for nutriente in nutrientes_totais:
                nutrientes_100g[nutriente] = Decimal('0.00')
        
        return nutrientes_100g

    def calcular_nutrientes_totais(self):
        """Calcula os nutrientes totais da receita baseado nos ingredientes"""
        nutrientes = {
            'valor_energetico': Decimal('0.00'),
            'proteinas': Decimal('0.00'),
            'carboidratos': Decimal('0.00'),
            'acucares_totais': Decimal('0.00'),
            'acucares_adicionados': Decimal('0.00'),
            'gorduras_totais': Decimal('0.00'),
            'gorduras_saturadas': Decimal('0.00'),
            'gorduras_trans': Decimal('0.00'),
            'fibra_alimentar': Decimal('0.00'),
            'sodio': Decimal('0.00'),
        }
        
        for ingrediente in self.ingredientes.all():
            alimento = ingrediente.alimento
            # Converter para base 100g e multiplicar pelo peso líquido do ingrediente
            fator = ingrediente.peso_liquido  / Decimal('100.00')
            
            nutrientes['valor_energetico'] += alimento.valor_energetico * fator
            nutrientes['proteinas'] += alimento.proteinas * fator
            nutrientes['carboidratos'] += alimento.carboidratos * fator
            nutrientes['acucares_totais'] += alimento.acucares_totais * fator
            nutrientes['acucares_adicionados'] += alimento.acucares_adicionados * fator
            nutrientes['gorduras_totais'] += alimento.gorduras_totais * fator
            nutrientes['gorduras_saturadas'] += alimento.gorduras_saturadas * fator
            nutrientes['gorduras_trans'] += alimento.gorduras_trans * fator
            nutrientes['fibra_alimentar'] += alimento.fibra_alimentar * fator
            nutrientes['sodio'] += alimento.sodio * fator
        
        return nutrientes

    def calcular_nutrientes_por_porcao(self):
        """Calcula nutrientes por porção individual"""
        # ✅ CORREÇÃO: Use nutrientes por 100g e ajuste para o peso da porção
        nutrientes_por_100g = self.calcular_nutrientes_por_100g()
        nutrientes_porcao = {}

        fator_porcao = self.porcao_individual / Decimal('100.00')

        for nutriente, valor in nutrientes_por_100g.items():
            nutrientes_porcao[nutriente] = valor * fator_porcao

        return nutrientes_porcao

    def calcular_valores_diarios(self, nutrientes_porcao):
        """Calcula % Valores Diários baseado em dieta de 2000kcal (conforme planilha)"""
        vd_referencia = {
            'valor_energetico': Decimal('2000.00'),  # kcal
            'carboidratos': Decimal('300.00'),       # g
            'proteinas': Decimal('50.00'),           # g
            'gorduras_totais': Decimal('65.00'),     # g 
            'gorduras_saturadas': Decimal('20.00'),  # g 
            'fibra_alimentar': Decimal('25.00'),     # g
            'sodio': Decimal('2000.00'),             # mg 
        }
        
        vd_calculado = {}
        for nutriente, valor in nutrientes_porcao.items():
            if nutriente in vd_referencia and vd_referencia[nutriente] > 0:
                vd_calculado[nutriente] = (valor / vd_referencia[nutriente]) * Decimal('100.00')
            else:
                vd_calculado[nutriente] = Decimal('0.00')
        
        return vd_calculado