from .UsuarioUrls import urlpatterns as usuario_urls
from .AlimentoTacoUrls import urlpatterns as alimento_taco_urls
from .GoogleAuthUrls import urlpatterns as google_auth_urls
from .ReceitaUrls import urlpatterns as receita_urls
from .IngredienteUrls import urlpatterns as ingrediente_urls
from .PDFTemplateUrls import urlpatterns as pdf_template_urls

urlpatterns = usuario_urls + alimento_taco_urls + google_auth_urls + receita_urls + ingrediente_urls + pdf_template_urls