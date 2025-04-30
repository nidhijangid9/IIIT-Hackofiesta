# # admin.py
# from django.contrib import admin
# from .models import Question, QuizSession, QuestionAttempt

# @admin.register(Question)
# class QuestionAdmin(admin.ModelAdmin):
#     list_display = ('text', 'difficulty', 'correct_option', 'created_at')
#     list_filter = ('difficulty', 'created_at')
#     search_fields = ('text', 'correct_option')
#     fieldsets = (
#         (None, {
#             'fields': ('text', 'difficulty')
#         }),
#         ('Options', {
#             'fields': ('option1', 'option2', 'option3', 'option4', 'correct_option')
#         }),
#     )

#     def save_model(self, request, obj, form, change):
#         if obj.correct_option not in [obj.option1, obj.option2, obj.option3, obj.option4]:
#             raise ValueError("Correct option must match one of the provided options")
#         super().save_model(request, obj, form, change)

# @admin.register(QuizSession)
# class QuizSessionAdmin(admin.ModelAdmin):
#     list_display = ('id', 'questions_answered', 'current_score', 'current_streak', 'is_completed', 'created_at')
#     list_filter = ('is_completed', 'created_at')
#     readonly_fields = ('questions_answered', 'current_score', 'current_streak', 'created_at', 'updated_at')

# @admin.register(QuestionAttempt)
# class QuestionAttemptAdmin(admin.ModelAdmin):
#     list_display = ('quiz_session', 'question', 'is_correct', 'score_change', 'attempted_at')
#     list_filter = ('is_correct', 'attempted_at')
#     readonly_fields = ('attempted_at',)

# mcq/admin.py (or mcq_app/admin.py)
from django.contrib import admin
from .models import Question

# Register the Question model with the admin site
admin.site.register(Question)
