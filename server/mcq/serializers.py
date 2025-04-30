# serializers.py
from rest_framework import serializers
from mcq.models import Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'difficulty', 'option1', 'option2', 'option3', 'option4']
        # Note: We exclude correct_option to not expose it to frontend directly

class AnswerResponseSerializer(serializers.Serializer):
    is_correct = serializers.BooleanField()
    correct_answer = serializers.CharField()
    score = serializers.IntegerField()
    difficulty = serializers.CharField()
    correct_streak = serializers.IntegerField()