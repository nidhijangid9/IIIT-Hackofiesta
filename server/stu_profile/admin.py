from django.contrib import admin

# Register your models here.
from .models import StudentProfile, LectureResource

admin.site.register(StudentProfile)
admin.site.register(LectureResource)
