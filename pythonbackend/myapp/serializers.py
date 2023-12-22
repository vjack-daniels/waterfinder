from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Location, Review, WaterReliability

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id','location', 'content', 'rating', 'created_at']
        
class WaterReliabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterReliability
        fields = ['id', 'location', 'reliability']

class LocationSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    water_reliability = WaterReliabilitySerializer(read_only=True) 

    class Meta:
        model = Location
        fields = ['id', 'name', 'latitude', 'longitude', 'reviews', 'water_reliability']


