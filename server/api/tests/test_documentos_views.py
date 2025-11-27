from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from decimal import Decimal

from api.models import Receita, AlimentoTaco, Ingrediente, Documento, Cliente

Usuario = get_user_model()


class BaseDocumentoTest(APITestCase):
    def setUp(self):
        self.user = Usuario.objects.create_user(
            email="lucas@teste.com",
            password="123456",
            name="Lucas Silva",
            type="estudante"
        )
        self.user2 = Usuario.objects.create_user(
            email="maria@teste.com",
            password="123456",
            name="Maria Oliveira",
            type="profissional"
        )

        self.client = APIClient()
        self.client.force_authenticate(self.user)

        self.cliente = Cliente.objects.create(
            usuario=self.user,
            nome_completo="Padaria do Zé",
            email="ze@padaria.com",
            celular="(11) 98765-4321"
        )

        self.receita = Receita.objects.create(
            usuario=self.user,
            nome="Bolo de Cenoura",
            categoria="Sobremesas",
            tempo_preparo_horas=0,
            tempo_preparo_minutos=50,
            porcao_individual=Decimal('120.00'),
            medida="g",
            modo_preparo="Misturar tudo e assar.",
            habilitar_rotulo_nutricional=True
        )

        self.alimento = AlimentoTaco.objects.create(
            codigo_taco="001",
            nome="Farinha de trigo",
            categoria="Cereais",
            valor_energetico=Decimal('364.00'),
            proteinas=Decimal('10.00'),
            carboidratos=Decimal('76.00'),
            acucares_totais=Decimal('1.00'),
            acucares_adicionados=Decimal('0.00'),
            gorduras_totais=Decimal('1.00'),
            gorduras_saturadas=Decimal('0.20'),
            gorduras_trans=Decimal('0.00'),
            fibra_alimentar=Decimal('2.70'),
            sodio=Decimal('2.00')
        )
        Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=Decimal('300.00'),
            peso_liquido=Decimal('300.00')
        )


# LISTAGEM
class TestDocumentoListView(BaseDocumentoTest):
    def test_list_documentos(self):
        Documento.objects.create(usuario=self.user, receita=self.receita, formato_documento="completo")
        Documento.objects.create(usuario=self.user, receita=self.receita, formato_documento="rotulo_apenas")

        response = self.client.get("/api/listar-documentos/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_documentos_filtrando(self):
        receita2 = Receita.objects.create(
            usuario=self.user,
            nome="Brigadeiro Gourmet",
            categoria="Doces",
            tempo_preparo_horas=0,
            tempo_preparo_minutos=20,
            porcao_individual=Decimal('25.00'),
            medida="g",
            modo_preparo="Misturar e enrolar."
        )

        Documento.objects.create(usuario=self.user, receita=self.receita, formato_documento="completo")
        Documento.objects.create(usuario=self.user, receita=receita2, formato_documento="rotulo_apenas")

        # Filtro por nome da receita → graças ao campo 'receita_nome' no serializer!
        response = self.client.get("/api/listar-documentos/?search=brigadeiro")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        # Agora verificamos pelo campo que o serializer retorna: 'receita_nome'
        self.assertIn("Brigadeiro", response.data[0]['receita_nome'])


# CRIAÇÃO
class TestDocumentoCreateView(BaseDocumentoTest):
    def test_criar_documento_sucesso(self):
        payload = {
            "receita": self.receita.id,
            "formato_documento": "completo",
            "cliente": self.cliente.id
        }
        response = self.client.post("/api/documentos/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_criar_documento_invalido(self):
        payload = {
            "receita": self.receita.id,
            "formato_documento": "formato_invalido_123"
        }
        response = self.client.post("/api/documentos/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# PDF DO DOCUMENTO
class TestDocumentoPdfView(BaseDocumentoTest):
    def setUp(self):
        super().setUp()
        self.doc = Documento.objects.create(
            usuario=self.user,
            receita=self.receita,
            formato_documento="completo",
            pdf_gerado=True
        )

    def test_pdf_documento_gerado_sucesso(self):
        response = self.client.get(f"/api/documentos/{self.doc.id}/pdf/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("pdf", response.headers["Content-Type"].lower())

    def test_pdf_documento_outro_usuario_forbidden(self):
        doc2 = Documento.objects.create(
            usuario=self.user2,
            receita=self.receita,
            formato_documento="completo",
            pdf_gerado=True
        )
        response = self.client.get(f"/api/documentos/{doc2.id}/pdf/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# RÓTULO PDF
class TestRotuloPdfView(BaseDocumentoTest):
    def test_rotulo_pdf_gerado_sucesso(self):
        doc = Documento.objects.create(
            usuario=self.user,
            receita=self.receita,
            formato_documento="rotulo_apenas",
            pdf_gerado=True
        )
        self.receita.habilitar_rotulo_nutricional = True
        self.receita.save()

        response = self.client.get(f"/api/rotulos/{doc.id}/pdf/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("pdf", response.headers["Content-Type"].lower())

    def test_rotulo_nao_habilitado(self):
        doc = Documento.objects.create(
            usuario=self.user,
            receita=self.receita,
            formato_documento="rotulo_apenas"
        )
        self.receita.habilitar_rotulo_nutricional = False
        self.receita.save()

        response = self.client.get(f"/api/rotulos/{doc.id}/pdf/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rotulo_outro_usuario_forbidden(self):
        doc2 = Documento.objects.create(
            usuario=self.user2,
            receita=self.receita,
            formato_documento="rotulo_apenas",
            pdf_gerado=True
        )
        response = self.client.get(f"/api/rotulos/{doc2.id}/pdf/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)