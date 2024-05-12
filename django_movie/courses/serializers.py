from rest_framework import serializers
from .models import CustomUser, Course, Module, Lesson, StudentHomework, StudentProgress, ShopItem, StudentInventory, \
    Enrollment, Person


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class ModuleSerializer(serializers.ModelSerializer):
    lessons_count = serializers.IntegerField(required=False)
    class Meta:
        model = Module
        fields = ['id', 'module_name', 'lessons_count']


class ModuleTheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class StudentHomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentHomework
        fields = '__all__'


class StudentProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProgress
        fields = '__all__'


class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = '__all__'


class StudentInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInventory
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    course_id = serializers.IntegerField(source='course.id', read_only=True)

    class Meta:
        model = Enrollment
        fields = ('id', 'user_id', 'user', 'course_id', 'status')


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'