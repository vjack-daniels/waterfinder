# Generated by Django 4.2.6 on 2023-10-20 19:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_waterreliability_review'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='user',
        ),
    ]