from rest_framework import serializers
from .models import Question,QuizResult

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'text', 'difficulty', 
            'option1', 'option2', 'option3', 'option4', 
            'correct_option'
        ]

class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = [
            'id', 'score', 'total_questions', 
            'easy_questions_answered', 'medium_questions_answered', 'hard_questions_answered',
            'time_taken_seconds', 'completed_at'
        ]