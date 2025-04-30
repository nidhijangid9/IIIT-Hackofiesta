# models.py
# from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

User = get_user_model()


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    student_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], blank=True)
    standard=models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} - {self.student_id}"
    




def validate_file_size(value):
    filesize = value.size
    if filesize > 524288000:  # 500MB limit
        raise ValidationError("The maximum file size that can be uploaded is 500MB")
    return value

class LectureResource(models.Model):
    lecture_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    content_text = models.TextField()
    difficulty_level = models.CharField(max_length=20)
    topics = models.JSONField(default=list)

    # Video file
    lecture = models.FileField(
        upload_to='lecture_videos/',
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi']),
            validate_file_size
        ]
    )

    # Additional files (PDFs, docs, etc.)
    file1 = models.FileField(
        upload_to='lecture_resources/',
        null=True,
        blank=True
    )


    # Video metadata
    video_duration = models.DurationField(null=True, blank=True)
    video_thumbnail = models.ImageField(
        upload_to='video_thumbnails/',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lecture_id} - {self.title}"

    class Meta:
        ordering = ['-created_at']



