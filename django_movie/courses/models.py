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
    picture = models.ImageField(upload_to='user_photo/', null=False, blank=True)
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
    email = models.EmailField(unique=True, blank=False)

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class Course(models.Model):
    course_name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    teacher = models.ManyToManyField(CustomUser, related_name='courses_taught', blank=True)
    creator = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.CASCADE,
                                related_name='courses_created')
    picture = models.ImageField(upload_to='course_files/', null=True, blank=True)
    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"


class Module(models.Model):
    module_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')

    class Meta:
        verbose_name = "Модуль"
        verbose_name_plural = "Модули"


class Lesson(models.Model):
    lesson_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
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
    description = models.TextField(null=True, blank=True)
    picture = models.ImageField(upload_to='shop_files/', null=True, blank=True)
    type = models.IntegerField(default=1)
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

    class StudentAchievement(models.Model):
        achievements_name = models.CharField(max_length=255)
        achievements_description = models.TextField()
        student_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='achievements')
        achievements_date = models.DateField()
        picture = models.ImageField(upload_to='achievement_pictures/', null=True, blank=True)

        class Meta:
            verbose_name = "Достижение студента"
            verbose_name_plural = "Достижения студентов"