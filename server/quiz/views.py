# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Question
# from .serializers import QuestionSerializer
# from .utils import GeminiQuestionGenerator
# import os

# class QuestionGeneratorView(APIView):
#     def get(self, request):
#         difficulty = request.query_params.get('difficulty', 'easy')
#         subject = request.query_params.get('subject', 'Physics')
        
#         api_key = "AIzaSyCPw7AdBH_qMIZdIdwoOsgNpfYPw47IBeY"
#         generator = GeminiQuestionGenerator(api_key)
        
#         question_data = generator.generate_mcq(difficulty, subject)
        
#         if question_data:
#             serializer = QuestionSerializer(data=question_data)
#             if serializer.is_valid():
#                 question = serializer.save()
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
#         return Response(
#             {"error": "Could not generate question"}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# class QuestionListView(APIView):
#     def get(self, request):
#         difficulty = request.query_params.get('difficulty')
#         questions = Question.objects.filter(difficulty=difficulty)
#         serializer = QuestionSerializer(questions, many=True)
#         return Response(serializer.data)











# import os

# class DynamicQuestionGeneratorView(APIView):
#     def get(self, request):
#         # Get parameters from request
#         current_score = int(request.query_params.get('score', 0))
#         total_questions = int(request.query_params.get('total_questions', 10))
        
#         # Dynamic Difficulty Adjustment Algorithm
#         def adjust_difficulty(score, total_questions):
#             """
#             Dynamically adjust difficulty based on current score
            
#             Difficulty Mapping:
#             - 0-3 points: Easy
#             - 4-7 points: Medium
#             - 8-10 points: Hard
#             """
#             percentage = (score / total_questions) * 100 if total_questions > 0 else 0
            
#             if percentage < 30:
#                 return 'easy'
#             elif percentage < 70:
#                 return 'medium'
#             else:
#                 return 'hard'
        
#         # Determine difficulty
#         difficulty = adjust_difficulty(current_score, total_questions)
        
#         # Generate question using Gemini
#         api_key = "AIzaSyCPw7AdBH_qMIZdIdwoOsgNpfYPw47IBeY"
#         generator = GeminiQuestionGenerator(api_key)
        
#         # Generate question with adjusted difficulty
#         question_data = generator.generate_mcq(difficulty)
        
#         if question_data:
#             serializer = QuestionSerializer(data=question_data)
#             if serializer.is_valid():
#                 question = serializer.save()
                
#                 # Prepare response with additional metadata
#                 response_data = serializer.data
#                 response_data['current_difficulty'] = difficulty
#                 response_data['score_range'] = {
#                     'current_score': current_score,
#                     'total_questions': total_questions
#                 }
                
#                 return Response(response_data, status=status.HTTP_201_CREATED)
            
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
#         return Response(
#             {"error": "Could not generate question"}, 
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
# )

# class QuizProgressView(APIView):
#     def post(self, request):
#         """
#         Track and analyze quiz progress
#         """
#         current_score = request.data.get('score', 0)
#         total_questions = request.data.get('total_questions', 10)
        
#         # Analyze performance
#         performance_analysis = {
#             'current_score': current_score,
#             'total_questions': total_questions,
#             'percentage': (current_score / total_questions) * 100 if total_questions > 0 else 0,
#             'performance_level': self._get_performance_level(current_score, total_questions)
#         }
        
#         return Response(performance_analysis)
    
#     def _get_performance_level(self, score, total_questions):
#         percentage = (score / total_questions) * 100 if total_questions > 0 else 0
        
#         if percentage < 30:
#             return 'Beginner'
#         elif percentage < 60:
#             return 'Intermediate'
#         elif percentage < 80:
#             return 'Advanced'
#         else:
#             return 'Expert'

from .utils import GeminiQuestionGenerator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from .models import Question, QuizResult
from .serializers import QuestionSerializer, QuizResultSerializer
import random
from rest_framework.decorators import api_view

class DynamicQuestionGeneratorView(APIView):
    def get(self, request):
        # Get parameters from request
        current_score = int(request.query_params.get('score', 0))
        total_questions = int(request.query_params.get('total_questions', 5))
        
        # Dynamic Difficulty Adjustment Algorithm
        def adjust_difficulty(score, total_questions):
            """
            Dynamically adjust difficulty based on current score
            
            Difficulty Mapping:
            - 0-3 points: Easy
            - 4-7 points: Medium
            - 8-10 points: Hard
            """
            percentage = (score / total_questions) * 100 if total_questions > 0 else 0
            
            if percentage < 30:
                return 'easy'
            elif percentage < 70:
                return 'medium'
            else:
                return 'hard'
        
        # Determine difficulty
        difficulty = adjust_difficulty(current_score, total_questions)
        
        # Generate question using Gemini
        api_key = "AIzaSyCPw7AdBH_qMIZdIdwoOsgNpfYPw47IBeY"
        generator = GeminiQuestionGenerator(api_key)
        
        # Generate question with adjusted difficulty
        question_data = generator.generate_mcq(difficulty)
        
        if question_data:
            serializer = QuestionSerializer(data=question_data)
            if serializer.is_valid():
                question = serializer.save()
                
                # Prepare response with additional metadata
                response_data = serializer.data
                response_data['current_difficulty'] = difficulty
                response_data['score_range'] = {
                    'current_score': current_score,
                    'total_questions': total_questions
                }
                
                return Response(response_data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(
            {"error": "Could not generate question"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
)

class QuizProgressView(APIView):
    def post(self, request):
        """
        Track and analyze quiz progress
        """
        current_score = request.data.get('score', 0)
        total_questions = request.data.get('total_questions', 10)
        
        # Analyze performance
        performance_analysis = {
            'current_score': current_score,
            'total_questions': total_questions,
            'percentage': (current_score / total_questions) * 100 if total_questions > 0 else 0,
            'performance_level': self._get_performance_level(current_score, total_questions)
        }
        
        return Response(performance_analysis)
    
    def _get_performance_level(self, score, total_questions):
        percentage = (score / total_questions) * 100 if total_questions > 0 else 0
        
        if percentage < 30:
            return 'Beginner'
        elif percentage < 60:
            return 'Intermediate'
        elif percentage < 80:
            return 'Advanced'
        else:
            return 'Expert'

@api_view(['POST'])
def submit_quiz_result(request):
    serializer = QuizResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)