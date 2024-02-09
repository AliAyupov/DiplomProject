from django.contrib import admin
from .models import CustomUser, Course, Module, Lesson, StudentHomework, StudentProgress, ShopItem, StudentInventory

admin.site.register(CustomUser)
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(StudentHomework)
admin.site.register(StudentProgress)
admin.site.register(ShopItem)
admin.site.register(StudentInventory)