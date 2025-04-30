# import google.generativeai as genai
# import os
# import logging
# from .models import Question
# import random

# logger = logging.getLogger(__name__)

# class GeminiQuestionGenerator:
#     def __init__(self, api_key):
#         genai.configure(api_key=api_key)
#         self.model = genai.GenerativeModel("gemini-1.5-flash")

#     def generate_mcq(self, difficulty="easy", subject="Physics"):
#         try:
#             prompt = self._create_prompt(difficulty, subject)
#             response = self.model.generate_content(prompt)
#             return self._parse_response(response.text, difficulty)
#         except Exception as e:
#             logger.error(f"Question generation error: {str(e)}")
#             return None

#     def _create_prompt(self, difficulty, subject):
#         return f"""Generate a {difficulty} level multiple-choice question for {subject}.

#         Format:
#         Q: [Question text]
#         A) [Option 1]
#         B) [Option 2]
#         C) [Option 3]
#         D) [Option 4]
#         CORRECT: [Correct Option Letter]
#         """

#     def _parse_response(self, content, difficulty):
#         lines = content.split('\n')
#         question_text = lines[0].replace('Q: ', '').strip()
        
#         options = {}
#         correct_option = None
        
#         for line in lines[1:]:
#             if line.startswith(('A)', 'B)', 'C)', 'D)')):
#                 key = line[0]
#                 options[key] = line[3:].strip()
#             elif line.startswith('CORRECT:'):
#                 correct_option = line.replace('CORRECT:', '').strip()
        
#         if not all([question_text, options, correct_option]):
#             return None
        
#         return {
#             'text': question_text,
#             'difficulty': difficulty,
#             'option1': options.get('A', ''),
#             'option2': options.get('B', ''),
#             'option3': options.get('C', ''),
#             'option4': options.get('D', ''),
#             'correct_option': options.get(correct_option, '')
#         }

import google.generativeai as genai
import os
import logging
from .models import Question
import random
import hashlib

logger = logging.getLogger(__name__)

class GeminiQuestionGenerator:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.question_hashes = set()  # Track question hashes to avoid duplicates
        
    def generate_mcq(self, difficulty="easy", subject="Physics"):
        try:
            # Max attempts to get a unique question
            max_attempts = 3
            for attempt in range(max_attempts):
                prompt = self._create_diverse_prompt(difficulty, subject)
                response = self.model.generate_content(prompt)
                question_data = self._parse_response(response.text, difficulty)
                
                if question_data:
                    # Create a hash of the question to check uniqueness
                    question_hash = hashlib.md5(question_data['text'].encode()).hexdigest()
                    
                    # Check if we've seen this question before
                    if question_hash not in self.question_hashes:
                        self.question_hashes.add(question_hash)
                        return question_data
                    
                    # If duplicate and we have attempts left, try again
                    logger.info(f"Duplicate question detected, attempt {attempt+1}/{max_attempts}")
            
            # If all attempts failed, force diversity by adding timestamp
            prompt = self._create_diverse_prompt(difficulty, subject, force_unique=True)
            response = self.model.generate_content(prompt)
            return self._parse_response(response.text, difficulty)
            
        except Exception as e:
            logger.error(f"Question generation error: {str(e)}")
            return None
    
    def _create_diverse_prompt(self, difficulty, subject, force_unique=False):
        # List of different prompt templates to increase diversity
        prompt_templates = [
            f"""Generate a {difficulty} level multiple-choice question for {subject} that tests conceptual understanding.
            
            Format:
            Q: [Question text]
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            CORRECT: [Correct Option Letter]
            """,
            
            f"""Create a unique and challenging {difficulty} {subject} question that students haven't seen before.
            
            Format:
            Q: [Question text]
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            CORRECT: [Correct Option Letter]
            """,
            
            f"""Design a {difficulty} multiple-choice question on {subject} with a real-world application.
            
            Format:
            Q: [Question text]
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            CORRECT: [Correct Option Letter]
            """
        ]
        
        # Add topic diversity
        if subject in ["Physics", "Chemistry", "Biology", "Mathematics"]:
            topics = {
                "Physics": ["Work", "Energy"],
                "Chemistry": ["organic chemistry", "inorganic chemistry", "physical chemistry", "biochemistry", "analytical chemistry"],
                "Biology": ["genetics", "ecology", "anatomy", "cell biology", "evolution", "microbiology"],
                "Mathematics": ["algebra", "geometry", "calculus", "statistics", "number theory", "trigonometry"]
            }
            specific_topic = random.choice(topics.get(subject, [subject]))
            
            # Add specific topic to prompt
            specific_prompt = f"""Generate a {difficulty} level multiple-choice question about {specific_topic} in {subject}.
            
            Format:
            Q: [Question text]
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            CORRECT: [Correct Option Letter]
            """
            prompt_templates.append(specific_prompt)
        
        # If forcing uniqueness, add timestamp
        if force_unique:
            import time
            timestamp = time.time()
            return f"""Generate a completely unique {difficulty} level multiple-choice {subject} question 
            that is different from any previous questions. Reference ID: {timestamp}
            
            Format:
            Q: [Question text]
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            CORRECT: [Correct Option Letter]
            """
        
        # Randomly select a prompt template
        return random.choice(prompt_templates)

    def _parse_response(self, content, difficulty):
        lines = content.split('\n')
        question_text = ""
        
        # More robust parsing - find the question text
        for i, line in enumerate(lines):
            if line.strip().startswith("Q:"):
                question_text = line.replace('Q:', '').strip()
                break
            # Handle case where "Q:" might be missing
            elif i == 0 and not any(line.startswith(prefix) for prefix in ["A)", "B)", "C)", "D)", "CORRECT:"]):
                question_text = line.strip()
        
        options = {}
        correct_option = None
        
        # Parse options and correct answer
        for line in lines:
            line = line.strip()
            if line.startswith(('A)', 'B)', 'C)', 'D)')):
                key = line[0]
                options[key] = line[3:].strip()
            elif line.startswith('CORRECT:'):
                correct_option = line.replace('CORRECT:', '').strip()
        
        if not all([question_text, options, correct_option]):
            return None
        
        return {
            'text': question_text,
            'difficulty': difficulty,
            'option1': options.get('A', ''),
            'option2': options.get('B', ''),
            'option3': options.get('C', ''),
            'option4': options.get('D', ''),
            'correct_option': options.get(correct_option, '')
        }
        
    # Method to clear question history if needed
    def reset_question_history(self):
        self.question_hashes = set()