# Generated by Django 5.1.6 on 2025-03-28 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_customuser_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='aadhar_card',
            field=models.CharField(blank=True, help_text="Stores the Cloudinary public ID for the user's Aadhaar card.", max_length=255, null=True),
        ),
    ]
