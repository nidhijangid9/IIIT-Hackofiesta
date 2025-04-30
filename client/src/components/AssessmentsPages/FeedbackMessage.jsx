// src/components/FeedbackMessage.jsx
const FeedbackMessage = ({ feedback }) => {
    const baseClasses = "mt-4 p-4 rounded-lg text-center animate-fade-in";
    const colorClasses = feedback.isCorrect
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  
    return (
      <div className={`${baseClasses} ${colorClasses}`}>
        {feedback.isCorrect ? (
          <div className="flex items-center justify-center">
            <span className="text-xl mr-2">✅</span>
            <span>Correct!</span>
          </div>
        ) : (
          <div>
            <span className="text-xl mr-2">❌</span>
            <span>Incorrect. The correct answer was: </span>
            <span className="font-medium">{feedback.correctAnswer}</span>
          </div>
        )}
      </div>
    );
  };
  
  export default FeedbackMessage;