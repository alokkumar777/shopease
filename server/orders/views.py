from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer

class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # logged-in user
        user = request.user 

        cart, created = Cart.objects.get_or_create(
            user = user,
            is_active = True
        )
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    def post(self, request):
        cart, created = Cart.objects.get_or_create(user = request.user)

        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        product = Product.objects.get(id=product_id)
        cart_item, created = CartItem.objects.get_or_create(
            cart = cart,
            product = product
        )

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    