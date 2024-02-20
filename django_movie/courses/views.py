from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser, Course, Module, Lesson, StudentHomework, StudentProgress, ShopItem, StudentInventory
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly
from .serializers import CustomUserSerializer, CourseSerializer, ModuleSerializer, LessonSerializer, \
    StudentHomeworkSerializer, StudentProgressSerializer, ShopItemSerializer, StudentInventorySerializer


class CustomUserApiView(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]

class CourseApiView(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]

class ModuleApiView(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]

class LessonApiView(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]

class StudentHomeworkApiView(viewsets.ModelViewSet):
    queryset = StudentHomework.objects.all()
    serializer_class = StudentHomeworkSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]

class StudentProgressApiView(viewsets.ModelViewSet):
    queryset = StudentProgress.objects.all()
    serializer_class = StudentProgressSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAdminOrReadOnly]

class ShopItemApiView(viewsets.ModelViewSet):
    queryset = ShopItem.objects.all()
    serializer_class = ShopItemSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAdminOrReadOnly]

class StudentInventoryApiView(viewsets.ModelViewSet):
    queryset = StudentInventory.objects.all()
    serializer_class = StudentInventorySerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]