from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Avg
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .serializers import UserSerializer, LocationSerializer, ReviewSerializer, WaterReliabilitySerializer
from .models import Location, Review, WaterReliability

class RegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LocationListCreate(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

@method_decorator(csrf_exempt, name='dispatch')
class ReviewListCreate(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        location_id = self.request.data.get('location')
        location = get_object_or_404(Location, pk=location_id)
        serializer.save(location=location)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        serializer.save(user=self.request.user) 

class WaterReliabilityListCreate(generics.ListCreateAPIView):
    queryset = WaterReliability.objects.all()
    serializer_class = WaterReliabilitySerializer

class WaterReliabilityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = WaterReliability.objects.all()
    serializer_class = WaterReliabilitySerializer

@api_view(['GET'])
def get_water_reliability(request, location_id):
    location = get_object_or_404(Location, pk=location_id)
    water_reliability = location.water_reliability
    serializer = WaterReliabilitySerializer(water_reliability)
    return Response(serializer.data)

@api_view(['GET'])
def get_average_rating(request, location_id):
    location = get_object_or_404(Location, pk=location_id)
    result = Review.objects.filter(location=location).aggregate(average_rating=Avg('rating'))
    if result['average_rating'] is not None:
        average_rating = round(result['average_rating'], 2)
        return Response({'average_rating': average_rating})

def location_reviews(request, location_id):
    location = Location.objects.get(pk=location_id)
    reviews = location.reviews.all().values('rating', 'content')
    return JsonResponse(list(reviews), safe=False)