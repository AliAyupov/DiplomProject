# Generated by Django 5.0.2 on 2024-02-22 10:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_alter_course_creator'),
    ]

    operations = [
        migrations.AddField(
            model_name='studenthomework',
            name='course',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='homework_course', to='courses.course'),
            preserve_default=False,
        ),
    ]
