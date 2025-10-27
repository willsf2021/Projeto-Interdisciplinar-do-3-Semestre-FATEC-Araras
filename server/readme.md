Rotas necesárias para o funcionamento da API:
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
| POST   | `/api/rotulos/id`      | Cria rótulo                   |
| GET    | `/api/rotulos/`        | Lista rótulos                 |
|_________________________________________________________________|

Rotas em desenvolvimento:
 _________________________________________________________________
| Método | Endpoint               | Descrição                     |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/api/alimentos/`      | Lista todos os alimentos      |
| POST   | `/api/login/`          | Faz login                     |
| POST   | `/api/registro/`       | Registra novo usuário         |
| POST   | `/api/google-auth/`    | Faz login e regi. com Google  |
| GET    | ``                     |                               |
| POST   | ``                     |                               | 
| GET    | ``                     |                               |      
| POST   | ``                     |                               |
| GET    | ``                     |                               | 
| POST   | ``                     |                               | 
| GET    | ``                     |                               | 
| POST   | ``                     |                               | 
|_________________________________________________________________|