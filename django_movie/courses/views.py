from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CustomUser, Course, Module, Lesson, StudentHomework, StudentProgress, ShopItem, StudentInventory, \
    Enrollment
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly
from .serializers import CustomUserSerializer, CourseSerializer, ModuleSerializer, LessonSerializer, \
    StudentHomeworkSerializer, StudentProgressSerializer, ShopItemSerializer, StudentInventorySerializer, \
    EnrollmentSerializer


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


class EnrollmentApiView(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]


# по jwt токену отображение принадлежащих курсов
class CourseCreaterApiView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user_id = request.user.id
        user_courses = Course.objects.filter(creator_id=user_id)
        serializer = CourseSerializer(user_courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
