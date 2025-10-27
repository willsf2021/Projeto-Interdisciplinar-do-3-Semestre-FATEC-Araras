 python manage.py test api.tests.teste_usuario_model.UsuarioIntegrationTest   

coverage report

coverage run manage.py test

 um arquivo de teste por model, test_nome_model_model

python manage.py test -v 2


outros comandos úteis:

# criar ambiente virtual
 python -m venv venv

# ativar o ambiente virtual
source venv/Scripts/Activate

# iniciar o servidor
python manage.py runserver

# criar migrações
python manage.py makemigrations

# aplicar migrações
python manage.py migrate

# visualizar as URLs da aplicação
pip install django-extensions

em apps do core:
    # extensão
    'django_extensions',

Ver todas as rotas:
python manage.py show_urls