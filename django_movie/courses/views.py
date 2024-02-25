from django.db import IntegrityError
from rest_framework import viewsets, status, authentication
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CustomUser, Course, Module, Lesson, StudentHomework, StudentProgress, ShopItem, StudentInventory, \
    Enrollment
from .permissions import IsTutor, IsStudent, IsProducer, IsProducerOrTutor
from .serializers import CustomUserSerializer, CourseSerializer, ModuleSerializer, LessonSerializer, \
    StudentHomeworkSerializer, StudentProgressSerializer, ShopItemSerializer, StudentInventorySerializer, \
    EnrollmentSerializer


class CustomUserApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class CourseApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class ModuleApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class LessonApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class StudentHomeworkApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = StudentHomework.objects.all()
    serializer_class = StudentHomeworkSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class StudentProgressApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = StudentProgress.objects.all()
    serializer_class = StudentProgressSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class ShopItemApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = ShopItem.objects.all()
    serializer_class = ShopItemSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class StudentInventoryApiView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsProducer]
    queryset = StudentInventory.objects.all()
    serializer_class = StudentInventorySerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


class EnrollmentApiView(viewsets.ModelViewSet):
    permission_classes_by_action = {'create': [IsAuthenticated, IsStudent], 'get_queryset': [IsAuthenticated, IsProducer]}
    serializer_class = EnrollmentSerializer

    def get_queryset(self):

        user_id = self.request.user.id

        # Получаем id курса из параметров запроса
        course_id = self.request.query_params.get('course')

        # Проверяем, является ли пользователь создателем курса
        try:
            course = Course.objects.get(pk=course_id)
            if course.creator_id != user_id:
                return Response({'error': 'нет доступа'}, status=status.HTTP_403_FORBIDDEN)
        except Course.DoesNotExist:
            raise Response({'error': 'не существует'}, status=status.HTTP_404_NOT_FOUND)
        queryset = Enrollment.objects.filter(course=course)
        return queryset

    #
    def list(self, request):
        queryset = self.get_queryset()
        if not queryset.exists():
            raise NotFound("No data available")
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Запрос на обучение
    def create(self, request):
        # Получаем данные из запроса формата form-data
        user = request.data.get('user')
        course = request.data.get('course')

        # Проверяем, существует ли уже запись с такими значениями user и course
        enrollment_exists = Enrollment.objects.filter(user=user, course=course).exists()
        if enrollment_exists:
            return Response({'error': 'Пользователь уже на курсе'}, status=status.HTTP_400_BAD_REQUEST)
        enrollment_exists = Enrollment.objects.filter(user=user, course=course).exists()
        if enrollment_exists:
            return Response({'error': 'Запрос уже отправлен'}, status=status.HTTP_400_BAD_REQUEST)

        # Создаем запись
        serializer = EnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# по jwt токену отображение принадлежащих курсов
class CourseCreaterApiView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsProducerOrTutor]

    def list(self, request):
        user_id = request.user.id
        user_courses = Course.objects.filter(creator_id=user_id)
        serializer = CourseSerializer(user_courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk, creator=request.user)
            if course.creator != request.user:
                raise PermissionDenied()
        except Course.DoesNotExist:
            return Response({'error': 'Такого курса нет'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk, creator=request.user)
            if course.creator != request.user:
                raise PermissionDenied()
        except Course.DoesNotExist:
            return Response({'error': 'Такого курса нет'}, status=status.HTTP_404_NOT_FOUND)

        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk, creator=request.user)
        except Course.DoesNotExist:
            return Response({'error': 'Такого курса нет'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)


# по jwt токену отображение студентов принадлежащих определенному курсу http://127.0.0.1:8000/api/progress/?course_id=1
class StudentOnTheCourseApiView(viewsets.ViewSet):
    serializer_class = StudentProgressSerializer
    permission_classes = [IsAuthenticated, IsProducerOrTutor]

    def list(self, request):
        course_id = request.query_params.get('course_id')

        if not course_id:
            return Response({'error': 'Выберите нужный курс'}, status=status.HTTP_400_BAD_REQUEST)

        user_id = self.request.user.id

        # Проверяем, является ли пользователь создателем курса
        try:
            course = Course.objects.get(pk=course_id)
            if course.creator_id != user_id:
                return Response({'error': 'нет доступа'}, status=status.HTTP_403_FORBIDDEN)
        except Course.DoesNotExist:
            raise Response({'error': 'не существует'}, status=status.HTTP_404_NOT_FOUND)

        student_progress = StudentProgress.objects.filter(course_id=course_id)
        serializer = self.serializer_class(student_progress, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllUsersOnTheCourseApiView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsProducerOrTutor]

    def list(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({'error': 'Выберите нужный курс'}, status=status.HTTP_400_BAD_REQUEST)
        user_id = self.request.user.id
        try:
            course = Course.objects.get(pk=course_id)
            if course.creator_id != user_id:
                return Response({'error': 'нет доступа'}, status=status.HTTP_403_FORBIDDEN)
        except Course.DoesNotExist:
            return Response({'error': 'Курс не найден'}, status=status.HTTP_404_NOT_FOUND)

        student_progress = StudentProgress.objects.filter(course=course)

        students_data = []
        for progress in student_progress:
            student_data = {
                'student_name': f"{progress.student.first_name} {progress.student.last_name}",
                'student_username': progress.student.username,
                'student_email': progress.student.email,
                'student_role': progress.student.role,
                'student_balance': progress.student.balance,
                'student_level': progress.student.level,
            }
            students_data.append(student_data)

        return Response(students_data, status=status.HTTP_200_OK)


# вывод всех домашек относящихся к определенному курсу
class AllHomeworkOnTheCourseApiView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsProducerOrTutor]

    def list(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({'error': 'Курс не выбран'}, status=status.HTTP_400_BAD_REQUEST)
        user_id = self.request.user.id
        try:
            course = Course.objects.get(pk=course_id)
            if course.creator_id != user_id:
                return Response({'error': 'Нет доступа'}, status=status.HTTP_403_FORBIDDEN)
        except Course.DoesNotExist:
            return Response({'error': 'Курс не найден'}, status=status.HTTP_404_NOT_FOUND)

        student_homework = StudentHomework.objects.filter(course_id=course_id)

        serializer = StudentHomeworkSerializer(student_homework, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# отправление запроса на запись в курс
