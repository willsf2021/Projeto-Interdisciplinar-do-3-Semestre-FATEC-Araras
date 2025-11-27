from decimal import Decimal
from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from api.models import Receita, AlimentoTaco, Ingrediente
from api.serializers import IngredienteSerializer, IngredienteListSerializer

Usuario = get_user_model()


class IngredienteSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

        # === USUÁRIOS ===
        self.user = Usuario.objects.create_user(
            email='lucas@teste.com',
            password='123456',
            name='Lucas',
            type='estudante'
        )
        self.other_user = Usuario.objects.create_user(
            email='maria@teste.com',
            password='123456',
            name='Maria',
            type='profissional'
        )

        # === ALIMENTO ===
        self.alimento = AlimentoTaco.objects.create(
            codigo_taco="001",
            nome="Arroz Branco",
            categoria="Cereais",
            valor_energetico=Decimal('130.00'),
            proteinas=Decimal('2.50'),
            carboidratos=Decimal('28.10'),
            acucares_totais=Decimal('0.00'),
            acucares_adicionados=Decimal('0.00'),
            gorduras_totais=Decimal('0.30'),
            gorduras_saturadas=Decimal('0.10'),
            gorduras_trans=Decimal('0.00'),
            fibra_alimentar=Decimal('0.40'),
            sodio=Decimal('2.00'),
        )

        # === RECEITAS ===
        self.receita_propria = Receita.objects.create(
            nome="Arroz com Feijão",
            usuario=self.user,
            categoria="Prato Principal",
            tempo_preparo_horas=0,
            tempo_preparo_minutos=45,
            porcao_individual=Decimal('200.00'),
            medida='g',
            modo_preparo="Cozinhar o arroz e o feijão.",
            habilitar_precificacao=True
        )

        self.receita_outro_usuario = Receita.objects.create(
            nome="Lasanha",
            usuario=self.other_user,
            categoria="Massas",
            tempo_preparo_horas=1,
            tempo_preparo_minutos=30,
            porcao_individual=Decimal('300.00'),
            medida='g',
            modo_preparo="Montar camadas.",
            habilitar_precificacao=True
        )

        self.receita_sem_precificacao = Receita.objects.create(
            nome="Bolo de Chocolate",
            usuario=self.user,
            categoria="Sobremesa",
            tempo_preparo_horas=0,
            tempo_preparo_minutos=60,
            porcao_individual=Decimal('100.00'),
            medida='g',
            modo_preparo="Misturar e assar.",
            habilitar_precificacao=False
        )

    # ====================== 100% COBERTURA ======================

    def test_validate_receita_permissao_negada(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_outro_usuario.id, 'alimento': self.alimento.id, 'peso_bruto': 1000, 'peso_liquido': 900},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_validate_alimento_obrigatorio(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'peso_bruto': 500, 'peso_liquido': 450},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_validate_peso_bruto_zero_ou_negativo(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 0, 'peso_liquido': 100},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_validate_peso_liquido_zero_ou_negativo(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 1000, 'peso_liquido': 0},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_validate_peso_processado_negativo(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 1000, 'peso_liquido': 900, 'peso_processado': -10},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_validate_peso_liquido_maior_que_bruto(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 500, 'peso_liquido': 600},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_precificacao_apenas_custo_embalagem(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 1000, 'peso_liquido': 900, 'custo_embalagem': 15},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_precificacao_apenas_quantidade_embalagem(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 1000, 'peso_liquido': 900, 'quantidade_embalagem': 5},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_custo_embalagem_negativo(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 1000, 'peso_liquido': 900, 'custo_embalagem': -5, 'quantidade_embalagem': 10},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_quantidade_embalagem_zero_ou_negativa(self):
        request = self.factory.get('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={'receita': self.receita_propria.id, 'alimento': self.alimento.id, 'peso_bruto': 1000, 'peso_liquido': 900, 'custo_embalagem': 20, 'quantidade_embalagem': 0},
            context={'request': request}
        )
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_list_serializer_precificacao_desabilitada(self):
        """Quando habilitar_precificacao=False → retorna None"""
        ing = Ingrediente.objects.create(
            receita=self.receita_sem_precificacao,
            alimento=self.alimento,
            peso_bruto=2000,
            peso_liquido=1800,
            custo_embalagem=Decimal('10.00'),
            quantidade_embalagem=5
        )
        serializer = IngredienteListSerializer(ing)
        data = serializer.data
        self.assertIsNone(data['per_capita_bruto'])
        self.assertIsNone(data['custo_unitario'])
        self.assertIsNone(data['custo_total'])

    def test_list_serializer_precificacao_habilitada(self):
        """Quando habilitar_precificacao=True → retorna valores calculados"""
        ing = Ingrediente.objects.create(
            receita=self.receita_propria,
            alimento=self.alimento,
            peso_bruto=3000,
            peso_liquido=2700,
            peso_processado=2700,  # será usado no cálculo
            custo_embalagem=Decimal('20.00'),
            quantidade_embalagem=1000  # 1000g → R$20,00 → R$0,02/g
        )

        # Forçar cálculo correto do rendimento
        # peso_liquido_total = 2700g, porcao_individual = 200g → rendimento = 13.5 porções
        serializer = IngredienteListSerializer(ing)
        data = serializer.data

        self.assertIsNotNone(data['per_capita_bruto'])
        self.assertIsNotNone(data['custo_unitario'])
        self.assertIsNotNone(data['custo_total'])
        self.assertGreater(Decimal(data['per_capita_bruto']), 0)

    def test_criacao_valida_completa(self):
        request = self.factory.post('/')
        request.user = self.user
        serializer = IngredienteSerializer(
            data={
                'receita': self.receita_propria.id,
                'alimento': self.alimento.id,
                'peso_bruto': 1500,
                'peso_liquido': 1350,
                'peso_processado': 1200,
                'custo_embalagem': '19.90',
                'quantidade_embalagem': 10
            },
            context={'request': request}
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        obj = serializer.save()
        self.assertEqual(obj.peso_bruto, 1500)
        self.assertEqual(obj.custo_embalagem, Decimal('19.90'))