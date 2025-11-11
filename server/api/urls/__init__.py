from .UsuarioUrls import urlpatterns as usuario_urls
from .AlimentoTacoUrls import urlpatterns as alimento_taco_urls
from .GoogleAuthUrls import urlpatterns as google_auth_urls
from .ReceitaUrls import urlpatterns as receita_urls
from .IngredienteUrls import urlpatterns as ingrediente_urls
from .DocumentoUrls import urlpatterns as documento_urls
from .RotuloNutricionalUrls import urlpatterns as rotulo_nutricional_urls
from .ClienteUrls import urlpatterns as cliente_urls
from .ChangePasswordUrls import urlpatterns as change_password_urls
from .RecoveryPasswordUrls import urlpatterns as recovery_password_urls
from .MeUrls import urlpatterns as me_urls

urlpatterns = usuario_urls + alimento_taco_urls + google_auth_urls + receita_urls + ingrediente_urls + documento_urls + rotulo_nutricional_urls + cliente_urls + change_password_urls + recovery_password_urls + me_urls