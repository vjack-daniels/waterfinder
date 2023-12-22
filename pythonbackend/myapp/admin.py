from django.contrib import admin
from .models import Location, Review, WaterReliability

# Define the admin class for the Review model
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('location', 'content', 'rating', 'created_at')  # Customize the list display columns
    list_filter = ('rating', 'created_at')  # Add a filter sidebar
    search_fields = ('content',)  # Add search capability

# Define the admin class for the WaterReliability model
class WaterReliabilityAdmin(admin.ModelAdmin):
    list_display = ('location', 'reliability')  # Customize the list display columns
    list_filter = ('reliability',)  # Add a filter sidebar

# You can also customize the LocationAdmin if needed, like so:
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude')  # Customize the list display columns
    search_fields = ('name',)  # Add search capability

# Register your models here.
admin.site.register(Location, LocationAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(WaterReliability, WaterReliabilityAdmin)
