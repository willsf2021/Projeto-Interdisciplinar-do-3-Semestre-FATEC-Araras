from django.urls import path
from api.views import CheckSessionView, GetUserView, LogoutView, RefreshTokenView, UpdateUserView

urlpatterns = [
    path('check-session/', CheckSessionView.as_view(), name='me-check-session'),
    path('get-user/', GetUserView.as_view(), name='me-get-user'),
    path('logout/', LogoutView.as_view(), name='logout-user'),
    path('refresh/', RefreshTokenView.as_view(), name='token-refresh'),
    path('update-user/', UpdateUserView.as_view(), name='update-user'),
]
