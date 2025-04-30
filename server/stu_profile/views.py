# views.py
from rest_framework import generics, permissions
from .models import StudentProfile,LectureResource
from .serializers import StudentProfileSerializer,LectureResourceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


class CreateStudentProfileView(generics.CreateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_student_profile(request):
    try:
        profile = request.user.profile
        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except StudentProfile.DoesNotExist:
        return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

# views.py (continued)
from rest_framework.permissions import IsAuthenticated
from .models import StudentProfile
# from .recommender import create_sample_data, ContentBasedRecommender
class ContentBasedRecommender:
    def __init__(self):
        self.scaler = StandardScaler()
        self.subject_encoder = LabelEncoder()
        self.difficulty_encoder = LabelEncoder()
        self.tfidf = TfidfVectorizer(stop_words='english')
        
    def fit(self, lectures_df, student_data):
        """
        lectures_df: DataFrame containing lecture information
        student_data: DataFrame containing student information
        """
        self.lectures_df = lectures_df.copy()
        self.student_data = student_data.copy()
        
        # Create content features
        self._prepare_content_features()
        # Create student features
        self._prepare_student_features()
        
        return self

    def _prepare_content_features(self):
        """Prepare lecture content features"""
        # Convert text content to TF-IDF features
        content_features = self.tfidf.fit_transform(
            self.lectures_df['content_text'].fillna('')
        )
        
        # Encode categorical features
        self.lectures_df['subject_encoded'] = self.subject_encoder.fit_transform(
            self.lectures_df['subject']
        )
        self.lectures_df['difficulty_encoded'] = self.difficulty_encoder.fit_transform(
            self.lectures_df['difficulty_level']
        )
        
        # Convert topics list to string and create TF-IDF
        topics_text = self.lectures_df['topics'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '')
        topics_features = self.tfidf.fit_transform(topics_text)
        
        # Combine all features
        self.content_features = np.hstack([
            content_features.toarray(),
            topics_features.toarray(),
            self.lectures_df[['subject_encoded', 'difficulty_encoded']].values
        ])

    def _prepare_student_features(self):
        """Prepare student profile features"""
        profiles = []
        for _, student in self.student_data.iterrows():
            profile = {
                'student_id': student['student_id'],
                'avg_score': np.mean(student['mcq_scores']),
                'consumed_content': set(student['watched_videos'] + student['read_blogs'])
            }
            profiles.append(profile)
        self.student_profiles = pd.DataFrame(profiles)

    def _get_difficulty_level(self, score):
        """Map student score to difficulty level"""
        if score < 40:
            return 'beginner'
        elif score < 70:
            return 'intermediate'
        else:
            return 'advanced'

    def get_recommendations(self, student_id, n_recommendations=5):
        """Generate recommendations for a student"""
        # Get student profile
        student = self.student_profiles[
            self.student_profiles['student_id'] == student_id
        ].iloc[0]
        
        # Get student's difficulty level
        student_difficulty = self._get_difficulty_level(student['avg_score'])
        student_difficulty_encoded = self.difficulty_encoder.transform([student_difficulty])[0]
        
        # Calculate similarity scores
        similarities = []
        for idx, lecture in self.lectures_df.iterrows():
            # Skip already consumed content
            if lecture['lecture_id'] in student['consumed_content']:
                similarities.append(-1)  # Mark as already consumed
                continue
            
            # Calculate difficulty match
            difficulty_match = 1 - (abs(
                student_difficulty_encoded - lecture['difficulty_encoded']
            ) / len(self.difficulty_encoder.classes_))
            
            # Calculate content similarity
            content_sim = cosine_similarity(
                self.content_features[idx].reshape(1, -1),
                self.content_features[idx].reshape(1, -1)
            )[0][0]
            
            # Combined score
            final_score = 0.7 * content_sim + 0.3 * difficulty_match
            similarities.append(final_score)
        
        # Get top recommendations
        recommendations = []
        similarity_array = np.array(similarities)
        top_indices = np.argsort(similarity_array)[::-1][:n_recommendations]
        
        for idx in top_indices:
            if similarity_array[idx] == -1:
                continue
                
            lecture = self.lectures_df.iloc[idx]
            recommendations.append({
                'lecture_id': lecture['lecture_id'],
                'subject': lecture['subject'],
                'difficulty': lecture['difficulty_level'],
                'topics': lecture['topics'],
                'similarity_score': similarities[idx]
            })
            
        return recommendations

def create_sample_data():
    """Create sample data for demonstration"""
    # Sample lectures data
    lectures_df = pd.DataFrame({
        'lecture_id': [f'L{i}' for i in range(10)],
        'subject': np.random.choice(['Math', 'Physics', 'Chemistry'], 10),
        'content_text': [
            f'Sample content about topic {i} with key concepts' for i in range(10)
        ],
        'difficulty_level': np.random.choice(
            ['beginner', 'intermediate', 'advanced'], 10
        ),
        'topics': [
            [f'topic_{j}' for j in range(np.random.randint(2, 5))]
            for i in range(10)
        ]
    })
    
    # Sample student data
    student_data = pd.DataFrame({
        'student_id': [f'S{i}' for i in range(5)],
        'mcq_scores': [np.random.rand() * 100 for _ in range(5)],
        'watched_videos': [
            [f'L{j}' for j in np.random.choice(range(10), np.random.randint(1, 4), replace=False)]
            for _ in range(5)
        ],
        'read_blogs': [
            [f'L{j}' for j in np.random.choice(range(10), np.random.randint(1, 4), replace=False)]
            for _ in range(5)
        ]
    })
    
    return lectures_df, student_data


class AuthenticatedSampleRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student_profile = request.user.profile  # OneToOneField access
            print(student_profile)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student profile not found."}, status=404)

        student_id = student_profile.student_id

        lectures_df, students_df = create_sample_data()

        if student_id not in students_df['student_id'].values:
            return Response({"error": "Student ID not found in sample data."}, status=404)

        recommender = ContentBasedRecommender()
        recommender.fit(lectures_df, students_df)
        recommendations = recommender.get_recommendations(student_id)
        print(recommendations)

        # Extract lecture_ids from recommendations
        recommended_ids = [rec['lecture_id'] for rec in recommendations]

        # Fetch actual lecture objects from DB
        recommended_lectures = LectureResource.objects.filter(lecture_id__in=recommended_ids)

        # Serialize the results
        serializer = LectureResourceSerializer(recommended_lectures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
#new
class LectureDetailView(generics.RetrieveAPIView):
    queryset = LectureResource.objects.all()
    serializer_class = LectureResourceSerializer
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        lecture_id = kwargs.get('lecture_id')
        try:
            lecture = LectureResource.objects.get(lecture_id=lecture_id)
            serializer = self.get_serializer(lecture)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except LectureResource.DoesNotExist:
            return Response({'detail': 'Lecture not found.'}, status=status.HTTP_404_NOT_FOUND)


        # return Response(recommendations, status=200)





