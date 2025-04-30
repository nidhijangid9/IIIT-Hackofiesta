# urls.py
# from django.urls import path
# from . import views

# app_name = 'mcq'

# urlpatterns = [
#     path('question/', views.get_question, name='get_question'),
#     path('submit-answer/', views.submit_answer, name='submit_answer'),
#     path('reset/', views.reset_quiz, name='reset_quiz'),
#     path('stats/', views.get_quiz_stats, name='quiz_stats'),
# ]

from django.urls import path
from .views import get_question, submit_answer

urlpatterns = [
    path('', get_question, name='get_question'),
    path('submit/', submit_answer, name='submit_answer'),
]



# from django.urls import path
# from . import views

# urlpatterns = [
#     path('get-question/', views.get_question, name='get_question'),
#     path('submit-answer/', views.submit_answer, name='submit_answer'),
#     path('reset-quiz/', views.reset_quiz, name='reset_quiz'),
# ]

