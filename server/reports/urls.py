from django.urls import path
from .views import generate_pdf
from . import views


urlpatterns = [
    # path('students/', get_student_data, name='student-data'),
    path('download-progress-pdf/', generate_pdf, name='download_pdf'),
    path('api/send-report-email/', views.send_report_email, name='send_report_email'),
]
