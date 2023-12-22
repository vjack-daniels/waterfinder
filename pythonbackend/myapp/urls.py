from django.urls import path
from .views import (
    RegistrationAPIView,
    LocationListCreate,
    LocationDetail,
    ReviewListCreate,
    ReviewDetail,
    WaterReliabilityListCreate,
    WaterReliabilityDetail,
    get_water_reliability,
    get_average_rating, 
    location_reviews,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('locations/', LocationListCreate.as_view(), name='location-list'),
    path('locations/<int:pk>/', LocationDetail.as_view(), name='location-detail'),
    path('reviews/', ReviewListCreate.as_view(), name='review-list'),
    path('reviews/<int:pk>/', ReviewDetail.as_view(), name='review-detail'),
    path('water-reliability/', WaterReliabilityListCreate.as_view(), name='water-reliability-list'),
    path('water-reliability/<int:pk>/', WaterReliabilityDetail.as_view(), name='water-reliability-detail'),
    path('water-reliability/location/<int:location_id>/', get_water_reliability, name='get-water-reliability'),
    path('locations/<int:location_id>/average-rating/', get_average_rating, name='average-rating'),
    path('locations/<int:location_id>/reviews/', location_reviews, name='location-reviews'),
]

