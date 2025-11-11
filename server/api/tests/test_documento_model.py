from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from decimal import Decimal
from api.models import Documento, Receita, Cliente, Usuario
import os


class DocumentoModelTest(TestCase):
    """Testes para o model Documento"""
    
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
            porcao_individual=Decimal('100.00'),
            medida='g',
            modo_preparo='Misture tudo e asse'
        )
        
        self.cliente = Cliente.objects.create(
            usuario=self.usuario,
            nome_completo='João Silva',
            email='joao@example.com',
            celular='11999999999'
        )
        
        # Cria um arquivo PDF fake para testes
        self.pdf_file = SimpleUploadedFile(
            "documento_teste.pdf",
            b"PDF content here",
            content_type="application/pdf"
        )

    def tearDown(self):
        """Limpeza após os testes"""
        # Remove arquivos criados durante os testes
        for documento in Documento.objects.all():
            if documento.arquivo_pdf:
                if os.path.isfile(documento.arquivo_pdf.path):
                    os.remove(documento.arquivo_pdf.path)

    def test_criacao_documento_completo(self):
        """Testa criação de documento com todos os campos"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            cliente=self.cliente,
            declaracao_alergenicos='Contém glúten e leite',
            arquivo_pdf=self.pdf_file
        )
        
        self.assertEqual(documento.usuario, self.usuario)
        self.assertEqual(documento.receita, self.receita)
        self.assertEqual(documento.cliente, self.cliente)
        self.assertEqual(documento.declaracao_alergenicos, 'Contém glúten e leite')
        self.assertTrue(documento.arquivo_pdf)

    def test_criacao_documento_sem_cliente(self):
        """Testa criação de documento sem cliente (opcional)"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            declaracao_alergenicos='Contém glúten',
            arquivo_pdf=SimpleUploadedFile(
                "doc2.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.assertIsNone(documento.cliente)
        self.assertEqual(documento.receita, self.receita)

    def test_str_method_com_cliente(self):
        """Testa o método __str__ quando há cliente"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            cliente=self.cliente,
            arquivo_pdf=SimpleUploadedFile(
                "doc3.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        expected = f"Documento - {self.receita.nome} ({self.cliente.nome_completo})"
        self.assertEqual(str(documento), expected)

    def test_str_method_sem_cliente(self):
        """Testa o método __str__ quando não há cliente"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc4.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        expected = f"Documento - {self.receita.nome} (Sem cliente)"
        self.assertEqual(str(documento), expected)

    def test_declaracao_alergenicos_blank(self):
        """Testa que declaração de alérgenos pode ser vazia"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc5.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.assertEqual(documento.declaracao_alergenicos, '')

    def test_relacionamento_com_usuario(self):
        """Testa o relacionamento ForeignKey com Usuario"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc6.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.assertEqual(documento.usuario, self.usuario)
        self.assertIn(documento, self.usuario.documentos.all())

    def test_relacionamento_com_receita(self):
        """Testa o relacionamento ForeignKey com Receita"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc7.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.assertEqual(documento.receita, self.receita)
        self.assertIn(documento, self.receita.documentos.all())

    def test_relacionamento_com_cliente(self):
        """Testa o relacionamento ForeignKey com Cliente"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            cliente=self.cliente,
            arquivo_pdf=SimpleUploadedFile(
                "doc8.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.assertEqual(documento.cliente, self.cliente)
        self.assertIn(documento, self.cliente.documentos.all())

    def test_on_delete_cascade_usuario(self):
        """Testa se documento é deletado ao deletar usuário"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc9.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        documento_id = documento.id
        self.usuario.delete()
        
        with self.assertRaises(Documento.DoesNotExist):
            Documento.objects.get(id=documento_id)

    def test_on_delete_cascade_receita(self):
        """Testa se documento é deletado ao deletar receita"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc10.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        documento_id = documento.id
        self.receita.delete()
        
        with self.assertRaises(Documento.DoesNotExist):
            Documento.objects.get(id=documento_id)

    def test_on_delete_set_null_cliente(self):
        """Testa se cliente é setado como NULL ao deletar cliente"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            cliente=self.cliente,
            arquivo_pdf=SimpleUploadedFile(
                "doc11.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.cliente.delete()
        documento.refresh_from_db()
        
        self.assertIsNone(documento.cliente)

    def test_arquivo_pdf_upload_path(self):
        """Testa se o caminho de upload do PDF está correto"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc12.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        # Verifica se o caminho contém a estrutura documentos/YYYY/MM/
        self.assertIn('documentos/', documento.arquivo_pdf.name)

    def test_timestamps_created_at(self):
        """Testa se created_at é preenchido automaticamente"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc13.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.assertIsNotNone(documento.created_at)

    def test_timestamps_updated_at(self):
        """Testa se updated_at é atualizado automaticamente"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc14.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        created_time = documento.created_at
        
        # Atualiza o documento
        documento.declaracao_alergenicos = 'Atualizado'
        documento.save()
        documento.refresh_from_db()
        
        self.assertGreaterEqual(documento.updated_at, created_time)

    def test_ordering(self):
        """Testa se a ordenação está por -created_at"""
        documento1 = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc15.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        documento2 = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc16.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        documentos = Documento.objects.all()
        self.assertEqual(documentos[0], documento2)
        self.assertEqual(documentos[1], documento1)

    def test_verbose_names(self):
        """Testa os verbose names dos campos"""
        documento = Documento.objects.create(
            usuario=self.usuario,
            receita=self.receita,
            arquivo_pdf=SimpleUploadedFile(
                "doc17.pdf",
                b"PDF content",
                content_type="application/pdf"
            )
        )
        
        self.assertEqual(
            documento._meta.get_field('usuario').verbose_name,
            'Usuário'
        )
        self.assertEqual(
            documento._meta.get_field('receita').verbose_name,
            'Receita'
        )
        self.assertEqual(
            documento._meta.get_field('cliente').verbose_name,
            'Cliente'
        )
        self.assertEqual(
            documento._meta.get_field('declaracao_alergenicos').verbose_name,
            'Declaração de Alergênicos'
        )

    def test_meta_db_table(self):
        """Testa se o nome da tabela está correto"""
        self.assertEqual(Documento._meta.db_table, 'documentos')

    def test_meta_verbose_name(self):
        """Testa os verbose names do model"""
        self.assertEqual(Documento._meta.verbose_name, 'Documento')
        self.assertEqual(Documento._meta.verbose_name_plural, 'Documentos')