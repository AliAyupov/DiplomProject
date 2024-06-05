"""
URL configuration for django_movie project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, TokenVerifyView,
)
from courses.views import CustomUserDetailView, CourseApiView, ModuleApiView, LessonApiView,  \
    StudentHomeworkApiView, StudentProgressApiView, ShopItemApiView, StudentInventoryApiView, EnrollmentApiView, ModuleCourseApiView, \
    CourseCreaterApiView, StudentOnTheCourseApiView, AllUsersOnTheCourseApiView, AllHomeworkOnTheCourseApiView, BlacklistRefreshView, \
    CourseTeacherApiView, ModuleCreateAPIView, LessonViewSet, PersonViewSet, CustomUserListView, AddTutorToCourseView, StudentProgressByStudentApiView


from courses.views import FileUploadView

router = routers.DefaultRouter()
router.register(r'api/persons', PersonViewSet)
router.register(r'api/courses', CourseApiView)
router.register(r'api/student-homeworks', StudentHomeworkApiView)
router.register(r'api/student-progress', StudentProgressApiView)
router.register(r'api/shop-items', ShopItemApiView)
router.register(r'api/student-inventory', StudentInventoryApiView)
router.register(r'api/enrollment', EnrollmentApiView, basename='enrollment')
router.register(r'api/user-courses', CourseCreaterApiView, basename='user-courses')
router.register(r'api/tutor', CourseTeacherApiView, basename='tutor')
router.register(r'api/progress', StudentOnTheCourseApiView, basename='progress')
router.register(r'api/module-course', ModuleCourseApiView, basename='module-coursea')
router.register(r'api/users-course', AllUsersOnTheCourseApiView, basename='users-course')
router.register(r'api/homework-course', AllHomeworkOnTheCourseApiView, basename='homework-course')
router.register(r'api/modules', ModuleApiView, basename='module')
router.register(r'api/lessons', LessonViewSet, basename='lesson')
router.register(r'api/student-progress-by-student', StudentProgressByStudentApiView, basename='student-progress-by-student')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload-file/', FileUploadView.as_view(), name='upload_file'),
    path('api/users/', CustomUserListView.as_view(), name='user-list'),
    path('api/courses/<int:course_id>/add-tutor/', AddTutorToCourseView.as_view(), name='add-tutor-to-course'),
    path('api/courses/<int:course_id>/remove-teacher/<int:teacher_id>/', CourseTeacherApiView.as_view({'delete': 'remove_teacher'}), name='remove_teacher_from_course'),
    path('api/modules/as', ModuleCreateAPIView.as_view(), name='module-create'),
    path('api/modules/as/<int:module_id>/', ModuleCreateAPIView.as_view(), name='module-update'),
    path('api/custom-users/<int:user_id>/', CustomUserDetailView.as_view()),
    path('api/modules/<int:module_id>/lessons/', LessonApiView.as_view({'get': 'list'}), name='module-lessons'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/courses/search/', CourseApiView.as_view({'get': 'search_courses'}), name='search_courses'),
    path('', include(router.urls)),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/logout/blacklist/', BlacklistRefreshView.as_view(), name="blacklist"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
"""
URL configuration for django_movie project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, TokenVerifyView,
)
from courses.views import CustomUserDetailView, CourseApiView, ModuleApiView, LessonApiView,  \
    StudentHomeworkApiView, StudentProgressApiView, ShopItemApiView, StudentInventoryApiView, EnrollmentApiView, ModuleCourseApiView, \
    CourseCreaterApiView, StudentOnTheCourseApiView, AllUsersOnTheCourseApiView, AllHomeworkOnTheCourseApiView, BlacklistRefreshView, \
    CourseTeacherApiView, ModuleCreateAPIView, LessonViewSet, PersonViewSet, CustomUserListView, AddTutorToCourseView, StudentProgressByStudentApiView


from courses.views import FileUploadView

router = routers.DefaultRouter()
router.register(r'api/persons', PersonViewSet)
router.register(r'api/courses', CourseApiView)
router.register(r'api/student-homeworks', StudentHomeworkApiView)
router.register(r'api/student-progress', StudentProgressApiView)
router.register(r'api/shop-items', ShopItemApiView)
router.register(r'api/student-inventory', StudentInventoryApiView)
router.register(r'api/enrollment', EnrollmentApiView, basename='enrollment')
router.register(r'api/user-courses', CourseCreaterApiView, basename='user-courses')
router.register(r'api/tutor', CourseTeacherApiView, basename='tutor')
router.register(r'api/progress', StudentOnTheCourseApiView, basename='progress')
router.register(r'api/module-course', ModuleCourseApiView, basename='module-coursea')
router.register(r'api/users-course', AllUsersOnTheCourseApiView, basename='users-course')
router.register(r'api/homework-course', AllHomeworkOnTheCourseApiView, basename='homework-course')
router.register(r'api/modules', ModuleApiView, basename='module')
router.register(r'api/lessons', LessonViewSet, basename='lesson')
router.register(r'api/student-progress-by-student', StudentProgressByStudentApiView, basename='student-progress-by-student')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload-file/', FileUploadView.as_view(), name='upload_file'),
    path('api/users/', CustomUserListView.as_view(), name='user-list'),
    path('api/courses/<int:course_id>/add-tutor/', AddTutorToCourseView.as_view(), name='add-tutor-to-course'),
    path('api/courses/<int:course_id>/remove-teacher/<int:teacher_id>/', CourseTeacherApiView.as_view({'delete': 'remove_teacher'}), name='remove_teacher_from_course'),
    path('api/modules/as', ModuleCreateAPIView.as_view(), name='module-create'),
    path('api/modules/as/<int:module_id>/', ModuleCreateAPIView.as_view(), name='module-update'),
    path('api/custom-users/<int:user_id>/', CustomUserDetailView.as_view()),
    path('api/modules/<int:module_id>/lessons/', LessonApiView.as_view({'get': 'list'}), name='module-lessons'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/courses/search/', CourseApiView.as_view({'get': 'search_courses'}), name='search_courses'),
    path('', include(router.urls)),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/logout/blacklist/', BlacklistRefreshView.as_view(), name="blacklist"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
