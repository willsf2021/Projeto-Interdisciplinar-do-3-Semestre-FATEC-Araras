from django.test import TestCase
from decimal import Decimal
from api.models import Receita, Ingrediente, AlimentoTaco, Usuario


class IngredienteModelTest(TestCase):
    """Testes para o model Ingrediente"""
    
    def setUp(self):
        """Configuração inicial para cada teste"""
        self.usuario = Usuario.objects.create_user(
            name="Texte da Silva",
            email='teste@example.com',
            password='senha123',
            type='profissional',
        )
        
        self.receita = Receita.objects.create(
            usuario=self.usuario,
            nome='Bolo de Chocolate',
            categoria='Sobremesa',
            porcao_individual=Decimal('100.00'),
            medida='g',
            modo_preparo='Misture tudo e asse',
            habilitar_precificacao=True,
            markup=Decimal('50.00')
        )
        
        self.alimento = AlimentoTaco.objects.create(
            codigo_taco='001',
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

    def test_criacao_ingrediente(self):
        """Testa se o ingrediente é criado corretamente"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('280.00'),
            peso_processado=Decimal('270.00')
        )
        
        self.assertEqual(ingrediente.receita, self.receita)
        self.assertEqual(ingrediente.alimento, self.alimento)
        self.assertEqual(ingrediente.peso_bruto, Decimal('300.00'))
        self.assertEqual(ingrediente.peso_liquido, Decimal('280.00'))
        self.assertEqual(ingrediente.peso_processado, Decimal('270.00'))

    def test_str_method(self):
        """Testa o método __str__"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        
        self.assertEqual(
            str(ingrediente),
            f"{self.alimento.nome} - {self.receita.nome}"
        )

    def test_peso_processado_auto_preenchido(self):
        """Testa se peso_processado é preenchido automaticamente com peso_liquido"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('280.00')
            # peso_processado não informado
        )
        
        self.assertEqual(ingrediente.peso_processado, Decimal('280.00'))

    def test_peso_processado_customizado(self):
        """Testa se peso_processado customizado é mantido"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('280.00'),
            peso_processado=Decimal('250.00')
        )
        
        self.assertEqual(ingrediente.peso_processado, Decimal('250.00'))

    def test_per_capita_bruto(self):
        """Testa cálculo do per capita bruto"""
        # Criar outro ingrediente para ter peso líquido total
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            peso_processado=Decimal('300.00')
        )
        
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=AlimentoTaco.objects.create(
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
            ),
            peso_bruto=Decimal('200.00'),
            peso_liquido=Decimal('200.00'),
            peso_processado=Decimal('200.00')
        )
        
        # Rendimento = 500 / 100 = 5 porções
        # Per capita = 200 / 5 = 40
        self.assertEqual(ingrediente.per_capita_bruto, Decimal('40'))

    def test_per_capita_bruto_rendimento_zero(self):
        """Testa per capita bruto quando rendimento é zero"""
        receita_sem_porcao = Receita.objects.create(
            usuario=self.usuario,
            nome='Teste',
            categoria='Teste',
            porcao_individual=Decimal('0'),
            medida='g',
            modo_preparo='Teste'
        )
        
        ingrediente = Ingrediente.objects.create(
            receita=receita_sem_porcao,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        
        self.assertEqual(ingrediente.per_capita_bruto, 0)

    def test_custo_unitario_sem_precificacao(self):
        """Testa custo unitário quando precificação está desabilitada"""
        self.receita.habilitar_precificacao = False
        self.receita.save()
        
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            custo_embalagem=Decimal('10.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        self.assertEqual(ingrediente.custo_unitario, 0)

    def test_custo_unitario_sem_dados_precificacao(self):
        """Testa custo unitário quando dados de precificação não estão completos"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
            # sem custo_embalagem e quantidade_embalagem
        )
        
        self.assertEqual(ingrediente.custo_unitario, 0)

    def test_custo_unitario_calculado(self):
        """Testa cálculo do custo unitário"""
        # Primeiro ingrediente para estabelecer peso líquido total
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            peso_processado=Decimal('300.00')
        )
        
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=AlimentoTaco.objects.create(
                codigo_taco='003',
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
            ),
            peso_bruto=Decimal('200.00'),
            peso_liquido=Decimal('200.00'),
            peso_processado=Decimal('200.00'),
            custo_embalagem=Decimal('5.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        # Rendimento = 500 / 100 = 5 porções
        # Per capita = 200 / 5 = 40
        # Custo unitário = (5 / 1000) * 40 = 0.20
        self.assertEqual(ingrediente.custo_unitario, Decimal('0.20'))

    def test_custo_total_sem_precificacao(self):
        """Testa custo total quando precificação está desabilitada"""
        self.receita.habilitar_precificacao = False
        self.receita.save()
        
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            custo_embalagem=Decimal('10.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        self.assertEqual(ingrediente.custo_total, 0)

    def test_custo_total_calculado(self):
        """Testa cálculo do custo total"""
        # Primeiro ingrediente
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            peso_processado=Decimal('300.00')
        )
        
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
                alimento=AlimentoTaco.objects.create(
                codigo_taco='004',
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
            ),
            peso_bruto=Decimal('200.00'),
            peso_liquido=Decimal('200.00'),
            peso_processado=Decimal('200.00'),
            custo_embalagem=Decimal('5.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        # Custo unitário = 0.20
        # Rendimento = 5
        # Custo total = 0.20 * 5 = 1.00
        self.assertEqual(ingrediente.custo_total, Decimal('1.00'))

    def test_relacionamento_com_receita(self):
        """Testa o relacionamento ForeignKey com Receita"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        
        self.assertEqual(ingrediente.receita, self.receita)
        self.assertIn(ingrediente, self.receita.ingredientes.all())

    def test_custo_unitario_quantidade_embalagem_zero(self):
        """Testa custo_unitario retorna 0 quando quantidade_embalagem é zero"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            custo_embalagem=Decimal('10.00'),
            quantidade_embalagem=Decimal('0')
        )
    
        self.assertEqual(ingrediente.custo_unitario, 0)

    def test_relacionamento_com_alimento(self):
        """Testa o relacionamento ForeignKey com AlimentoTaco"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        
        self.assertEqual(ingrediente.alimento, self.alimento)

    def test_on_delete_cascade_receita(self):
        """Testa se ingrediente é deletado ao deletar receita"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        
        ingrediente_id = ingrediente.id
        self.receita.delete()
        
        with self.assertRaises(Ingrediente.DoesNotExist):
            Ingrediente.objects.get(id=ingrediente_id)

    def test_ordering(self):
        """Testa se a ordenação está por id"""
        ingrediente1 = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        
        alimento2 = AlimentoTaco.objects.create(
            codigo_taco='005',
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
        
        ingrediente2 = Ingrediente.objects.create(
            receita=self.receita,
            alimento=alimento2,
            peso_bruto=Decimal('200.00'),
            peso_liquido=Decimal('200.00')
        )
        
        ingredientes = Ingrediente.objects.filter(receita=self.receita)
        self.assertEqual(ingredientes[0], ingrediente1)
        self.assertEqual(ingredientes[1], ingrediente2)

    def test_verbose_names(self):
        """Testa os verbose names dos campos"""
        ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )
        
        self.assertEqual(
            ingrediente._meta.get_field('receita').verbose_name,
            'Receita'
        )
        self.assertEqual(
            ingrediente._meta.get_field('alimento').verbose_name,
            'Alimento'
        )
        self.assertEqual(
            ingrediente._meta.get_field('peso_bruto').verbose_name,
            'Peso Bruto (g/ml)'
        )
        self.assertEqual(
            ingrediente._meta.get_field('peso_liquido').verbose_name,
            'Peso Líquido (g/ml)'
        )

    def test_meta_db_table(self):
        """Testa se o nome da tabela está correto"""
        self.assertEqual(Ingrediente._meta.db_table, 'ingredientes')

    def test_meta_verbose_name(self):
        """Testa os verbose names do model"""
        self.assertEqual(Ingrediente._meta.verbose_name, 'Ingrediente')
        self.assertEqual(Ingrediente._meta.verbose_name_plural, 'Ingredientes')