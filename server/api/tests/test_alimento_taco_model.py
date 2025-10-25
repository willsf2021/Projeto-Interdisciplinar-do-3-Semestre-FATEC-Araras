from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import AlimentoTaco


class AlimentoTacoModelTest(TestCase):
    def setUp(self):
        """Configura dados iniciais para os testes"""
        self.alimento_data = {
            'codigo_taco': 'TACO001',
            'nome': 'Maçã Fuji',
            'categoria': 'Frutas',
            'valor_energetico': 0.5,
            'proteinas': 0.3,
            'carboidratos': 13.8,
            'acucares_totais': 10.4,
            'acucares_adicionados': 0.0,
            'gorduras_totais': 0.2,
            'gorduras_saturadas': 0.0,
            'gorduras_trans': 0.0,
            'fibra_alimentar': 2.4,
            'sodio': 1.0
        }

    def test_create_alimento_taco_success(self):
        """Testa criação bem-sucedida de AlimentoTaco"""
        alimento = AlimentoTaco.objects.create(**self.alimento_data)
        
        self.assertEqual(alimento.codigo_taco, 'TACO001')
        self.assertEqual(alimento.nome, 'Maçã Fuji')
        self.assertEqual(alimento.categoria, 'Frutas')
        self.assertEqual(alimento.proteinas, 0.3)
        self.assertEqual(alimento.valor_energetico, 0.5)
        self.assertEqual(alimento.carboidratos, 13.8)
        self.assertEqual(alimento.acucares_totais, 10.4)
        self.assertEqual(alimento.acucares_adicionados, 0.0)
        self.assertEqual(alimento.gorduras_totais, 0.2)
        self.assertEqual(alimento.gorduras_saturadas, 0.0)
        self.assertEqual(alimento.gorduras_trans, 0.0)
        self.assertEqual(alimento.fibra_alimentar, 2.4)
        self.assertEqual(alimento.sodio, 1.0)
        self.assertIsNotNone(alimento.created_at)
        self.assertIsNotNone(alimento.updated_at)

    def test_codigo_taco_unique_constraint(self):
        """Testa que codigo_taco deve ser único"""
        AlimentoTaco.objects.create(**self.alimento_data)
        
        # Tenta criar outro com mesmo código
        with self.assertRaises(Exception):
            AlimentoTaco.objects.create(
                codigo_taco='TACO001',
                nome='Banana',
                categoria='Frutas',
                valor_energetico=1.2,
                proteinas=1.1,
                carboidratos=22.8,
                acucares_totais=12.2,
                acucares_adicionados=0.0,
                gorduras_totais=0.3,
                gorduras_saturadas=0.1,
                gorduras_trans=0.0,
                fibra_alimentar=2.6,
                sodio=1.0
            )

    def test_string_representation(self):
        """Testa o método __str__"""
        alimento = AlimentoTaco.objects.create(**self.alimento_data)
        expected_str = f"TACO001 - Maçã Fuji"
        self.assertEqual(str(alimento), expected_str)

    def test_meta_options(self):
        """Testa as opções do Meta"""
        alimento = AlimentoTaco.objects.create(**self.alimento_data)
        meta = AlimentoTaco._meta
        
        self.assertEqual(meta.db_table, 'alimentos_taco')
        self.assertEqual(meta.verbose_name, 'Alimento TACO')
        self.assertEqual(meta.verbose_name_plural, 'Alimentos TACO')
        self.assertEqual(meta.ordering, ['nome'])

    def test_campos_obrigatorios(self):
        """Testa que campos obrigatórios não podem ser nulos/vazios"""
        campos_obrigatorios = [
            'nome', 'categoria', 'proteinas', 'carboidratos',
            'acucares_totais', 'acucares_adicionados', 'gorduras_totais',
            'gorduras_saturadas', 'gorduras_trans', 'fibra_alimentar', 'sodio'
        ]

        for campo in campos_obrigatorios:
            with self.subTest(campo=campo):
                data_invalido = self.alimento_data.copy()
                data_invalido[campo] = '' if isinstance(data_invalido[campo], str) else None

                alimento = AlimentoTaco(**data_invalido)
                with self.assertRaises(Exception):
                    alimento.full_clean()
                    alimento.save()

    def test_valores_nutricionais_decimais(self):
        """Testa campos decimais com valores válidos"""
        alimento = AlimentoTaco.objects.create(**self.alimento_data)
        
        # Testa precisão decimal
        self.assertIsInstance(alimento.proteinas, float)
        self.assertIsInstance(alimento.carboidratos, float)
        self.assertIsInstance(alimento.sodio, float)

    def test_valores_nutricionais_negativos(self):
        """Testa que valores nutricionais não podem ser negativos"""
        dados_negativos = self.alimento_data.copy()
        dados_negativos['proteinas'] = -1.0
        
        alimento = AlimentoTaco(**dados_negativos)

        with self.assertRaises(ValidationError):
            alimento.full_clean()
            alimento.save()

    def test_help_text_fields(self):
        """Testa que help_text está presente nos campos"""
        campo_proteinas = AlimentoTaco._meta.get_field('proteinas')
        self.assertEqual(campo_proteinas.help_text, 'Valor por 100g')
        
        campo_carboidratos = AlimentoTaco._meta.get_field('carboidratos')
        self.assertEqual(campo_carboidratos.help_text, 'Valor por 100g')

    def test_verbose_names(self):
        """Testa os verbose_names dos campos"""
        field_verbose_names = {
            'codigo_taco': 'Código TACO',
            'nome': 'Nome do Alimento',
            'categoria': 'Categoria',
            'valor_energetico': 'Valor Energético (kcal)',
            'proteinas': 'Proteínas (g)',
            'carboidratos': 'Carboidratos (g)',
            'acucares_totais': 'Açúcares Totais (g)',
            'acucares_adicionados': 'Açúcares Adicionados (g)',
            'gorduras_totais': 'Gorduras Totais (g)',
            'gorduras_saturadas': 'Gorduras Saturadas (g)',
            'gorduras_trans': 'Gorduras Trans (g)',
            'fibra_alimentar': 'Fibra Alimentar (g)',
            'sodio': 'Sódio (mg)',
            'created_at': 'Criado em',
            'updated_at': 'Atualizado em'
        }
        
        for field, expected_verbose in field_verbose_names.items():
            with self.subTest(field=field):
                field_obj = AlimentoTaco._meta.get_field(field)
                self.assertEqual(field_obj.verbose_name, expected_verbose)


class AlimentoTacoQueryTest(TestCase):
    """Testes para consultas e queries"""
    
    def setUp(self):
        """Configura múltiplos alimentos para testes de query"""
        self.alimento1 = AlimentoTaco.objects.create(
            codigo_taco='TACO001',
            nome='Maçã',
            categoria='Frutas',
            valor_energetico=1.2,
            proteinas=0.3,
            carboidratos=13.8,
            acucares_totais=10.4,
            acucares_adicionados=0.0,
            gorduras_totais=0.2,
            gorduras_saturadas=0.0,
            gorduras_trans=0.0,
            fibra_alimentar=2.4,
            sodio=1.0
        )
        
        self.alimento2 = AlimentoTaco.objects.create(
            codigo_taco='TACO002',
            nome='Banana',
            categoria='Frutas',
            valor_energetico=1.2,
            proteinas=1.1,
            carboidratos=22.8,
            acucares_totais=12.2,
            acucares_adicionados=0.0,
            gorduras_totais=0.3,
            gorduras_saturadas=0.1,
            gorduras_trans=0.0,
            fibra_alimentar=2.6,
            sodio=1.0
        )
        
        self.alimento3 = AlimentoTaco.objects.create(
            codigo_taco='TACO003',
            nome='Peito de Frango',
            categoria='Carnes',
            valor_energetico=1.2,
            proteinas=31.0,
            carboidratos=0.0,
            acucares_totais=0.0,
            acucares_adicionados=0.0,
            gorduras_totais=3.6,
            gorduras_saturadas=1.0,
            gorduras_trans=0.0,
            fibra_alimentar=0.0,
            sodio=65.0
        )

    def test_ordering_by_nome(self):
        """Testa que alimentos são ordenados por nome"""
        alimentos = AlimentoTaco.objects.all()
        self.assertEqual(alimentos[0].nome, 'Banana')
        self.assertEqual(alimentos[1].nome, 'Maçã')
        self.assertEqual(alimentos[2].nome, 'Peito de Frango')

    def test_filter_by_categoria(self):
        """Testa filtro por categoria"""
        frutas = AlimentoTaco.objects.filter(categoria='Frutas')
        self.assertEqual(frutas.count(), 2)
        
        carnes = AlimentoTaco.objects.filter(categoria='Carnes')
        self.assertEqual(carnes.count(), 1)

    def test_filter_by_proteinas(self):
        """Testa filtro por proteínas"""
        alto_teor_proteina = AlimentoTaco.objects.filter(proteinas__gte=10.0)
        self.assertEqual(alto_teor_proteina.count(), 1)
        self.assertEqual(alto_teor_proteina.first().nome, 'Peito de Frango')

    def test_search_by_nome(self):
        """Testa busca por nome"""
        resultado = AlimentoTaco.objects.filter(nome__icontains='maç')
        self.assertEqual(resultado.count(), 1)
        self.assertEqual(resultado.first().codigo_taco, 'TACO001')

    def test_get_by_codigo_taco(self):
        """Testa busca por código TACO"""
        alimento = AlimentoTaco.objects.get(codigo_taco='TACO002')
        self.assertEqual(alimento.nome, 'Banana')


class AlimentoTacoEdgeCasesTest(TestCase):
    """Testes para casos extremos e validações"""
    
    def test_codigo_taco_max_length(self):
        """Testa limite máximo do campo codigo_taco"""
        # Deve funcionar com 10 caracteres
        alimento = AlimentoTaco.objects.create(
            codigo_taco='T' * 10,
            nome='Teste',
            categoria='Teste',
            valor_energetico=1.2,
            proteinas=1.0,
            carboidratos=1.0,
            acucares_totais=1.0,
            acucares_adicionados=1.0,
            gorduras_totais=1.0,
            gorduras_saturadas=1.0,
            gorduras_trans=1.0,
            fibra_alimentar=1.0,
            sodio=1.0
        )
        self.assertEqual(alimento.codigo_taco, 'T' * 10)

    def test_nome_max_length(self):
        """Testa limite máximo do campo nome"""
        # Deve funcionar com 255 caracteres
        nome_longo = 'A' * 255
        alimento = AlimentoTaco.objects.create(
            codigo_taco='TACO999',
            nome=nome_longo,
            categoria='Teste',
            valor_energetico=1.2,
            proteinas=1.0,
            carboidratos=1.0,
            acucares_totais=1.0,
            acucares_adicionados=1.0,
            gorduras_totais=1.0,
            gorduras_saturadas=1.0,
            gorduras_trans=1.0,
            fibra_alimentar=1.0,
            sodio=1.0
        )
        self.assertEqual(alimento.nome, nome_longo)

    def test_valores_nutricionais_extremos(self):
        """Testa valores nutricionais com valores extremos"""
        alimento = AlimentoTaco.objects.create(
            codigo_taco='TACO100',
            nome='Alimento Extremo',
            categoria='Teste',
            valor_energetico=9999.99,
            proteinas=9999.99,  # Valor máximo suportado
            carboidratos=9999.99,
            acucares_totais=9999.99,
            acucares_adicionados=9999.99,
            gorduras_totais=9999.99,
            gorduras_saturadas=9999.99,
            gorduras_trans=9999.99,
            fibra_alimentar=9999.99,
            sodio=9999.99
        )
        
        self.assertEqual(alimento.proteinas, 9999.99)


class AlimentoTacoIntegrationTest(TestCase):
    """Testes de integração mais complexos"""
    
    def test_bulk_create_alimentos(self):
        """Testa criação em massa de alimentos"""
        alimentos_data = [
            {
                'codigo_taco': f'TACO{i:03d}',
                'nome': f'Alimento Teste {i}',
                'categoria': 'Teste',
                'valor_energetico': float(i),
                'proteinas': float(i),
                'carboidratos': float(i * 2),
                'acucares_totais': float(i * 0.5),
                'acucares_adicionados': 0.0,
                'gorduras_totais': float(i * 0.1),
                'gorduras_saturadas': float(i * 0.05),
                'gorduras_trans': 0.0,
                'fibra_alimentar': float(i * 0.2),
                'sodio': float(i * 10)
            }
            for i in range(1, 6)
        ]
        
        alimentos = [AlimentoTaco(**data) for data in alimentos_data]
        AlimentoTaco.objects.bulk_create(alimentos)
        
        self.assertEqual(AlimentoTaco.objects.count(), 5)
        
        # Verifica se ordenação por nome funciona
        primeiro = AlimentoTaco.objects.first()
        self.assertEqual(primeiro.nome, 'Alimento Teste 1')

    def test_update_alimento(self):
        """Testa atualização de alimento existente"""
        alimento = AlimentoTaco.objects.create(
            codigo_taco='TACO888',
            nome='Alimento Original',
            categoria='Original',
            valor_energetico=1.2,
            proteinas=1.0,
            carboidratos=1.0,
            acucares_totais=1.0,
            acucares_adicionados=1.0,
            gorduras_totais=1.0,
            gorduras_saturadas=1.0,
            gorduras_trans=1.0,
            fibra_alimentar=1.0,
            sodio=1.0
        )
        
        # Atualiza o nome
        alimento.nome = 'Alimento Atualizado'
        alimento.proteinas = 25.5
        alimento.save()
        
        # Recarrega do banco
        alimento_refreshed = AlimentoTaco.objects.get(codigo_taco='TACO888')
        self.assertEqual(alimento_refreshed.nome, 'Alimento Atualizado')
        self.assertEqual(alimento_refreshed.proteinas, 25.5)
        self.assertNotEqual(alimento_refreshed.updated_at, alimento_refreshed.created_at)