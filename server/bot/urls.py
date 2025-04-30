from django.urls import path
from .views import FileProcessView, QuestionAnswerView

urlpatterns = [
    path('process-file/', FileProcessView.as_view(), name='process-file'),
    path('ask-question/', QuestionAnswerView.as_view(), name='ask-question'),
]