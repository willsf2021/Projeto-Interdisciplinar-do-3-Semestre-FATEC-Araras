## Testes

### Rodar testes de um model específico

Para testar apenas um model específico, use o caminho completo do arquivo de teste e a classe de teste:

```bash
python manage.py test api.tests.test_usuario_model.UsuarioIntegrationTest
```

> **Dica:** cada model deve ter seu próprio arquivo de teste, seguindo o padrão:
> `test_nome_model_model.py`

### Rodar todos os testes com verbose

```bash
python manage.py test -v 2
```

* `-v 2` mostra detalhes de cada teste rodado.

### Cobertura de testes

Para gerar um relatório de cobertura:

```bash
coverage run manage.py test
coverage report
```

Isso mostrará quais partes do código foram cobertas pelos testes.

---

## Importação de dados

Para popular a tabela `taco` com os dados do arquivo JSON, use o comando:

```bash
python manage.py import_taco_json api/management/commands/taco.json
```

* Este comando lê o arquivo `taco.json` e insere os dados diretamente no banco de dados.
* Certifique-se de que o banco esteja configurado corretamente no arquivo `.mnd` antes de executar o comando.
