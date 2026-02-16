from django.urls import path
from .views import TestAPIView, RegisterAPIView

urlpatterns = [
    path("test/", TestAPIView.as_view(), name="test"),
    path("register/", RegisterAPIView.as_view(), name="register"),
]
