from django.db import models
from django.conf import settings

class Location(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class Review(models.Model):
    location = models.ForeignKey(
        Location,
        related_name='reviews', 
        on_delete=models.CASCADE, 
    )
    content = models.TextField()
    rating = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True) 
class WaterReliability(models.Model):
    location = models.OneToOneField(
        Location,
        related_name='water_reliability', 
        on_delete=models.CASCADE, 
    )
    reliability = models.FloatField() 

    def __str__(self):
        return f'Water Reliability for {self.location.name}'
