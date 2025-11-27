## Testes

### Rodar testes de um model específico

Para testar apenas um model específico, use o caminho completo do arquivo de teste e a classe de teste:

```bash
python manage.py test api.tests.test_usuario_model.UsuarioIntegrationTest
# Ou use o Coverage
coverage run manage.py test api.tests.test_usuario_model.UsuarioIntegrationTest
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
# Rodar testes com cobertura
coverage run manage.py test
# Ou
# Rodar todos os testes e informar detalhes
python manage.py test --verbosity 2

# Gerar relatório de cobertura
coverage report -m

# Gerar relatório HTML
coverage html

# Ou rode os  comandos juntos
coverage run manage.py test && coverage report -m && coverage html

# Abrir relatório HTML no navegador
start htmlcov/index.html
```

Isso mostrará quais partes do código foram cobertas pelos testes.


```bash
python manage.py test --verbosity 2
```

---

## Importação de dados

Para popular a tabela `taco` com os dados do arquivo JSON, use o comando:

```bash
python manage.py import_taco_json api/management/commands/taco.json
```

* Este comando lê o arquivo `taco.json` e insere os dados diretamente no banco de dados.
* Certifique-se de que o banco esteja configurado corretamente no arquivo `.mnd` antes de executar o comando.

# visualizar as URLs da aplicação
pip install django-extensions

em apps do core:
    # extensão
    'django_extensions',

Ver todas as rotas:

```bash
python manage.py show_urls
```

- Criar ambiente virtual

```bash
python -m venv venv
```

- Ativar ambiente virtual do python

```bash
source venv/Scripts/Activate
```

- Executar servidor da api

```bash
python manage.py runserver 0.0.0.0:8000
```

- Executar servidor do front-end (Vite)
```bash
npm run dev -- --host
```