from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    get_csrf, signup, login_view, logout_view,
    NutricionistaViewSet, ClienteViewSet, ReceitaViewSet, IngredienteViewSet
)

router = DefaultRouter()
router.register(r'nutricionistas', NutricionistaViewSet, basename='nutricionista')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'receitas', ReceitaViewSet, basename='receita')
router.register(r'ingredientes', IngredienteViewSet, basename='ingrediente')

urlpatterns = [
    path('auth/csrf/', get_csrf),
    path('auth/signup/', signup),
    path('auth/login/', login_view),
    path('auth/logout/', logout_view),
    path('', include(router.urls)),
]