# views.py
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import FileResponse
from .models import Resource
from .serializers import ResourceSerializer
import os
from .utilis import DocumentSummarizer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get'])
    def download_file1(self, request, pk=None):
        try:
            resource = self.get_object()
            if not resource.file1:
                return Response(
                    {'error': 'No file available'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            file_path = resource.file1.path
            filename = os.path.basename(file_path)
            
            response = FileResponse(
                open(file_path, 'rb'),
                content_type='application/octet-stream'
            )
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def download_file2(self, request, pk=None):
        try:
            resource = self.get_object()
            if not resource.file2:
                return Response(
                    {'error': 'No file available'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            file_path = resource.file2.path
            filename = os.path.basename(file_path)
            
            response = FileResponse(
                open(file_path, 'rb'),
                content_type='application/octet-stream'
            )
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def summarize(self, request, pk=None):
        try:
            resource = self.get_object()
            
            # Check if file1 exists
            if not resource.file1:
                return Response(
                    {'error': 'No PDF file found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # Initialize summarizer
            summarizer = DocumentSummarizer()

            # Get file path
            file_path = resource.file1.path

            # Extract and summarize text
            with open(file_path, 'rb') as file:
                # Extract text from PDF
                text = summarizer.extract_text_from_pdf(file)
                
                # Preprocess text
                cleaned_text = summarizer.preprocess_text(text)
                
                # Generate summary
                if len(cleaned_text.split()) > 50:
                    summary = summarizer.summarize_text(
                        cleaned_text,
                        min_length=100,
                        max_length=300
                    )
                    
                    return Response({
                        'summary': summary,
                        'status': 'success'
                    })
                else:
                    return Response({
                        'error': 'The extracted text is too short for summarization',
                        'status': 'error'
                    }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'error': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)