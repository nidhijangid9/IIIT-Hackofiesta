# from django.urls import path
# from .views import QuestionGeneratorView, QuestionListView

# urlpatterns = [
#     # Endpoint to generate a new question
#     path('generate-question/', QuestionGeneratorView.as_view(), name='generate-question'),
    
#     # Endpoint to list questions by difficulty
#     path('questions/', QuestionListView.as_view(), name='question-list'),
    
#     # Optional: Additional endpoints for more specific querying
#     path('questions/<str:difficulty>/', QuestionListView.as_view(), name='questions-by-difficulty'),
# ]

# If you want to include these in the main project urls.py, you would do:
# from django.urls import path, include
# 
# urlpatterns = [
#     path('api/mcq/', include('mcq.urls')),
# ]



from django.urls import path
from .views import DynamicQuestionGeneratorView, QuizProgressView
from . import views

urlpatterns = [
    path('generate-question/', 
         DynamicQuestionGeneratorView.as_view(), 
         name='dynamic-question-generator'),
    
    path('quiz-progress/', 
         QuizProgressView.as_view(), 
         name='quiz-progress-tracker'),
     path('submit-quiz-result/', views.submit_quiz_result, name='submit-quiz-result'),
]
