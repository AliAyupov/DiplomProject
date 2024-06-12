from rest_framework import serializers
from .models import CustomUser, Course, Module, Lesson, StudentHomework, StudentProgress, ShopItem, StudentInventory, \
    Enrollment, Person, FileModel, StudentAchievement


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    teacher = CustomUserSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = '__all__'


class ModuleSerializer(serializers.ModelSerializer):
    lessons_count = serializers.IntegerField(required=False)
    class Meta:
        model = Module
        fields = ['id', 'module_name', 'course_id', 'lessons_count']


class ModuleTheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class StudentHomeworkSerializer(serializers.ModelSerializer):
    course_info = serializers.SerializerMethodField()
    lesson_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()

    def get_course_info(self, obj):
        course = obj.course
        return CourseSerializer(course).data

    def get_lesson_info(self, obj):
        lesson = obj.lesson
        return LessonSerializer(lesson).data

    def get_student_info(self, obj):
        student = obj.student
        return CustomUserSerializer(student).data

    class Meta:
        model = StudentHomework
        fields = '__all__'


class StudentProgressSerializer(serializers.ModelSerializer):
    student = CustomUserSerializer()
    course = CourseSerializer()
    class Meta:
        model = StudentProgress
        fields = ['id', 'student', 'course', 'completed_lessons', 'completion_time']


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
    user_id = serializers.IntegerField
    course_id = serializers.IntegerField

    class Meta:
        model = Enrollment
        fields = ('id', 'user_id', 'user', 'course_id', 'status')


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'


class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileModel
        fields = '__all__'

class StudentAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAchievement
        fields = '__all__'