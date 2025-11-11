from django.urls import path
from api.views import ChangePasswordView

urlpatterns = [
    path('alterar-senha/', ChangePasswordView.as_view(), name='alterar-senha'),
]
