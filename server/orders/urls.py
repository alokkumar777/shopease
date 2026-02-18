from django.urls import path
from .views import CartAPIView, CheckoutAPIView, OrderListAPIView

urlpatterns = [
    path("", OrderListAPIView.as_view()),
    path("cart/", CartAPIView.as_view()),
    path("checkout/", CheckoutAPIView.as_view())
]
