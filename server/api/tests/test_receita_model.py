from django.test import TestCase
from decimal import Decimal
from api.models import Receita, Ingrediente, AlimentoTaco, Usuario


class ReceitaModelTest(TestCase):
    """Testes para o model Receita"""
    
    def setUp(self):
        """Configuração inicial para cada teste"""
        self.usuario = Usuario.objects.create_user(
            name="Teste da Silva",
            email='teste@example.com',
            password='senha123',
            type='profissional'
        )
        
        self.receita = Receita.objects.create(
            usuario=self.usuario,
            nome='Bolo de Chocolate',
            categoria='Sobremesa',
            tempo_preparo_horas=1,
            tempo_preparo_minutos=30,
            porcao_individual=Decimal('100.00'),
            medida='g',
            modo_preparo='Misture tudo e asse',
            habilitar_precificacao=True,
            markup=Decimal('50.00')
        )
        
            # Cria alimentos para os ingredientes
        self.farinha = AlimentoTaco.objects.create(
            codigo_taco='001',
            nome='Farinha de trigo',
            valor_energetico=Decimal('10'),
            proteinas=Decimal('10'),
            carboidratos=Decimal('75'),
            fibra_alimentar=Decimal('2.5'),
            acucares_totais=Decimal('2.5'),
            acucares_adicionados=Decimal('2.5'),
            gorduras_totais=Decimal('2.5'),
            gorduras_saturadas=Decimal('2.5'),
            gorduras_trans=Decimal('2.5'),
            sodio=Decimal('2.5'),
        )
        
        self.acucar = AlimentoTaco.objects.create(
            codigo_taco='002',
            nome='Açúcar',
            valor_energetico=Decimal('10'),
            proteinas=Decimal('10'),
            carboidratos=Decimal('75'),
            fibra_alimentar=Decimal('2.5'),
            acucares_totais=Decimal('2.5'),
            acucares_adicionados=Decimal('2.5'),
            gorduras_totais=Decimal('2.5'),
            gorduras_saturadas=Decimal('2.5'),
            gorduras_trans=Decimal('2.5'),
            sodio=Decimal('2.5'),
        )
    
    def test_criacao_receita(self):
        """Testa se a receita é criada corretamente"""
        self.assertEqual(self.receita.nome, 'Bolo de Chocolate')
        self.assertEqual(self.receita.categoria, 'Sobremesa')
        self.assertEqual(self.receita.usuario, self.usuario)
        self.assertTrue(self.receita.habilitar_precificacao)

    def test_str_method(self):
        """Testa o método __str__"""
        self.assertEqual(str(self.receita), 'Bolo de Chocolate')

    def test_peso_liquido_total_sem_ingredientes(self):
        """Testa peso líquido total quando não há ingredientes"""
        self.assertEqual(self.receita.peso_liquido_total, 0)

    def test_peso_liquido_total_com_ingredientes(self):
        """Testa peso líquido total com ingredientes"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.acucar,
            peso_bruto=Decimal('200.00'),
            peso_liquido=Decimal('200.00')
        )
        
        self.assertEqual(self.receita.peso_liquido_total, Decimal('500.00'))

    def test_rendimento_calculado(self):
        """Testa cálculo do rendimento (número de porções)"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.acucar,
            peso_bruto=Decimal('200.00'),
            peso_liquido=Decimal('200.00')
        )
        
        # 500g / 100g por porção = 5 porções
        self.assertEqual(self.receita.rendimento, Decimal('5'))

    def test_rendimento_com_porcao_zero(self):
        """Testa rendimento quando porção individual é zero"""
        receita = Receita.objects.create(
            usuario=self.usuario,
            nome='Teste',
            categoria='Teste',
            porcao_individual=Decimal('0'),
            medida='g',
            modo_preparo='Teste'
        )
        self.assertEqual(receita.rendimento, 0)

    def test_custo_total_sem_precificacao(self):
        """Testa custo total quando precificação está desabilitada"""
        self.receita.habilitar_precificacao = False
        self.receita.save()
        
        self.assertEqual(self.receita.custo_total, 0)

    def test_custo_total_com_precificacao(self):
        """Testa cálculo do custo total com precificação"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            peso_processado=Decimal('300.00'),
            custo_embalagem=Decimal('10.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        # Custo: (10 / 1000) * 300 * 3 (rendimento) = 9.00
        # Nota: o rendimento seria 300/100 = 3 se porcao_individual for 100
        self.assertGreater(self.receita.custo_total, 0)

    def test_lucro_sem_precificacao(self):
        """Testa lucro quando precificação está desabilitada"""
        self.receita.habilitar_precificacao = False
        self.receita.save()
        
        self.assertEqual(self.receita.lucro, 0)

    def test_lucro_sem_markup(self):
        """Testa lucro quando markup não está definido"""
        self.receita.markup = None
        self.receita.save()
        
        self.assertEqual(self.receita.lucro, 0)

    def test_lucro_calculado(self):
        """Testa cálculo do lucro"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            peso_processado=Decimal('300.00'),
            custo_embalagem=Decimal('10.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        custo = self.receita.custo_total
        lucro_esperado = custo * (Decimal('50.00') / 100)
        self.assertEqual(self.receita.lucro, lucro_esperado)

    def test_preco_sugerido_sem_precificacao(self):
        """Testa preço sugerido quando precificação está desabilitada"""
        self.receita.habilitar_precificacao = False
        self.receita.save()
        
        self.assertEqual(self.receita.preco_sugerido, 0)

    def test_preco_sugerido_calculado(self):
        """Testa cálculo do preço sugerido"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            peso_processado=Decimal('300.00'),
            custo_embalagem=Decimal('10.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        custo = self.receita.custo_total
        lucro = self.receita.lucro
        self.assertEqual(self.receita.preco_sugerido, custo + lucro)

    def test_medida_choices(self):
        """Testa as opções de medida"""
        receita_ml = Receita.objects.create(
            usuario=self.usuario,
            nome='Suco',
            categoria='Bebida',
            porcao_individual=Decimal('200.00'),
            medida='ml',
            modo_preparo='Bata e sirva'
        )
        
        self.assertEqual(receita_ml.medida, 'ml')
        self.assertIn(receita_ml.medida, ['g', 'ml'])

    def test_tempo_preparo(self):
        """Testa se os tempos de preparo são salvos corretamente"""
        self.assertEqual(self.receita.tempo_preparo_horas, 1)
        self.assertEqual(self.receita.tempo_preparo_minutos, 30)

    def test_ordering(self):
        """Testa se a ordenação está por -created_at"""
        receita2 = Receita.objects.create(
            usuario=self.usuario,
            nome='Receita 2',
            categoria='Teste',
            porcao_individual=Decimal('100.00'),
            medida='g',
            modo_preparo='Teste'
        )
        
        receitas = Receita.objects.all()
        self.assertEqual(receitas[0], receita2)
        self.assertEqual(receitas[1], self.receita)

    def test_relacionamento_com_usuario(self):
        """Testa o relacionamento ForeignKey com Usuario"""
        self.assertEqual(self.receita.usuario, self.usuario)
        self.assertIn(self.receita, self.usuario.receitas.all())

    def test_verbose_names(self):
        """Testa os verbose names dos campos"""
        self.assertEqual(
            self.receita._meta.get_field('nome').verbose_name,
            'Nome da Receita'
        )
        self.assertEqual(
            self.receita._meta.get_field('porcao_individual').verbose_name,
            'Porção Individual (g/ml)'
        )

    #-----------------------------------------------------------------------------------------------------#
    def test_peso_total_processado(self):
        """Testa peso total processado"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('300'),
            peso_liquido=Decimal('280'),
            peso_processado=Decimal('250')
        )

        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.acucar,
            peso_bruto=Decimal('200'),
            peso_liquido=Decimal('190'),
            peso_processado=Decimal('150')
        )

        # 250 + 150
        self.assertEqual(self.receita.peso_total_processado, Decimal('400'))

    def test_calcular_nutrientes_totais(self):
        """Testa cálculo total de nutrientes da receita"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('100'),
            peso_liquido=Decimal('100')
        )

        nutrientes = self.receita.calcular_nutrientes_totais()

        # Como o alimento foi cadastrado com valor 10 por 100g,
        # e o ingrediente tem 100g => fator = 1
        self.assertEqual(nutrientes['valor_energetico'], Decimal('10'))
        self.assertEqual(nutrientes['proteinas'], Decimal('10'))
        self.assertEqual(nutrientes['carboidratos'], Decimal('75'))

    def test_calcular_nutrientes_por_100g(self):
        """Testa cálculo de nutrientes por 100g"""
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('200'),
            peso_liquido=Decimal('200')
        )

        nutrientes_100g = self.receita.calcular_nutrientes_por_100g()

        # Como temos 200g, nutrientes totais = alimento × 2
        # nutrientes por 100g devem ser iguais ao alimento
        self.assertEqual(nutrientes_100g['proteinas'], Decimal('10'))
        self.assertEqual(nutrientes_100g['carboidratos'], Decimal('75'))


    def test_calcular_nutrientes_por_100g_sem_peso(self):
        """Testa nutrientes por 100g quando peso total é zero"""
        nutrientes_100g = self.receita.calcular_nutrientes_por_100g()

        for valor in nutrientes_100g.values():
            self.assertEqual(valor, Decimal('0.00'))

    def test_calcular_nutrientes_por_porcao(self):
        """Testa cálculo de nutrientes por porção"""
        self.receita.porcao_individual = Decimal('100')
        self.receita.save()

        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('100'),
            peso_liquido=Decimal('100')
        )

        nutrientes = self.receita.calcular_nutrientes_por_porcao()

        # Como porção = 100g, deve ser igual a nutrientes por 100g
        self.assertEqual(nutrientes['proteinas'], Decimal('10'))
        self.assertEqual(nutrientes['sodio'], Decimal('2.5'))

    def test_calcular_nutrientes_por_porcao_diferente_de_100(self):
        """Testa cálculo de nutrientes por porção quando porção != 100g"""
        self.receita.porcao_individual = Decimal('50')
        self.receita.save()

        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.farinha,
            peso_bruto=Decimal('100'),
            peso_liquido=Decimal('100')
        )

        nutrientes = self.receita.calcular_nutrientes_por_porcao()

        # Como 50g é metade da base 100g, os valores devem ser metade
        self.assertEqual(nutrientes['proteinas'], Decimal('5'))
        self.assertEqual(nutrientes['carboidratos'], Decimal('37.5'))
        
    def test_calcular_valores_diarios(self):
        """Testa cálculo de valores diários"""
        nutrientes_porcao = {
            'valor_energetico': Decimal('200'),
            'carboidratos': Decimal('30'),
            'proteinas': Decimal('10'),
            'gorduras_totais': Decimal('20'),
            'gorduras_saturadas': Decimal('5'),
            'fibra_alimentar': Decimal('5'),
            'sodio': Decimal('400'),
        }

        vd = self.receita.calcular_valores_diarios(nutrientes_porcao)

        self.assertEqual(vd['valor_energetico'], Decimal('10'))   # 200 / 2000 × 100
        self.assertEqual(vd['proteinas'], Decimal('20'))          # 10 / 50 × 100
        self.assertEqual(vd['sodio'], Decimal('20'))              # 400 / 2000 × 100

    
    def test_calcular_valores_diarios_nutriente_sem_referencia(self):
        """Testa VD quando nutriente não existe na tabela padrão"""
        nutrientes_porcao = {'gorduras_trans': Decimal('5')}

        vd = self.receita.calcular_valores_diarios(nutrientes_porcao)

        self.assertEqual(vd['gorduras_trans'], Decimal('0.00'))






