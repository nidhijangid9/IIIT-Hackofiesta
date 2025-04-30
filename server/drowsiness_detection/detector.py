# # drowsiness_detection/detector.py
# import cv2
# import dlib
# from scipy.spatial import distance
# import numpy as np
# from collections import deque
# import os
# from django.conf import settings # To get the base directory
# import datetime

# # --- Helper Functions (Keep these as they are) ---
# def eye_aspect_ratio(eye):
#     A = distance.euclidean(eye[1], eye[5])
#     B = distance.euclidean(eye[2], eye[4])
#     C = distance.euclidean(eye[0], eye[3])
#     if C == 0: return 0.0 # Avoid division by zero
#     EAR = (A + B) / (2.0 * C)
#     return EAR

# def get_face_coordinates(face):
#     x = face.left()
#     y = face.top()
#     w = face.right() - x
#     h = face.bottom() - y
#     return (x, y, w, h)

# def enhance_contrast(gray):
#     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
#     return clahe.apply(gray)

# # --- Load Models (Do this once when the module loads) ---
# try:
#     # Construct the absolute path to the model file
#     predictor_path = os.path.join(
#         settings.BASE_DIR, # Your Django project's base directory
#         'drowsiness_detection',
#         'data',
#         'shape_predictor_68_face_landmarks.dat'
#     )
#     if not os.path.exists(predictor_path):
#          raise FileNotFoundError(f"Predictor model not found at: {predictor_path}")

#     hog_face_detector = dlib.get_frontal_face_detector()
#     dlib_facelandmark = dlib.shape_predictor(predictor_path)
#     print("Dlib face detector and landmark predictor loaded successfully.")
# except Exception as e:
#     print(f"FATAL ERROR: Could not load dlib models: {e}")
#     # Depending on your needs, you might want to raise the exception
#     # or handle it so the server can still start but the feature is disabled.
#     hog_face_detector = None
#     dlib_facelandmark = None

# # --- Constants ---
# CONSEC_FRAMES_THRESHOLD = 5  # Reduced from 10 for faster detection
# EAR_THRESHOLD = 0.25  # Adjust based on testing

# # --- Main Detection Function ---
# # We need to maintain state across requests for the same user.
# # A simple dictionary can work for demonstration, but for production,
# # consider using Django sessions, cache, or a database to store user state.

# # Key: Some unique identifier for the user/session. 
# # Value: {'frame_count': x, 'ear_history': deque, 'last_drowsy_time': datetime, 'drowsy_detected': bool}
# user_detection_state = {}

# def detect_drowsiness_in_frame(frame_bgr, user_id='default_user'):
#     """
#     Processes a single frame to detect drowsiness by focusing on eye closure.
#     Returns detection status and face coordinates when drowsy state is first detected.
#     """
#     if hog_face_detector is None or dlib_facelandmark is None:
#         print("Models not loaded properly")
#         return {'status': 'Error: Models not loaded', 'ear': None}

#     # Initialize state for the user if not present
#     if user_id not in user_detection_state:
#         user_detection_state[user_id] = {
#             'frame_count': 0,
#             'ear_history': deque(maxlen=10),
#             'last_drowsy_time': None,
#             'drowsy_detected': False,
#             'face_coords': None
#         }

#     state = user_detection_state[user_id]
#     status = "Awake"  # Default status
#     current_ear = None
#     response_data = {'status': status, 'ear': None}

#     try:
#         # Convert to grayscale and enhance contrast for better face detection
#         gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
#         enhanced_gray = enhance_contrast(gray)
        
#         # Try face detection with different parameters
#         faces = hog_face_detector(enhanced_gray)
#         if len(faces) == 0:
#             faces = hog_face_detector(enhanced_gray, 1)  # Try with upsampling
            
#         if len(faces) == 0:
#             print("No faces detected in this frame")
#             # Reset frame count if no face is detected to avoid false positives
#             state['frame_count'] = max(0, state['frame_count'] - 1)
#             return {'status': 'Face Not Detected', 'ear': None}

#         # Process the first detected face
#         face = faces[0]
#         face_landmarks = dlib_facelandmark(enhanced_gray, face)
        
#         # Get face coordinates for reporting
#         face_coords = get_face_coordinates(face)
        
#         # Extract eye landmarks
#         leftEye = [(face_landmarks.part(n).x, face_landmarks.part(n).y) for n in range(36, 42)]
#         rightEye = [(face_landmarks.part(n).x, face_landmarks.part(n).y) for n in range(42, 48)]
        
#         # Calculate EAR for both eyes
#         left_ear = eye_aspect_ratio(leftEye)
#         right_ear = eye_aspect_ratio(rightEye)
#         EAR = (left_ear + right_ear) / 2.0
        
#         # Add to history and calculate average for smoothing
#         state['ear_history'].append(EAR)
#         current_ear = round(np.mean(state['ear_history']), 3) if state['ear_history'] else EAR
        
#         # Determine drowsiness with more sensitivity
#         if current_ear < EAR_THRESHOLD:
#             state['frame_count'] += 1
#             if state['frame_count'] >= CONSEC_FRAMES_THRESHOLD:
#                 status = "Drowsy"
                
#                 # Only report when transitioning from awake to drowsy
#                 if not state['drowsy_detected']:
#                     state['drowsy_detected'] = True
#                     state['last_drowsy_time'] = datetime.datetime.now()
#                     state['face_coords'] = face_coords
                    
#                     # Log the drowsiness event with timestamp and coordinates
#                     drowsy_time = state['last_drowsy_time'].strftime("%H:%M:%S")
#                     print(f"DROWSINESS DETECTED at {drowsy_time}! Face coordinates: {face_coords}")
                    
#                     # Add the drowsiness event info to the response
#                     response_data['first_drowsy'] = True
#                     response_data['timestamp'] = drowsy_time
#                     response_data['face_coords'] = face_coords
#         else:
#             # If user is awake, reduce frame count and reset drowsy flag
#             state['frame_count'] = max(0, state['frame_count'] - 1)
#             if state['drowsy_detected']:
#                 state['drowsy_detected'] = False  # Reset the flag
#             status = "Awake"
            
#     except Exception as e:
#         import traceback
#         print(f"Error processing frame: {e}")
#         print(traceback.format_exc())
#         return {'status': 'Error', 'ear': None}

#     # Update response with status and EAR value
#     response_data['status'] = status
#     response_data['ear'] = current_ear
    
#     return response_data











# # drowsiness_detection/detector.py
# import cv2
# import dlib
# from scipy.spatial import distance
# import numpy as np
# from collections import deque
# import os
# from django.conf import settings # To get the base directory
# import datetime

# # --- Helper Functions (Keep these as they are) ---
# def eye_aspect_ratio(eye):
#     A = distance.euclidean(eye[1], eye[5])
#     B = distance.euclidean(eye[2], eye[4])
#     C = distance.euclidean(eye[0], eye[3])
#     if C == 0: return 0.0 # Avoid division by zero
#     EAR = (A + B) / (2.0 * C)
#     return EAR

# def get_face_coordinates(face):
#     x = face.left()
#     y = face.top()
#     w = face.right() - x
#     h = face.bottom() - y
#     return (x, y, w, h)

# def enhance_contrast(gray):
#     clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
#     return clahe.apply(gray)

# # --- Load Models (Do this once when the module loads) ---
# try:
#     # Construct the absolute path to the model file
#     predictor_path = os.path.join(
#         settings.BASE_DIR, # Your Django project's base directory
#         'drowsiness_detection',
#         'data',
#         'shape_predictor_68_face_landmarks.dat'
#     )
#     if not os.path.exists(predictor_path):
#          raise FileNotFoundError(f"Predictor model not found at: {predictor_path}")

#     hog_face_detector = dlib.get_frontal_face_detector()
#     dlib_facelandmark = dlib.shape_predictor(predictor_path)
#     print("Dlib face detector and landmark predictor loaded successfully.")
# except Exception as e:
#     print(f"FATAL ERROR: Could not load dlib models: {e}")
#     # Depending on your needs, you might want to raise the exception
#     # or handle it so the server can still start but the feature is disabled.
#     hog_face_detector = None
#     dlib_facelandmark = None

# # --- Constants ---
# CONSEC_FRAMES_THRESHOLD = 5  # Reduced from 10 for faster detection
# EAR_THRESHOLD = 0.25  # Adjust based on testing

# # --- Main Detection Function ---
# # We need to maintain state across requests for the same user.
# # A simple dictionary can work for demonstration, but for production,
# # consider using Django sessions, cache, or a database to store user state.

# # Key: Some unique identifier for the user/session. 
# # Value: {'frame_count': x, 'ear_history': deque, 'last_drowsy_time': datetime, 'drowsy_detected': bool}
# user_detection_state = {}

# def detect_drowsiness_in_frame(frame_bgr, user_id='default_user'):
#     """
#     Processes a single frame to detect drowsiness by focusing on eye closure.
#     Returns detection status and face coordinates when drowsy state is first detected.
#     """
#     if hog_face_detector is None or dlib_facelandmark is None:
#         print("Models not loaded properly")
#         return {'status': 'Error: Models not loaded', 'ear': None}

#     # Initialize state for the user if not present
#     if user_id not in user_detection_state:
#         user_detection_state[user_id] = {
#             'frame_count': 0,
#             'ear_history': deque(maxlen=10),
#             'last_drowsy_time': None,
#             'drowsy_detected': False,
#             'face_coords': None
#         }

#     state = user_detection_state[user_id]
#     status = "Awake"  # Default status
#     current_ear = None
#     response_data = {'status': status, 'ear': None}

#     try:
#         # Convert to grayscale and enhance contrast for better face detection
#         gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
#         enhanced_gray = enhance_contrast(gray)
        
#         # Try face detection with different parameters
#         faces = hog_face_detector(enhanced_gray)
#         if len(faces) == 0:
#             faces = hog_face_detector(enhanced_gray, 1)  # Try with upsampling
            
#         if len(faces) == 0:
#             print("No faces detected in this frame")
#             # Reset frame count if no face is detected to avoid false positives
#             state['frame_count'] = max(0, state['frame_count'] - 1)
#             return {'status': 'Face Not Detected', 'ear': None}

#         # Process the first detected face
#         face = faces[0]
#         face_landmarks = dlib_facelandmark(enhanced_gray, face)
        
#         # Get face coordinates for reporting
#         face_coords = get_face_coordinates(face)
        
#         # Extract eye landmarks
#         leftEye = [(face_landmarks.part(n).x, face_landmarks.part(n).y) for n in range(36, 42)]
#         rightEye = [(face_landmarks.part(n).x, face_landmarks.part(n).y) for n in range(42, 48)]
        
#         # Calculate EAR for both eyes
#         left_ear = eye_aspect_ratio(leftEye)
#         right_ear = eye_aspect_ratio(rightEye)
#         EAR = (left_ear + right_ear) / 2.0
        
#         # Add to history and calculate average for smoothing
#         state['ear_history'].append(EAR)
#         current_ear = round(np.mean(state['ear_history']), 3) if state['ear_history'] else EAR
        
#         # Determine drowsiness with more sensitivity
#         if current_ear < EAR_THRESHOLD:
#             state['frame_count'] += 1
#             if state['frame_count'] >= CONSEC_FRAMES_THRESHOLD:
#                 status = "Drowsy"
                
#                 # Only report when transitioning from awake to drowsy
#                 if not state['drowsy_detected']:
#                     state['drowsy_detected'] = True
#                     state['last_drowsy_time'] = datetime.datetime.now()
#                     state['face_coords'] = face_coords
                    
#                     # Log the drowsiness event with timestamp and coordinates
#                     drowsy_time = state['last_drowsy_time'].strftime("%H:%M:%S")
                    
#                     # Print drowsiness detection message to console/terminal
#                     print("\n" + "="*50)
#                     print(f"USER IS DROWSY! DETECTED AT {drowsy_time}")
#                     print(f"Eye Aspect Ratio (EAR): {current_ear}")
#                     print(f"Face coordinates: {face_coords}")
#                     print("="*50 + "\n")
                    
#                     # Add the drowsiness event info to the response
#                     response_data['first_drowsy'] = True
#                     response_data['timestamp'] = drowsy_time
#                     response_data['face_coords'] = face_coords
#         else:
#             # If user is awake, reduce frame count and reset drowsy flag
#             state['frame_count'] = max(0, state['frame_count'] - 1)
#             if state['drowsy_detected']:
#                 state['drowsy_detected'] = False  # Reset the flag
#                 # Print when user returns to awake state
#                 print(f"User returned to AWAKE state with EAR: {current_ear}")
#             status = "Awake"
            
#     except Exception as e:
#         import traceback
#         print(f"Error processing frame: {e}")
#         print(traceback.format_exc())
#         return {'status': 'Error', 'ear': None}

#     # Update response with status and EAR value
#     response_data['status'] = status
#     response_data['ear'] = current_ear
    
#     return response_data





import cv2
import dlib
from scipy.spatial import distance
import numpy as np
from collections import deque
import os
from django.conf import settings  # To get the base directory
import datetime

# --- Helper Functions (Keep these as they are) ---
def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    if C == 0: return 0.0  # Avoid division by zero
    EAR = (A + B) / (2.0 * C)
    return EAR

def get_face_coordinates(face):
    x = face.left()
    y = face.top()
    w = face.right() - x
    h = face.bottom() - y
    return (x, y, w, h)

def enhance_contrast(gray):
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(gray)

# --- Load Models (Do this once when the module loads) ---
try:
    predictor_path = os.path.join(
        settings.BASE_DIR,
        'drowsiness_detection',
        'data',
        'shape_predictor_68_face_landmarks.dat'
    )
    if not os.path.exists(predictor_path):
        raise FileNotFoundError(f"Predictor model not found at: {predictor_path}")

    hog_face_detector = dlib.get_frontal_face_detector()
    dlib_facelandmark = dlib.shape_predictor(predictor_path)
    print("Dlib face detector and landmark predictor loaded successfully.")
except Exception as e:
    print(f"FATAL ERROR: Could not load dlib models: {e}")
    hog_face_detector = None
    dlib_facelandmark = None

# --- Constants ---
CONSEC_FRAMES_THRESHOLD = 6  # Increased for better accuracy
EAR_THRESHOLD = 0.21         # Reduced to avoid false drowsy due to specs

# --- State Management ---
user_detection_state = {}

def detect_drowsiness_in_frame(frame_bgr, user_id='default_user'):
    if hog_face_detector is None or dlib_facelandmark is None:
        print("Models not loaded properly")
        return {'status': 'Error: Models not loaded', 'ear': None}

    if user_id not in user_detection_state:
        user_detection_state[user_id] = {
            'frame_count': 0,
            'ear_history': deque(maxlen=10),
            'last_drowsy_time': None,
            'drowsy_detected': False,
            'face_coords': None
        }

    state = user_detection_state[user_id]
    status = "Awake"
    current_ear = None
    response_data = {'status': status, 'ear': None}

    try:
        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)

        # Apply Gaussian blur to reduce noise from glasses
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        enhanced_gray = enhance_contrast(blurred)

        faces = hog_face_detector(enhanced_gray)
        if len(faces) == 0:
            faces = hog_face_detector(enhanced_gray, 1)

        if len(faces) == 0:
            print("No faces detected in this frame")
            state['frame_count'] = max(0, state['frame_count'] - 1)
            return {'status': 'Face Not Detected', 'ear': None}

        face = faces[0]
        face_landmarks = dlib_facelandmark(enhanced_gray, face)
        face_coords = get_face_coordinates(face)

        leftEye = [(face_landmarks.part(n).x, face_landmarks.part(n).y) for n in range(36, 42)]
        rightEye = [(face_landmarks.part(n).x, face_landmarks.part(n).y) for n in range(42, 48)]

        left_ear = eye_aspect_ratio(leftEye)
        right_ear = eye_aspect_ratio(rightEye)
        EAR = (left_ear + right_ear) / 2.0

        state['ear_history'].append(EAR)
        current_ear = round(np.mean(state['ear_history']), 3) if state['ear_history'] else EAR

        # DEBUG PRINT
        print(f"EAR: {current_ear} | Frame Count: {state['frame_count']} | Status: {status}")

        if current_ear < EAR_THRESHOLD:
            state['frame_count'] += 1
            if state['frame_count'] >= CONSEC_FRAMES_THRESHOLD:
                status = "Drowsy"
                if not state['drowsy_detected']:
                    state['drowsy_detected'] = True
                    state['last_drowsy_time'] = datetime.datetime.now()
                    state['face_coords'] = face_coords

                    drowsy_time = state['last_drowsy_time'].strftime("%H:%M:%S")
                    print("\n" + "="*50)
                    print(f"USER IS DROWSY! DETECTED AT {drowsy_time}")
                    print(f"Eye Aspect Ratio (EAR): {current_ear}")
                    print(f"Face coordinates: {face_coords}")
                    print("="*50 + "\n")

                    response_data['first_drowsy'] = True
                    response_data['timestamp'] = drowsy_time
                    response_data['face_coords'] = face_coords
        else:
            state['frame_count'] = max(0, state['frame_count'] - 1)
            if state['drowsy_detected']:
                state['drowsy_detected'] = False
                print(f"User returned to AWAKE state with EAR: {current_ear}")
            status = "Awake"

    except Exception as e:
        import traceback
        print(f"Error processing frame: {e}")
        print(traceback.format_exc())
        return {'status': 'Error', 'ear': None}

    response_data['status'] = status
    response_data['ear'] = current_ear
    return response_data