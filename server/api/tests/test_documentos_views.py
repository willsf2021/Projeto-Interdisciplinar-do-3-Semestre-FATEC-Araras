from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

from api.models import Receita, Ingrediente, AlimentoTaco, Documento


User = get_user_model()


# ---------------------------------------------------------------------------
#  BASE CLASS
# ---------------------------------------------------------------------------
class BaseDocumentoTest(APITestCase):

    def setUp(self):
        # Usuários
        self.user = User.objects.create_user(
            username="user1",
            password="123456"
        )
        self.user2 = User.objects.create_user(
            username="user2",
            password="123456"
        )

        self.client = APIClient()
        self.client.force_authenticate(self.user)

        # Receita
        self.receita = Receita.objects.create(
            usuario=self.user,
            nome="Bolo de Chocolate",
            categoria="Doces",
            tempo_preparo_horas=0,
            tempo_preparo_minutos=30,
            porcao_individual=100,
            medida="g",
            modo_preparo="Misture tudo."
        )

        # Alimento TACO
        self.alimento = AlimentoTaco.objects.create(
            codigo_taco="A001",
            nome="Farinha de Trigo",
            categoria="Cereais",
            valor_energetico=100,
            proteinas=10,
            carboidratos=70,
            acucares_totais=1,
            acucares_adicionados=0,
            gorduras_totais=1,
            gorduras_saturadas=0,
            gorduras_trans=0,
            fibra_alimentar=2,
            sodio=5
        )

        # Ingrediente válido
        self.ingrediente = Ingrediente.objects.create(
            receita=self.receita,
            alimento=self.alimento,
            peso_bruto=100,
            peso_liquido=100,
        )


# ---------------------------------------------------------------------------
#  LISTAGEM DE DOCUMENTOS
# ---------------------------------------------------------------------------
class TestDocumentoListView(BaseDocumentoTest):

    def test_list_documentos(self):
        Documento.objects.create(usuario=self.user, receita=self.receita, nome="Doc 1")
        Documento.objects.create(usuario=self.user, receita=self.receita, nome="Doc 2")

        response = self.client.get("/api/documentos/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_documentos_filtrando(self):
        Documento.objects.create(usuario=self.user, receita=self.receita, nome="Relatório Final")
        Documento.objects.create(usuario=self.user, receita=self.receita, nome="Ficha Técnica")

        response = self.client.get("/api/documentos/?search=relatório")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


# ---------------------------------------------------------------------------
#  CRIAÇÃO DE DOCUMENTOS
# ---------------------------------------------------------------------------
class TestDocumentoCreateView(BaseDocumentoTest):

    def test_criar_documento_sucesso(self):
        payload = {
            "nome": "Novo Documento",
            "receita": self.receita.id
        }

        response = self.client.post("/api/documentos/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Documento.objects.count(), 1)

    def test_criar_documento_invalido(self):
        payload = {
            "nome": "",
            "receita": self.receita.id
        }

        response = self.client.post("/api/documentos/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
#  PDF DO DOCUMENTO
# ---------------------------------------------------------------------------
class TestDocumentoPdfView(BaseDocumentoTest):

    def setUp(self):
        super().setUp()
        self.doc = Documento.objects.create(
            usuario=self.user,
            receita=self.receita,
            nome="Doc PDF"
        )

    def test_pdf_documento_gerado_sucesso(self):
        response = self.client.get(f"/api/documentos/{self.doc.id}/pdf/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.headers["Content-Type"], "application/pdf")

    def test_pdf_documento_outro_usuario_forbidden(self):
        doc2 = Documento.objects.create(
            usuario=self.user2,
            receita=self.receita,
            nome="Doc OUTRO USER"
        )

        response = self.client.get(f"/api/documentos/{doc2.id}/pdf/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# ---------------------------------------------------------------------------
#  PDF DO RÓTULO NUTRICIONAL
# ---------------------------------------------------------------------------
class TestRotuloPdfView(BaseDocumentoTest):

    def setUp(self):
        super().setUp()
        self.receita.habilitar_rotulo_nutricional = True
        self.receita.save()

        self.doc = Documento.objects.create(
            usuario=self.user,
            receita=self.receita,
            nome="Rótulo PDF"
        )

    def test_rotulo_pdf_gerado_sucesso(self):
        response = self.client.get(f"/api/documentos/{self.doc.id}/rotulo/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.headers["Content-Type"], "application/pdf")

    def test_rotulo_nao_habilitado(self):
        self.receita.habilitar_rotulo_nutricional = False
        self.receita.save()

        response = self.client.get(f"/api/documentos/{self.doc.id}/rotulo/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rotulo_outro_usuario_forbidden(self):
        doc2 = Documento.objects.create(
            usuario=self.user2,
            receita=self.receita,
            nome="Outro Rótulo"
        )

        response = self.client.get(f"/api/documentos/{doc2.id}/rotulo/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)