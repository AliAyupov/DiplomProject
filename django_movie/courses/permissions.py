from rest_framework.permissions import BasePermission

class AllowAny(BasePermission):
    def has_permission(self, request, view):
        return True

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'student'


class IsTutor(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'tutor'


class IsProducer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'producer'

class IsProducerOrTutor(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['producer', 'tutor']