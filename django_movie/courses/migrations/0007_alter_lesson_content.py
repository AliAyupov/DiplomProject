# Generated by Django 5.0.2 on 2024-02-22 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0006_alter_lesson_content_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='content',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
