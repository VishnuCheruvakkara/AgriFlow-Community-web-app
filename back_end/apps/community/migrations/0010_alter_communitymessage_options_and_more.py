# Generated by Django 5.1.6 on 2025-05-25 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0009_rename_message_communitymessage'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='communitymessage',
            options={'ordering': ['timestamp']},
        ),
        migrations.AddField(
            model_name='communitymessage',
            name='media_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
