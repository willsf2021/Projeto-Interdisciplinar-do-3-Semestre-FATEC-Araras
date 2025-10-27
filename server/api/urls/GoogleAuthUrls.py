from django.urls import path
from api.views import google_auth  # importa a view

urlpatterns = [
    path('google-auth/', google_auth, name='google_auth'),
]
