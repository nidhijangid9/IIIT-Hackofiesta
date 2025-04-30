import google.generativeai as genai
import os
from mcq.models import Question
import random

# Set up the API key
GEMINI_API_KEY = 'AIzaSyCPw7AdBH_qMIZdIdwoOsgNpfYPw47IBeY'  # Replace with actual key
genai.configure(api_key=GEMINI_API_KEY)

def get_difficulty_display(difficulty):
    """
    Returns a formatted string of the difficulty level.
    """
    difficulty_map = {
        'easy': '🟢 Easy',
        'medium': '🟡 Medium',
        'hard': '🔴 Hard'
    }
    return difficulty_map.get(difficulty, difficulty.title())

def generate_mcq(difficulty="easy"):
    """
    Generates an MCQ question using Google Gemini API with clear structure and correct answer tracking.
    
    Args:
        difficulty (str): Difficulty level of the question ("easy", "medium", "hard")
    
    Returns:
        Question: Created Question object or None if generation fails
    """
    if difficulty not in dict(Question.DIFFICULTY_LEVELS):
        raise ValueError(f"Invalid difficulty level. Choose from: {', '.join(dict(Question.DIFFICULTY_LEVELS).keys())}")

    prompt = f"""Generate a {difficulty} level multiple-choice question on 10th std Physics.
    Follow this exact format in your response:
    Q: [Your question here]
    A) [First option]
    B) [Second option]
    C) [Third option]
    D) [Fourth option]
    CORRECT: [Write the letter (A/B/C/D) of the correct answer]
    
    Make sure all options are reasonable and the correct answer is clearly marked."""

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        content = response.text.split('\n')
        
        # Parse the response
        question_text = content[0].replace('Q: ', '').strip()
        options = []
        correct_letter = None
        
        # Extract options and correct answer
        for line in content[1:]:
            line = line.strip()
            if line.startswith(('A)', 'B)', 'C)', 'D)')):
                options.append(line[3:].strip())  # Remove the prefix (e.g., "A) ")
            elif line.startswith('CORRECT:'):
                correct_letter = line.replace('CORRECT:', '').strip()
        
        if len(options) != 4 or not correct_letter:
            raise ValueError("Invalid response format")
            
        # Map correct letter to index (A=0, B=1, etc.)
        correct_index = ord(correct_letter) - ord('A')
        correct_answer = options[correct_index]
        
        # Store in database
        question = Question.objects.create(
            text=question_text,
            difficulty=difficulty,
            option1=options[0],
            option2=options[1],
            option3=options[2],
            option4=options[3],
            correct_option=correct_answer
        )
        
        return question
        
    except Exception as e:
        print(f"Error generating question: {str(e)}")
        return None

def display_question(question):
    """
    Displays a formatted version of the question with difficulty level.
    
    Args:
        question: Question object to display
    """
    if not question:
        print("No question to display")
        return

    print("\n" + "="*50)
    print(f"Difficulty: {get_difficulty_display(question.difficulty)}")
    print("="*50)
    print(f"\nQuestion: {question.text}\n")
    print("Options:")
    print(f"A) {question.option1}")
    print(f"B) {question.option2}")
    print(f"C) {question.option3}")
    print(f"D) {question.option4}")
    print("\n" + "-"*50)
    print(f"Correct Answer: {question.correct_option}")
    print("-"*50 + "\n")

# Example usage
if __name__ == "__main__":
    for difficulty in ['easy', 'medium', 'hard']:
        question = generate_mcq(difficulty=difficulty)
        if question:
            display_question(question)