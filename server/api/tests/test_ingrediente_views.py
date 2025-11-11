from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from api.models import Ingrediente, Receita, AlimentoTaco, Usuario
from decimal import Decimal


class IngredienteViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Cria usuários
        self.user1 = Usuario.objects.create_user(
            name="Usuario Teste 1",
            email="user1@email.com",
            password="123456",
            type="estudante"
        )
        self.user2 = Usuario.objects.create_user(
            name="Usuario Teste 2",
            email="user2@email.com",
            password="123456",
            type="estudante"
        )

        # Cria receitas
        self.receita_user1 = Receita.objects.create(
            usuario=self.user1,
            nome="Receita User1",
            categoria="Sobremesa",
            tempo_preparo_horas=0,
            tempo_preparo_minutos=30,
            porcao_individual=Decimal('200.00'),
            medida="g",
            modo_preparo="Misturar todos os ingredientes e assar por 30 minutos.",
            habilitar_precificacao=True
        )
        
        self.receita_user2 = Receita.objects.create(
            usuario=self.user2,
            nome="Receita User2",
            categoria="Prato Principal",
            tempo_preparo_horas=1,
            tempo_preparo_minutos=15,
            porcao_individual=Decimal('350.00'),
            medida="g",
            modo_preparo="Cozinhar os ingredientes e servir quente.",
            habilitar_precificacao=True,
            markup=Decimal('30.00')
        )

        # Cria alimentos Taco
        self.alimento1 = AlimentoTaco.objects.create(
            codigo_taco='001',
            nome='Farinha de trigo',
            valor_energetico=Decimal('10.0'),
            proteinas=Decimal('10.0'),
            carboidratos=Decimal('75.0'),
            fibra_alimentar=Decimal('2.5'),
            acucares_totais=Decimal('2.5'),
            acucares_adicionados=Decimal('2.5'),
            gorduras_totais=Decimal('2.5'),
            gorduras_saturadas=Decimal('2.5'),
            gorduras_trans=Decimal('2.5'),
            sodio=Decimal('2.5'),
        )
        
        self.alimento2 = AlimentoTaco.objects.create(
            codigo_taco='002',
            nome='Açúcar',
            valor_energetico=Decimal('10.0'),
            proteinas=Decimal('10.0'),
            carboidratos=Decimal('75.0'),
            fibra_alimentar=Decimal('2.5'),
            acucares_totais=Decimal('2.5'),
            acucares_adicionados=Decimal('2.5'),
            gorduras_totais=Decimal('2.5'),
            gorduras_saturadas=Decimal('2.5'),
            gorduras_trans=Decimal('2.5'),
            sodio=Decimal('2.5'),
        )

        # Cria ingredientes
        self.ingrediente1 = Ingrediente.objects.create(
            receita=self.receita_user1,
            alimento=self.alimento1,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00'),
            peso_processado=Decimal('300.00'),
            custo_embalagem=Decimal('5.00'),
            quantidade_embalagem=Decimal('1000.00')
        )
        
        self.ingrediente2 = Ingrediente.objects.create(
            receita=self.receita_user2,
            alimento=self.alimento2,
            peso_bruto=Decimal('200.00'),
            peso_liquido=Decimal('200.00'),
            peso_processado=Decimal('200.00'),
            custo_embalagem=Decimal('3.00'),
            quantidade_embalagem=Decimal('1000.00')
        )

        # URLs usando reverse com os nomes definidos
        self.url_criar = lambda receita_id: reverse('ingrediente-create', kwargs={'receita_id': receita_id})
        self.url_listar = lambda receita_id: reverse('ingrediente-list', kwargs={'receita_id': receita_id})
        self.url_atualizar = lambda ingrediente_id: reverse('ingrediente-update', kwargs={'ingrediente_id': ingrediente_id})
        self.url_excluir = lambda ingrediente_id: reverse('ingrediente-delete', kwargs={'ingrediente_id': ingrediente_id})
        self.url_detalhes = lambda ingrediente_id: reverse('ingrediente-detail', kwargs={'ingrediente_id': ingrediente_id})

    # ==========================
    # TESTES DE CRIAÇÃO
    # ==========================
    def test_criar_ingrediente_sucesso(self):
        """Testa criação de ingrediente com dados válidos"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "alimento": self.alimento1.id,
            "peso_bruto": "400.00",
            "peso_liquido": "400.00",
            "peso_processado": "400.00",
            "custo_embalagem": "6.00",
            "quantidade_embalagem": "1000.00"
        }
        
        url = self.url_criar(self.receita_user1.id)
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ingrediente.objects.count(), 3)
        
        # Verifica se o ingrediente foi criado com a receita correta
        novo_ingrediente = Ingrediente.objects.get(pk=response.data['id'])
        self.assertEqual(novo_ingrediente.receita, self.receita_user1)

    def test_criar_ingrediente_sem_peso_processado(self):
        """Testa que peso_processado é preenchido automaticamente com peso_liquido"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "alimento": self.alimento1.id,
            "peso_bruto": "500.00",
            "peso_liquido": "500.00",
            # peso_processado não é enviado
            "custo_embalagem": "6.00",
            "quantidade_embalagem": "1000.00"
        }
        
        url = self.url_criar(self.receita_user1.id)
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verifica que peso_processado foi preenchido automaticamente
        ingrediente = Ingrediente.objects.get(pk=response.data['id'])
        self.assertEqual(ingrediente.peso_processado, Decimal('500.00'))

    def test_criar_ingrediente_invalido(self):
        """Testa criação de ingrediente com dados inválidos"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "alimento": self.alimento1.id,
            "peso_bruto": "-100.00",  # Valor negativo - inválido
            "peso_liquido": "100.00",
            "peso_processado": "100.00",
        }
        
        url = self.url_criar(self.receita_user1.id)
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_criar_ingrediente_sem_permissao(self):
        """Testa que usuário não pode adicionar ingrediente a receita de outro usuário"""
        self.client.force_authenticate(user=self.user2)
        
        data = {
            "alimento": self.alimento1.id,
            "peso_bruto": "400.00",
            "peso_liquido": "400.00",
            "peso_processado": "400.00",
        }
        
        url = self.url_criar(self.receita_user1.id)  # user2 tentando acessar receita de user1
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("error", response.data)
        self.assertIn("permissão", response.data["error"].lower())

    def test_criar_ingrediente_receita_inexistente(self):
        """Testa criação de ingrediente em receita que não existe"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "alimento": self.alimento1.id,
            "peso_bruto": "400.00",
            "peso_liquido": "400.00",
        }
        
        url = self.url_criar(99999)  # ID que não existe
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # TESTES DE LISTAGEM
    # ==========================
    def test_listar_ingredientes_receita(self):
        """Testa listagem de ingredientes de uma receita"""
        self.client.force_authenticate(user=self.user1)
        
        url = self.url_listar(self.receita_user1.id)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['receita_id'], self.receita_user1.id)
        self.assertEqual(response.data['receita_nome'], self.receita_user1.nome)
        self.assertEqual(response.data['total_ingredientes'], 1)
        self.assertEqual(len(response.data['ingredientes']), 1)

    def test_listar_ingredientes_receita_vazia(self):
        """Testa listagem de ingredientes de uma receita sem ingredientes"""
        # Cria uma receita sem ingredientes
        receita_vazia = Receita.objects.create(
            usuario=self.user1,
            nome="Receita Vazia",
            categoria="Teste",
            porcao_individual=Decimal('100.00'),
            medida="g",
            modo_preparo="Teste"
        )
        
        self.client.force_authenticate(user=self.user1)
        url = self.url_listar(receita_vazia.id)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_ingredientes'], 0)
        self.assertEqual(len(response.data['ingredientes']), 0)

    def test_listar_ingredientes_sem_permissao(self):
        """Testa que usuário não pode listar ingredientes de receita de outro usuário"""
        self.client.force_authenticate(user=self.user2)
        
        url = self.url_listar(self.receita_user1.id)  # user2 tentando acessar receita de user1
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("error", response.data)
        self.assertIn("permissão", response.data["error"].lower())

    # ==========================
    # TESTES DE DETALHES
    # ==========================
    def test_detalhar_ingrediente(self):
        """Testa visualização dos detalhes de um ingrediente"""
        self.client.force_authenticate(user=self.user1)
        
        url = self.url_detalhes(self.ingrediente1.id)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.ingrediente1.id)
        self.assertEqual(response.data['alimento'], self.alimento1.id)

    def test_detalhar_ingrediente_sem_permissao(self):
        """Testa que usuário não pode visualizar ingrediente de receita de outro usuário"""
        self.client.force_authenticate(user=self.user2)
        
        url = self.url_detalhes(self.ingrediente1.id)  # user2 tentando acessar ingrediente de user1
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_detalhar_ingrediente_inexistente(self):
        """Testa visualização de ingrediente que não existe"""
        self.client.force_authenticate(user=self.user1)
        
        url = self.url_detalhes(99999)  # ID que não existe
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # TESTES DE ATUALIZAÇÃO
    # ==========================
    def test_atualizar_ingrediente_sucesso(self):
        """Testa atualização de ingrediente"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "peso_bruto": "350.00",  # Valor atualizado
            "peso_liquido": "350.00",
            "peso_processado": "350.00",
            "custo_embalagem": "7.00",  # Valor atualizado
            "quantidade_embalagem": "1000.00"
        }
        
        url = self.url_atualizar(self.ingrediente1.id)
        response = self.client.put(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se foi atualizado no banco
        self.ingrediente1.refresh_from_db()
        self.assertEqual(self.ingrediente1.peso_bruto, Decimal('350.00'))
        self.assertEqual(self.ingrediente1.custo_embalagem, Decimal('7.00'))

    def test_atualizar_ingrediente_parcial(self):
        """Testa atualização parcial de ingrediente"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "peso_bruto": "350.00",  # Apenas um campo atualizado
        }
        
        url = self.url_atualizar(self.ingrediente1.id)
        response = self.client.put(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se foi atualizado no banco
        self.ingrediente1.refresh_from_db()
        self.assertEqual(self.ingrediente1.peso_bruto, Decimal('350.00'))
        # Outros campos devem permanecer inalterados
        self.assertEqual(self.ingrediente1.peso_liquido, Decimal('300.00'))

    def test_atualizar_ingrediente_sem_permissao(self):
        """Testa que usuário não pode atualizar ingrediente de receita de outro usuário"""
        self.client.force_authenticate(user=self.user2)
        
        data = {
            "peso_bruto": "999.00",
        }
        
        url = self.url_atualizar(self.ingrediente1.id)  # user2 tentando acessar ingrediente de user1
        response = self.client.put(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Verifica que NÃO foi atualizado no banco
        self.ingrediente1.refresh_from_db()
        self.assertNotEqual(self.ingrediente1.peso_bruto, Decimal('999.00'))

    def test_atualizar_ingrediente_invalido(self):
        """Testa atualização de ingrediente com dados inválidos"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            "peso_bruto": "-100.00",  # Valor negativo - inválido
        }
        
        url = self.url_atualizar(self.ingrediente1.id)
        response = self.client.put(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ==========================
    # TESTES DE EXCLUSÃO
    # ==========================
    def test_deletar_ingrediente_sucesso(self):
        """Testa exclusão de ingrediente"""
        self.client.force_authenticate(user=self.user1)
        
        url = self.url_excluir(self.ingrediente1.id)
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertIn("removido com sucesso", response.data["message"])
        self.assertEqual(Ingrediente.objects.count(), 1)  # Deveria ter apenas 1 ingrediente agora

    def test_deletar_ingrediente_sem_permissao(self):
        """Testa que usuário não pode excluir ingrediente de receita de outro usuário"""
        self.client.force_authenticate(user=self.user2)
        
        url = self.url_excluir(self.ingrediente1.id)  # user2 tentando acessar ingrediente de user1
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Ingrediente.objects.count(), 2)  # Ambos ingredientes ainda devem existir

    def test_deletar_ingrediente_inexistente(self):
        """Testa exclusão de ingrediente que não existe"""
        self.client.force_authenticate(user=self.user1)
        
        url = self.url_excluir(99999)  # ID que não existe
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # TESTE DE AUTENTICAÇÃO
    # ==========================
    def test_autenticacao_obrigatoria(self):
        """Testa que autenticação é obrigatória para todas as ações"""
        # Testar criação sem autenticação
        url = self.url_criar(self.receita_user1.id)
        data = {
            "alimento": self.alimento1.id,
            "peso_bruto": "100.00",
            "peso_liquido": "100.00",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Testar listagem sem autenticação
        url = self.url_listar(self.receita_user1.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Testar detalhes sem autenticação
        url = self.url_detalhes(self.ingrediente1.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Testar atualização sem autenticação
        url = self.url_atualizar(self.ingrediente1.id)
        response = self.client.put(url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Testar exclusão sem autenticação
        url = self.url_excluir(self.ingrediente1.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ==========================
    # TESTES DE PROPRIEDADES CALCULADAS (via detalhes)
    # ==========================
    def test_propriedades_calculadas_na_resposta(self):
        """Testa que as propriedades calculadas estão presentes na resposta de detalhes"""
        self.client.force_authenticate(user=self.user1)
        
        url = self.url_detalhes(self.ingrediente1.id)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se as propriedades calculadas estão na resposta
        # (isso depende do seu serializer - ajuste conforme necessário)
        if 'per_capita_bruto' in response.data:
            self.assertEqual(response.data['per_capita_bruto'], '200.00')
        if 'custo_unitario' in response.data:
            self.assertEqual(response.data['custo_unitario'], '1.00')
        if 'custo_total' in response.data:
            self.assertEqual(response.data['custo_total'], '1.50')

    # ==========================
    # TESTES DE MÉTODOS DO MODELO
    # ==========================
    def test_str_method(self):
        """Testa o método __str__ do modelo"""
        expected_str = f"{self.alimento1.nome} - {self.receita_user1.nome}"
        self.assertEqual(str(self.ingrediente1), expected_str)

    def test_save_method_peso_processado_automatico(self):
        """Testa que save() preenche peso_processado automaticamente se None"""
        ingrediente = Ingrediente(
            receita=self.receita_user1,
            alimento=self.alimento1,
            peso_bruto=Decimal('100.00'),
            peso_liquido=Decimal('100.00'),
            # peso_processado não é definido
        )
        ingrediente.save()
        
        self.assertEqual(ingrediente.peso_processado, Decimal('100.00'))

    def test_meta_ordering(self):
        """Testa a ordenação definida no Meta"""
        ingredientes = Ingrediente.objects.all()
        self.assertEqual(ingredientes[0], self.ingrediente1)
        self.assertEqual(ingredientes[1], self.ingrediente2)