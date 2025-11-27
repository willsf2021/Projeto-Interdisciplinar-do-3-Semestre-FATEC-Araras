from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from api.models import Cliente

User = get_user_model()


class ClienteViewsTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Cria usuário
        self.user = User.objects.create_user(
            email="user@example.com",
            password="123456",
            name="Usuario Teste"
        )

        # Autentica sem JWT, usando force_authenticate
        self.client.force_authenticate(user=self.user)

        # Cria um cliente para os testes
        self.cliente = Cliente.objects.create(
            usuario=self.user,
            nome_completo="João da Silva",
            email="joao@example.com",
            celular="11999999999"
        )

    # ------------------------------------------------------
    # LIST VIEW
    # ------------------------------------------------------

    def test_cliente_list(self):
        url = reverse("clientes-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["nome_completo"], "João da Silva")

    def test_cliente_list_search(self):
        Cliente.objects.create(
            usuario=self.user,
            nome_completo="Maria Fernanda",
            email="maria@example.com",
            celular="11888888888"
        )

        url = reverse("clientes-list") + "?search=Maria"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["nome_completo"], "Maria Fernanda")

    def test_cliente_list_limit_results(self):
        for i in range(15):
            Cliente.objects.create(
                usuario=self.user,
                nome_completo=f"Cliente {i}",
                email=f"{i}@example.com",
                celular="1100000000"
            )

        url = reverse("clientes-list")
        response = self.client.get(url)

        self.assertEqual(len(response.data), 10)

    # ------------------------------------------------------
    # CREATE VIEW
    # ------------------------------------------------------

    def test_cliente_create(self):
        url = reverse("clientes-create")
        data = {
            "nome_completo": "Novo Cliente",
            "email": "novo@example.com",
            "celular": "11912345678"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Cliente.objects.filter(nome_completo="Novo Cliente", usuario=self.user).exists()
        )

    # ------------------------------------------------------
    # DETAIL VIEW
    # ------------------------------------------------------

    def test_cliente_detail(self):
        url = reverse("clientes-detail", args=[self.cliente.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nome_completo"], "João da Silva")

    # ------------------------------------------------------
    # UPDATE VIEW
    # ------------------------------------------------------

    def test_cliente_update(self):
        url = reverse("clientes-update", args=[self.cliente.id])
        data = {
            "nome_completo": "Cliente Atualizado",
            "email": "att@example.com",
            "celular": "11900001111"
        }

        response = self.client.put(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.cliente.refresh_from_db()
        self.assertEqual(self.cliente.nome_completo, "Cliente Atualizado")

    # ------------------------------------------------------
    # DELETE VIEW
    # ------------------------------------------------------

    def test_cliente_delete(self):
        url = reverse("clientes-delete", args=[self.cliente.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Cliente.objects.filter(id=self.cliente.id).exists())
