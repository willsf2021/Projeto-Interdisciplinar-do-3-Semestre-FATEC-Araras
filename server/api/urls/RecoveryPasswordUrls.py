from django.urls import path
from api.views import PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('solicitar-recuperacao/', PasswordResetRequestView.as_view(), name='solicitar-recuperacao'),
    path('redefinir-senha/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='redefinir-senha'),
]
