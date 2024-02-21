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
from courses.views import CustomUserApiView, CourseApiView, ModuleApiView, LessonApiView, \
    StudentHomeworkApiView, StudentProgressApiView, ShopItemApiView, StudentInventoryApiView, EnrollmentApiView, \
    CourseCreaterApiView

router = routers.DefaultRouter()
router.register(r'api/custom-users', CustomUserApiView)
router.register(r'api/courses', CourseApiView)
router.register(r'api/modules', ModuleApiView)
router.register(r'api/lessons', LessonApiView)
router.register(r'api/student-homeworks', StudentHomeworkApiView)
router.register(r'api/student-progress', StudentProgressApiView)
router.register(r'api/shop-items', ShopItemApiView)
router.register(r'api/student-inventory', StudentInventoryApiView)
router.register(r'api/enrollment', EnrollmentApiView)
router.register(r'api/user-courses', CourseCreaterApiView, basename='user-courses')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
