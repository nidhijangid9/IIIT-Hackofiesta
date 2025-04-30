from .views import CreateStudentProfileView,AuthenticatedSampleRecommendationView,get_logged_in_student_profile

from django.urls import path
# from .views import DynamicQuestionGeneratorView, QuizProgressView

urlpatterns = [
    path('create-profile/', CreateStudentProfileView.as_view(), name='create-profile'),
    path('get-profile/', get_logged_in_student_profile, name='get_student_profile'),
]
