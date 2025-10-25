from django.core.validators import MinValueValidator
from django.db import models


class AlimentoTaco(models.Model):
    codigo_taco = models.CharField(max_length=10, unique=True, verbose_name='Código TACO')
    nome = models.CharField(max_length=255, verbose_name='Nome do Alimento', blank= False)
    categoria = models.CharField(max_length=100, verbose_name='Categoria')
    
    
    # Valor energético (kcal por 100g)
    valor_energetico = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8,
        decimal_places=2,
        verbose_name='Valor Energético (kcal)',
        help_text='Valor energético por 100g',
        blank=False,
    )
    
    proteinas = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Proteínas (g)',
        help_text='Valor por 100g',
        blank= False,
    )
    carboidratos = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Carboidratos (g)',
        help_text='Valor por 100g',
        blank= False
    )
    acucares_totais = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Açúcares Totais (g)',
        help_text='Valor por 100g',
        blank= False
    )
    acucares_adicionados = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Açúcares Adicionados (g)',
        help_text='Valor por 100g',
        blank= False
    )
    gorduras_totais = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Gorduras Totais (g)',
        help_text='Valor por 100g',
        blank= False
    )
    gorduras_saturadas = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Gorduras Saturadas (g)',
        help_text='Valor por 100g',
        blank= False
    )
    gorduras_trans = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Gorduras Trans (g)',
        help_text='Valor por 100g',
        blank= False
    )
    fibra_alimentar = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Fibra Alimentar (g)',
        help_text='Valor por 100g',
        blank= False
    )
    sodio = models.DecimalField(
        validators=[MinValueValidator(0)],
        max_digits=8, 
        decimal_places=2, 
        verbose_name='Sódio (mg)',
        help_text='Valor por 100g',
        blank= False
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        db_table = 'alimentos_taco'
        verbose_name = 'Alimento TACO'
        verbose_name_plural = 'Alimentos TACO'
        ordering = ['nome']

    def __str__(self):
        return f"{self.codigo_taco} - {self.nome}"