// src/components/QuestionCard.jsx
const QuestionCard = ({ question, selectedOption, onOptionSelect }) => {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-slide-in">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {question.text}
        </h2>
        <div className="space-y-3">
          {['option1', 'option2', 'option3', 'option4'].map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${selectedOption === question[option] ? 'selected' : ''}`}
              onClick={() => onOptionSelect(question[option])}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {question[option]}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default QuestionCard;