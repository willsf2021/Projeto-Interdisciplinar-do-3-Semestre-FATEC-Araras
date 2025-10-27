from .UsuarioUrls import urlpatterns as usuario_urls
from .AlimentoTacoUrls import urlpatterns as alimento_taco_urls
from .GoogleAuthUrls import urlpatterns as google_auth_urls

urlpatterns = usuario_urls + alimento_taco_urls + google_auth_urls