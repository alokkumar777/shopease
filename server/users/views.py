from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegisterSerializer

class TestAPIView(APIView):
    permission_classes = [IsAuthenticated]
    #? API to test our DRF setup
    def get(self, request, *args, **kwargs):
        data = {
            "message": "Success! API is working.",
            "status": "active"
        }
        return Response(data, status=status.HTTP_200_OK)
    

class RegisterAPIView(APIView):
    # handle user registration
    def post(self, request):
        # pass the JSON to the serializer
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            data = {"message": "User created successfully!"}
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
