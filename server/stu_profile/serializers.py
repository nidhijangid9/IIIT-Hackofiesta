# serializers.py
from rest_framework import serializers
from .models import StudentProfile,LectureResource

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['student_id']

class LectureResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LectureResource
        fields = '__all__'  
