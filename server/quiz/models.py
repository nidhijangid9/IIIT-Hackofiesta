from django.db import models

class Question(models.Model):
    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    ]

    text = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS)
    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)
    option4 = models.CharField(max_length=255)
    correct_option = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.difficulty.capitalize()} - {self.text[:50]}"
    
# class QuizResult(models.Model):
#     # Can be null if you don't require user authentication
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE, null=True, blank=True) 
#     score = models.IntegerField()
#     total_questions = models.IntegerField()
#     easy_questions_answered = models.IntegerField(default=0)
#     medium_questions_answered = models.IntegerField(default=0)
#     hard_questions_answered = models.IntegerField(default=0)
#     time_taken_seconds = models.IntegerField()
#     completed_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Quiz Result - Score: {self.score}/{self.total_questions} ({self.completed_at})"
from django.conf import settings
class QuizResult(models.Model):
    # Reference the custom user model
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField()
    total_questions = 5
    easy_questions_answered = models.IntegerField(default=0)
    medium_questions_answered = models.IntegerField(default=0)
    hard_questions_answered = models.IntegerField(default=0)
    time_taken_seconds = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quiz Result - Score: {self.score}/{self.total_questions} ({self.completed_at})"