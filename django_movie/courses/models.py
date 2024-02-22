from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Студент'),
        ('tutor', 'Тьютор'),
        ('producer', 'Продюсер'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
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
    teacher = models.ManyToManyField(CustomUser, related_name='courses_taught')
    creator = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.CASCADE,
                                   related_name='courses_creator')

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
    content = models.JSONField(blank=True, null=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')

    class Meta:
        verbose_name = "Урок"
        verbose_name_plural = "Уроки"


class StudentHomework(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='homework_course')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='homework')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='homework_submissions')
    submission_date = models.DateTimeField(auto_now_add=True)
    homework_content = models.FileField(upload_to='homework_files/')
    submission_status = models.CharField(max_length=50)
    grade = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Домашнее задание"
        verbose_name_plural = "Домашние задания"


class StudentProgress(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    completed_lessons = models.IntegerField(default=0)
    completion_time = models.IntegerField(default=0)

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


class Enrollment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    STATUS_CHOICES = (
        ('pending', 'Ожидает подтверждения'),
        ('approved', 'Подтверждена'),
        ('rejected', 'Отклонена'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    date_enrolled = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Запрос на обучение"
        verbose_name_plural = "Запросы на обучение"
