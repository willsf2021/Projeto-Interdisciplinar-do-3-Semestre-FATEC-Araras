from django.urls import path
from api.views.google_auth import GoogleAuthView

urlpatterns = [
    path("google-auth/", GoogleAuthView.as_view(), name="google-auth"),
]