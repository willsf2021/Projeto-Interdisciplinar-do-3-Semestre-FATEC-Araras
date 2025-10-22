from django.db import models
from django.contrib.auth.models import User

class Perfil(models.Model):
    # representa usuario do diagrama (nutricionista/profissional/aluno)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    tipo_usuario = models.CharField(max_length=20, choices=[('aluno','aluno'),('professor','professor'),('profissional','profissional')], default='profissional')
    ativo = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class Cliente(models.Model):
    # cliente vinculado ao usuario (perfil/usuario)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clientes')
    nome = models.CharField(max_length=255)
    data_nascimento = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.nome


class Documento(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documentos')
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, blank=True, null=True, related_name='documentos')
    nome_receita = models.CharField(max_length=255)
    categoria = models.CharField(max_length=10, choices=[('doce','doce'),('salgado','salgado')], blank=True, null=True)
    tipo_alimento = models.CharField(max_length=10, choices=[('comida','comida'),('bebida','bebida')], blank=True, null=True)
    tempo_preparo_minutos = models.IntegerField(blank=True, null=True)
    modo_preparo = models.TextField(blank=True, null=True)
    informacoes_obrigatorias = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.nome_receita


class FichaTecnica(models.Model):
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name='fichas_tecnicas')
    peso_porcao_individual_g = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    medida_caseira = models.CharField(max_length=100, blank=True, null=True)
    rendimento_total = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    numero_porcoes = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TabelaTACO(models.Model):
    codigo_alimento = models.CharField(max_length=50, blank=True, null=True)
    nome_alimento = models.CharField(max_length=255)
    energia_kcal_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    proteinas_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    carboidratos_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    acucares_totais_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    acucares_adicionados_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_totais_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_saturadas_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_trans_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    fibra_alimentar_g_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sodio_mg_100g = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class IngredienteReceita(models.Model):
    ficha_tecnica = models.ForeignKey(FichaTecnica, on_delete=models.CASCADE, related_name='ingredientes')
    tabela_taco = models.ForeignKey(TabelaTACO, on_delete=models.SET_NULL, blank=True, null=True, related_name='ingredientes_receita')
    nome_ingrediente = models.CharField(max_length=255)
    peso_bruto_g = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    peso_liquido_g = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    ipc = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    alimento_cozido_g = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    fator_coccao = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    per_capita_bruta = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    per_capita_alimento_pronto = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    quantidade_embalagem = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    unidade_embalagem = models.CharField(max_length=3, choices=[('g','g'),('ml','ml')], blank=True, null=True)
    custo_embalagem = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    custo_unitario = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    custo_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    ordem = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['ordem']


class RotuloNutricional(models.Model):
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name='rotulos_nutricionais')
    porcao_definida_g_ml = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    fator_densidade = models.DecimalField(max_digits=10, decimal_places=4, blank=True, null=True)
    energia_kcal_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    proteinas_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    carboidratos_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    acucares_totais_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    acucares_adicionados_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_totais_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_saturadas_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_trans_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    fibra_alimentar_g_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sodio_mg_100 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    # por porção
    energia_kcal_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    proteinas_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    carboidratos_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    acucares_totais_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    acucares_adicionados_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_totais_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_saturadas_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gorduras_trans_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    fibra_alimentar_g_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sodio_mg_porcao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RotuloFrontal(models.Model):
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name='rotulos_frontais')
    alto_acucares_adicionados = models.BooleanField(default=False)
    alto_gorduras_saturadas = models.BooleanField(default=False)
    alto_sodio = models.BooleanField(default=False)
    valor_acucares_adicionados = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor_gorduras_saturadas = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor_sodio = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    observacoes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Precificacao(models.Model):
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name='precificacoes')
    total_custos_fixos = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_custos_variaveis = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    custo_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    markup_percentual = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    preco_sugerido = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    lucro_estimado = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CustoFixo(models.Model):
    precificacao = models.ForeignKey(Precificacao, on_delete=models.CASCADE, related_name='custos_fixos')
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CustoVariavel(models.Model):
    precificacao = models.ForeignKey(Precificacao, on_delete=models.CASCADE, related_name='custos_variaveis')
    tipo = models.CharField(max_length=30, choices=[('materia_prima','materia_prima'),('embalagens','embalagens')])
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)