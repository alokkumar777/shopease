from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order, OrderItem
from products.models import Product
from .serializers import CartSerializer, OrderSerializer
from rest_framework import generics

class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # logged-in user
        user = request.user 

        cart, created = Cart.objects.get_or_create(
            user = user,
            is_active = True
        )
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        cart, created = Cart.objects.get_or_create(
            user = request.user,
            is_active = True
        )

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

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    def delete(self, request):
        cart_item_id = request.data.get("cart_item_id")
        if not cart_item_id:
            return Response({"error": "cart_item_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user, cart__is_active=True)
            cart_item.delete()
            return Response({"message": "Item removed from cart"}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in your cart"}, status=status.HTTP_404_NOT_FOUND)
    

class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            cart = Cart.objects.get(user=user, is_active=True)
        except Cart.DoesNotExist:
            return Response({"error": "No active cart found."}, status=status.HTTP_404_NOT_FOUND)
        
        cart_items = cart.items.all() # Uses the related_name='items'
        if not cart_items.exists():
            return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)
        
        total_price = sum(item.product.price * item.quantity for item in cart_items)
        
        order = Order.objects.create(
            user=user,
            total_price=total_price,
            status='pending'
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price_at_purchase=item.product.price # Capturing current price
            )

        cart.is_active = False
        cart.save()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id,
            "total_price": total_price
        }, status=status.HTTP_201_CREATED)
    
class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    