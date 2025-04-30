# # views.py
# from rest_framework import viewsets, status
# from rest_framework.decorators import api_view
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from django.views.decorators.csrf import ensure_csrf_cookie
# from .models import Question
# from .utils.gemini import generate_mcq, get_difficulty_display

# TOTAL_QUESTIONS = 30

# def calculate_level(score):
#     """
#     Calculate difficulty level based on score percentage
#     """
#     if score < 0:
#         return 'easy'
    
#     questions_answered = max(1, score // 2)
#     score_percentage = (score / questions_answered) * 100
    
#     if score_percentage < 40:
#         return 'easy'
#     elif score_percentage < 70:
#         return 'medium'
#     else:
#         return 'hard'

# def calculate_score_change(is_correct, current_level):
#     """
#     Calculate score change based on difficulty and correctness
#     """
#     if is_correct:
#         score_mapping = {
#             'easy': 2,
#             'medium': 4,
#             'hard': 6
#         }
#         return score_mapping.get(current_level, 2)
#     else:
#         penalty_mapping = {
#             'easy': -1,
#             'medium': -2,
#             'hard': -3
#         }
#         return penalty_mapping.get(current_level, -1)

# def initialize_session(request):
#     """Initialize or reset quiz session"""
#     request.session['quiz_session'] = {
#         'score': 0,
#         'level': 'easy',
#         'answered_questions': [],
#         'correct_streak': 0,
#         'questions_answered': 0
#     }
#     request.session.modified = True
#     return request.session['quiz_session']

# @api_view(['GET'])
# def get_question(request):
#     # Initialize session if not exists
#     if 'quiz_session' not in request.session:
#         session_data = initialize_session(request)
#     else:
#         session_data = request.session['quiz_session']
    
#     print("Get Question - Session Data:", session_data)  # Debug print
    
#     # Check if quiz is completed
#     if session_data['questions_answered'] >= TOTAL_QUESTIONS:
#         return Response({
#             'completed': True,
#             'final_score': session_data['score'],
#             'total_questions': TOTAL_QUESTIONS
#         })

#     current_level = session_data['level']
#     answered_questions = session_data['answered_questions']

#     # Get or generate question
#     question = Question.objects.filter(
#         difficulty=current_level
#     ).exclude(
#         id__in=answered_questions
#     ).order_by('?').first()

#     if not question:
#         question = generate_mcq(current_level)
#         if question:
#             question.save()

#     if not question:
#         return Response({
#             'error': 'Unable to generate question'
#         }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

#     return Response({
#         'question': {
#             'id': question.id,
#             'text': question.text,
#             'options': [
#                 question.option1,
#                 question.option2,
#                 question.option3,
#                 question.option4
#             ],
#             'difficulty': question.difficulty
#         },
#         'quiz_progress': {
#             'current_question': session_data['questions_answered'] + 1,
#             'total_questions': TOTAL_QUESTIONS,
#             'score': session_data['score'],
#             'difficulty': current_level,
#             'streak': session_data['correct_streak']
#         }
#     })

# @api_view(['POST'])
# def submit_answer(request):
#     # Get or initialize session
#     if 'quiz_session' not in request.session:
#         session_data = initialize_session(request)
#     else:
#         session_data = request.session['quiz_session']

#     print("Submit Answer - Session Data:", session_data)  # Debug print
    
#     if session_data['questions_answered'] >= TOTAL_QUESTIONS:
#         return Response({
#             'error': 'Quiz already completed'
#         }, status=status.HTTP_400_BAD_REQUEST)

#     question_id = request.data.get('question_id')
#     selected_option = request.data.get('selected_option')

#     if not question_id or not selected_option:
#         return Response({
#             'error': 'Missing question_id or selected_option'
#         }, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         question = Question.objects.get(id=question_id)
#     except Question.DoesNotExist:
#         return Response({
#             'error': 'Question not found'
#         }, status=status.HTTP_404_NOT_FOUND)

#     current_level = session_data['level']
    
#     # Check answer and update score
#     is_correct = selected_option == question.correct_option
#     score_change = calculate_score_change(is_correct, current_level)
    
#     # Update session data
#     session_data['score'] = max(0, session_data['score'] + score_change)
#     session_data['questions_answered'] += 1
    
#     if is_correct:
#         session_data['correct_streak'] += 1
#         if session_data['correct_streak'] >= 3:
#             bonus = 2
#             session_data['score'] += bonus
#     else:
#         session_data['correct_streak'] = 0

#     # Update difficulty for next question
#     session_data['level'] = calculate_level(session_data['score'])
    
#     # Track answered questions
#     if question_id not in session_data['answered_questions']:
#         session_data['answered_questions'].append(question_id)

#     # Save session
#     request.session['quiz_session'] = session_data
#     request.session.modified = True

#     print("Updated Session Data:", request.session['quiz_session'])  # Debug print

#     is_completed = session_data['questions_answered'] >= TOTAL_QUESTIONS

#     return Response({
#         'answer_result': {
#             'is_correct': is_correct,
#             'correct_answer': question.correct_option,
#             'score_change': score_change,
#             'streak': session_data['correct_streak']
#         },
#         'quiz_progress': {
#             'current_score': session_data['score'],
#             'questions_answered': session_data['questions_answered'],
#             'total_questions': TOTAL_QUESTIONS,
#             'is_completed': is_completed,
#             'next_difficulty': session_data['level']
#         }
#     })

# @api_view(['POST'])
# def reset_quiz(request):
#     """Reset the quiz session"""
#     session_data = initialize_session(request)
#     return Response({
#         'status': 'Quiz reset successful',
#         'session': session_data
#     })

# @api_view(['GET'])
# def get_quiz_stats(request):
#     """Get current quiz statistics"""
#     if 'quiz_session' not in request.session:
#         session_data = initialize_session(request)
#     else:
#         session_data = request.session['quiz_session']
    
#     return Response({
#         'total_questions': TOTAL_QUESTIONS,
#         'questions_answered': session_data['questions_answered'],
#         'current_score': session_data['score'],
#         'current_level': session_data['level'],
#         'correct_streak': session_data['correct_streak'],
#         'progress_percentage': (session_data['questions_answered'] / TOTAL_QUESTIONS) * 100,
#         'average_score': session_data['score'] / max(1, session_data['questions_answered'])
#     })




from django.shortcuts import render, redirect
from mcq.models import Question
from mcq.utils.gemini import generate_mcq
import random

def calculate_level(score):
    """
    Calculate difficulty level based on score with smoother transitions
    """
    if score < 0:
        return 'easy'
    elif score <= 3:
        return 'easy'
    elif score <= 7:
        return 'medium'
    else:
        return 'hard'

def calculate_score_change(is_correct, current_level):
    """
    Calculate score change based on difficulty and correctness
    """
    if is_correct:
        score_mapping = {
            'easy': 1,
            'medium': 2,
            'hard': 3
        }
        return score_mapping.get(current_level, 1)
    else:
        # Smaller penalties for wrong answers
        penalty_mapping = {
            'easy': -1,
            'medium': -1,
            'hard': -2
        }
        return penalty_mapping.get(current_level, -1)

def get_question(request):
    # Initialize session variables if not present
    if 'score' not in request.session:
        request.session['score'] = 0
        request.session['level'] = 'easy'
        request.session['answered_questions'] = []
        request.session['correct_streak'] = 0

    current_level = request.session.get('level', 'easy')
    answered_questions = request.session.get('answered_questions', [])

    # Get questions excluding the ones already answered
    question = Question.objects.filter(
        difficulty=current_level
    ).exclude(
        id__in=answered_questions
    ).order_by('?').first()

    # If no questions available, generate new one
    if not question:
        question = generate_mcq(current_level)
        if question:
            question.save()

    if not question:
        return render(request, 'mcq_app/question.html', {
            'message': 'Unable to generate questions at the moment.',
            'score': max(0, request.session['score']),  # Ensure non-negative display
            'difficulty': current_level
        })

    # Prepare context with all necessary information
    context = {
        'question': question,
        'score': max(0, request.session['score']),  # Ensure non-negative display
        'difficulty': current_level,
        'total_questions': Question.objects.filter(difficulty=current_level).count(),
        'answered_count': len(answered_questions),
        'correct_streak': request.session.get('correct_streak', 0)
    }

    return render(request, 'mcq_app/question.html', context)

def submit_answer(request):
    if request.method == 'POST':
        question_id = request.POST.get('question_id')
        selected_option = request.POST.get('selected_option')

        try:
            # Get the question
            question = Question.objects.get(id=question_id)
            current_level = request.session.get('level', 'easy')
            
            # Track answered questions
            answered_questions = request.session.get('answered_questions', [])
            if question_id not in answered_questions:
                answered_questions.append(question_id)
                request.session['answered_questions'] = answered_questions

            # Check answer and update score
            is_correct = selected_option == question.correct_option
            score_change = calculate_score_change(is_correct, current_level)
            
            # Update score and streak
            request.session['score'] = request.session.get('score', 0) + score_change
            
            if is_correct:
                request.session['correct_streak'] = request.session.get('correct_streak', 0) + 1
                # Bonus points for streaks
                if request.session['correct_streak'] >= 3:
                    request.session['score'] += 1  # Bonus point for maintaining streak
            else:
                request.session['correct_streak'] = 0

            # Update difficulty level based on new score
            new_level = calculate_level(request.session['score'])
            request.session['level'] = new_level

            # Ensure score doesn't go below 0 for display purposes
            request.session['score'] = max(0, request.session['score'])

            # Save session
            request.session.modified = True

            return redirect('get_question')

        except Question.DoesNotExist:
            # Handle invalid question ID
            return redirect('get_question')

    return redirect('get_question')

def reset_quiz(request):
    """
    Reset all quiz-related session variables
    """
    request.session['score'] = 0
    request.session['level'] = 'easy'
    request.session['answered_questions'] = []
    request.session['correct_streak'] = 0
    request.session.modified = True
    return redirect('get_question')




# from django.shortcuts import render, redirect
# from mcq.models import Question
# from mcq.utils.gemini import generate_mcq
# import random


# def initialize_session(request):
#     """Initialize quiz-related session variables if not present."""
#     if 'score' not in request.session:
#         request.session['score'] = 0
#         request.session['level'] = 'easy'
#         request.session['answered_questions'] = []
#         request.session['correct_streak'] = 0
#         request.session.modified = True


# def calculate_level(score):
#     """Determine difficulty level based on score."""
#     if score <= 3:
#         return 'easy'
#     elif score <= 7:
#         return 'medium'
#     return 'hard'


# def calculate_score_change(is_correct, current_level):
#     """Calculate score change based on correctness and difficulty level."""
#     score_mapping = {'easy': 1, 'medium': 2, 'hard': 3}
#     penalty_mapping = {'easy': -1, 'medium': -1, 'hard': -2}
#     return score_mapping[current_level] if is_correct else penalty_mapping[current_level]


# def get_question(request):
#     """Retrieve a question based on the current difficulty level."""
#     initialize_session(request)
#     current_level = request.session['level']
#     answered_questions = request.session['answered_questions']

#     question = Question.objects.filter(difficulty=current_level).exclude(id__in=answered_questions).order_by('?').first()

#     if not question:
#         question = generate_mcq(current_level)
#         if question:
#             question.save()

#     if not question:
#         return render(request, 'mcq_app/question.html', {
#             'message': 'Unable to generate questions at the moment.',
#             'score': request.session['score'],
#             'difficulty': current_level,
#         })

#     context = {
#         'question': question,
#         'score': request.session['score'],
#         'difficulty': current_level,
#         'total_questions': Question.objects.filter(difficulty=current_level).count(),
#         'answered_count': len(answered_questions),
#         'correct_streak': request.session['correct_streak'],
#     }
#     return render(request, 'mcq_app/question.html', context)


# def submit_answer(request):
#     """Handle answer submission and update session variables."""
#     if request.method == 'POST':
#         question_id = request.POST.get('question_id')
#         selected_option = request.POST.get('selected_option')

#         try:
#             question = Question.objects.get(id=question_id)
#             current_level = request.session['level']

#             if question_id not in request.session['answered_questions']:
#                 request.session['answered_questions'].append(question_id)

#             is_correct = selected_option == question.correct_option
#             score_change = calculate_score_change(is_correct, current_level)
#             request.session['score'] = max(0, request.session['score'] + score_change)

#             if is_correct:
#                 request.session['correct_streak'] += 1
#                 if request.session['correct_streak'] >= 3:
#                     request.session['score'] += 1  # Bonus point for a streak
#             else:
#                 request.session['correct_streak'] = 0

#             request.session['level'] = calculate_level(request.session['score'])
#             request.session.modified = True

#         except Question.DoesNotExist:
#             pass  # Handle invalid question gracefully

#     return redirect('get_question')


# def reset_quiz(request):
#     """Reset all quiz-related session variables."""
#     for key in ['score', 'level', 'answered_questions', 'correct_streak']:
#         request.session[key] = 0 if key == 'score' else 'easy' if key == 'level' else []
#     request.session.modified = True
#     return redirect('get_question')
