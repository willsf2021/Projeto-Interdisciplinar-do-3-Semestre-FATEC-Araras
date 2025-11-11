Rotas:
 _________________________________________________________________
| Método | Endpoint               | Descrição                     |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/api/auth/csrf/`      | Retorna token CSRF            |
| POST   | `/api/auth/signup/`    | Cria usuário/nutricionista    |
| POST   | `/api/auth/login/`     | Faz login                     |
| POST   | `/api/auth/logout/`    | Faz logout                    |
| GET    | `/api/nutricionistas/` | Lista todos os nutricionistas |
| POST   | `/api/nutricionistas/` | Cria um nutricionista         |
| GET    | `/api/clientes/`       | Lista todos os clientes       |
| POST   | `/api/clientes/`       | Cria cliente                  |
| GET    | `/api/receitas/`       | Lista receitas                |
| POST   | `/api/receitas/`       | Cria receita                  |
| GET    | `/api/ingredientes/`   | Lista ingredientes            |
| POST   | `/api/ingredientes/`   | Cria ingrediente              |
|_________________________________________________________________|


# 📘 Endpoints da API

Este documento lista todos os endpoints disponíveis na API, suas respectivas **URLs**, **views** e **nomes de rota**.  
Cada endpoint representa uma funcionalidade específica dentro do sistema.

---

## 🧾 Endpoints Principais

| Método | URL | View | Nome |
|:-------|:----|:------|:------|
| `GET` | `/api/alimentos/` | `api.views.AlimentoTacoViews.AlimentoTacoView` | `alimentos-list` |
| `POST` | `/api/criar-receita/` | `api.views.ReceitaViews.ReceitaCreateView` | `receita-create` |
| `PUT/PATCH` | `/api/atualizar-receita/<int:receita_id>` | `api.views.ReceitaViews.ReceitaUpdateView` | `receita-update` |
| `DELETE` | `/api/excluir-receita/<int:receita_id>` | `api.views.ReceitaViews.ReceitaDeleteView` | `receita-delete` |
| `GET` | `/api/listar-receita/` | `api.views.ReceitaViews.ReceitaListView` | `receita-list` |

---

## 🥣 Endpoints de Ingredientes

| Método | URL | View | Nome |
|:-------|:----|:------|:------|
| `POST` | `/api/criar-ingrediente/<int:receita_id>/` | `api.views.IngredienteViews.IngredienteCreateView` | `ingrediente-create` |
| `GET` | `/api/detalhes-ingrediente/<int:ingrediente_id>/` | `api.views.IngredienteViews.IngredienteDetailView` | `ingrediente-detail` |
| `PUT/PATCH` | `/api/atualizar-ingrediente/<int:ingrediente_id>/` | `api.views.IngredienteViews.IngredienteUpdateView` | `ingrediente-update` |
| `DELETE` | `/api/excluir-ingrediente/<int:ingrediente_id>/` | `api.views.IngredienteViews.IngredienteDeleteView` | `ingrediente-delete` |
| `GET` | `/api/listar-ingredientes/<int:receita_id>/` | `api.views.IngredienteViews.IngredienteListByReceitaView` | `ingrediente-list` |

---

## 👤 Autenticação e Usuários

| Método | URL | View | Nome |
|:-------|:----|:------|:------|
| `POST` | `/api/registro/` | `api.views.UsuarioViews.RegistroView` | `usuario-registro` |
| `POST` | `/api/login/` | `api.views.UsuarioViews.LoginView` | `usuario-login` |
| `POST` | `/api/google-auth/` | `api.views.GoogleAuthViews.google_auth` | `google_auth` |

---

## ⚙️ Administração (Django Admin)

| Método | URL | View | Nome |
|:-------|:----|:------|:------|
| `GET` | `/admin/r/<path:content_type_id>/<path:object_id>/` | `django.contrib.contenttypes.views.shortcut` | `admin:view_on_site` |

---

## 📂 Observações
