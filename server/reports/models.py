from django.db import models

class StudentProgress(models.Model):
    name = models.CharField(max_length=100)
    math_progress = models.FloatField()
    science_progress = models.FloatField()
    assignment_completion = models.FloatField()
    attendance_rate = models.FloatField()
    engagement_score = models.FloatField()
    quiz_average = models.FloatField()

    def __str__(self):
        return self.name
