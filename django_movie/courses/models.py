from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    role = models.CharField(max_length=50)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    level = models.IntegerField(default=1)
    experience = models.IntegerField(default=0)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set',
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set',
        related_query_name='user',
    )

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class Course(models.Model):
    course_name = models.CharField(max_length=255)
    description = models.TextField()
    teacher_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses_taught')
    creator_id = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.CASCADE, related_name='courses_creator')

    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"


class Module(models.Model):
    module_name = models.CharField(max_length=255)
    description = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')

    class Meta:
        verbose_name = "Модуль"
        verbose_name_plural = "Модули"


class Lesson(models.Model):
    lesson_name = models.CharField(max_length=255)
    description = models.TextField()
    content = models.FileField(upload_to='lesson_files/')
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')

    class Meta:
        verbose_name = "Урок"
        verbose_name_plural = "Уроки"


class StudentHomework(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='homework')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='homework_submissions')
    submission_date = models.DateTimeField(auto_now_add=True)
    homework_content = models.JSONField()
    submission_status = models.CharField(max_length=50)
    grade = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Домашнее задание"
        verbose_name_plural = "Домашние задания"


class StudentProgress(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    completed_lessons = models.IntegerField(default=0)
    completion_time = models.DurationField(null=True, blank=True)

    class Meta:
        verbose_name = "Прогресс студента"
        verbose_name_plural = "Прогресс студентов"


class ShopItem(models.Model):
    name = models.CharField(max_length=255)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    class Meta:
        verbose_name = "Вещь в магазине"
        verbose_name_plural = "Вещи в магазине"


class StudentInventory(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='inventory')
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Инвентарь студента"
        verbose_name_plural = "Инвентари студентов"
