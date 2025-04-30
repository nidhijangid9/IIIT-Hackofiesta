from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

def validate_file_size(value):
    filesize = value.size
    if filesize > 524288000:  # 500MB limit
        raise ValidationError("The maximum file size that can be uploaded is 500MB")
    return value

class Resource(models.Model):
    title = models.CharField(max_length=200)
    
    # For video files
    lecture = models.FileField(
        upload_to='lecture_videos/',
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi']),
            validate_file_size
        ]
    )
    
    # For other files (documents, etc.)
    file1 = models.FileField(
        upload_to='lecture_resources/',
        null=True,
        blank=True
    )
    
    # For other files (documents, etc.)
    file2 = models.FileField(
        upload_to='lecture_resources/',
        null=True,
        blank=True
    )
    
    video_duration = models.DurationField(null=True, blank=True)
    video_thumbnail = models.ImageField(
        upload_to='video_thumbnails/',
        null=True,
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']