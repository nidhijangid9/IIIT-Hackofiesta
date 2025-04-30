# from django.db import models
# from django.contrib.auth.models import User

# class Question(models.Model):
#     DIFFICULTY_LEVELS = [
#         ('easy', 'Easy'),
#         ('medium', 'Medium'),
#         ('hard', 'Hard')
#     ]

#     text = models.TextField()
#     difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS, default='easy')
#     option1 = models.CharField(max_length=255)
#     option2 = models.CharField(max_length=255)
#     option3 = models.CharField(max_length=255)
#     option4 = models.CharField(max_length=255)
#     correct_option = models.CharField(max_length=255)
#     created_at = models.DateTimeField(auto_now_add=True)  # Remove default

#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         return self.text[:50]

#     def check_answer(self, selected_option):
#         return selected_option == self.correct_option

# class QuizSession(models.Model):
#     questions = models.ManyToManyField(Question, through='QuestionAttempt')
#     questions_answered = models.IntegerField(default=0)
#     current_score = models.IntegerField(default=0)
#     current_streak = models.IntegerField(default=0)
#     is_completed = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)  # Remove default
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         return f"Quiz Session {self.id} - Score: {self.current_score}"

# class QuestionAttempt(models.Model):
#     quiz_session = models.ForeignKey(QuizSession, on_delete=models.CASCADE)
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)
#     selected_option = models.CharField(max_length=255, null=True, blank=True)
#     is_correct = models.BooleanField(null=True)
#     score_change = models.IntegerField(default=0)
#     attempted_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['attempted_at']
#         unique_together = ['quiz_session', 'question']

#     def __str__(self):
#         return f"Attempt for Question {self.question.id} in Session {self.quiz_session.id}"


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

    def __str__(self):
        return self.text