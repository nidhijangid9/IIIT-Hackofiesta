# # drowsiness_detection/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# import base64
# import numpy as np
# import cv2
# from .detector import detect_drowsiness_in_frame

# class DrowsinessDetectionView(APIView):
#     def post(self, request, format=None):
#         image_data_url = request.data.get('image')
#         if not image_data_url:
#             return Response({'error': 'No image data provided'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # Decode the base64 image data URL
#             # Format: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
#             header, encoded = image_data_url.split(',', 1)
#             image_data = base64.b64decode(encoded)
#             nparr = np.frombuffer(image_data, np.uint8)
#             frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#             if frame is None:
#                  return Response({'error': 'Could not decode image'}, status=status.HTTP_400_BAD_REQUEST)

#             # --- Get a unique identifier for the user/session ---
#             # For now, using a fixed ID. Replace with actual session/user ID if available.
#             # user_id = request.session.session_key or 'guest_user'
#             user_id = 'unique_user_session_placeholder' # TODO: Replace with actual session/user management

#             # Process the frame
#             result = detect_drowsiness_in_frame(frame, user_id)

#             return Response(result, status=status.HTTP_200_OK)

#         except Exception as e:
#             print(f"Error in DrowsinessDetectionView: {e}")
#             # Log the exception e
#             return Response(
#                 {'error': 'An error occurred during drowsiness detection.'},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
        

# drowsiness_detection/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import base64
import numpy as np
import cv2
from .detector import detect_drowsiness_in_frame

class DrowsinessDetectionView(APIView):
    def post(self, request, format=None):
        try:
            # Get image data from request
            image_data_url = request.data.get('image')
            # Get user_id if provided, otherwise use a default
            user_id = request.data.get('user_id', 'unique_user_session_placeholder')
            
            if not image_data_url:
                return Response({'error': 'No image data provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the image is in data URL format and extract the base64 part
            if image_data_url.startswith('data:image'):
                # Format: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
                header, encoded = image_data_url.split(',', 1)
            else:
                # If it's just a base64 string without the data URL prefix
                encoded = image_data_url
            
            # Decode the base64 image data
            image_data = base64.b64decode(encoded)
            nparr = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                return Response({'error': 'Could not decode image'}, status=status.HTTP_400_BAD_REQUEST)

            # Process the frame
            result = detect_drowsiness_in_frame(frame, user_id)

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            print(f"Error in DrowsinessDetectionView: {e}")
            print(traceback.format_exc())  # More detailed error logging
            return Response(
                {'error': f'An error occurred during drowsiness detection: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )