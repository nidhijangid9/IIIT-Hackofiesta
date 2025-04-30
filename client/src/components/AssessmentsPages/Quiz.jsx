// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';

// const QuizComponent = () => {
//     const [currentQuestion, setCurrentQuestion] = useState(null);
//     const [score, setScore] = useState(0);
//     const [totalQuestions, setTotalQuestions] = useState(10);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [quizCompleted, setQuizCompleted] = useState(false);
//     const [difficulty, setDifficulty] = useState('easy');
//     const [loading, setLoading] = useState(false);

//     // API Endpoint
//     const API_ENDPOINT = 'http://127.0.0.1:8000/quiz/generate-question/';

//     const difficultyStyles = {
//         easy: {
//             badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
//             text: 'EASY'
//         },
//         medium: {
//             badge: 'bg-amber-100 text-amber-800 border border-amber-200',
//             text: 'MEDIUM'
//         },
//         hard: { 
//             badge: 'bg-red-100 text-red-800 border border-red-200',
//             text: 'HARD'
//         }
//     };

//     // Fetch Dynamic Question
//     const fetchDynamicQuestion = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(API_ENDPOINT, {
//                 params: {
//                     score: score,
//                     total_questions: totalQuestions
//                 }
//             });

//             setCurrentQuestion(response.data);
//             setDifficulty(response.data.current_difficulty);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching question:', error);
//             setLoading(false);
//         }
//     };

//     // Initial and Subsequent Question Fetching
//     useEffect(() => {
//         if (currentQuestionIndex < totalQuestions) {
//             fetchDynamicQuestion();
//         } else {
//             setQuizCompleted(true);
//         }
//     }, [currentQuestionIndex]);

//     // Answer Submission Handler
//     const handleAnswerSubmit = () => {
//         if (!selectedOption) return;

//         // Check if answer is correct
//         const isCorrect = selectedOption === currentQuestion.correct_option;

//         if (isCorrect) {
//             setScore(prevScore => prevScore + 1);
//         }

//         // Move to next question
//         setCurrentQuestionIndex(prev => prev + 1);
//         setSelectedOption(null);
//     };

//     // Option Selection
//     const handleOptionSelect = (option) => {
//         setSelectedOption(option);
//     };

//     // Quiz Restart
//     const restartQuiz = () => {
//         setScore(0);
//         setCurrentQuestionIndex(0);
//         setQuizCompleted(false);
//         setSelectedOption(null);
//     };

//     // Performance Analysis
//     const performanceAnalysis = useMemo(() => {
//         const percentage = (score / totalQuestions) * 100;
//         if (percentage < 30) return 'Beginner 🌱';
//         if (percentage < 60) return 'Intermediate 🚀';
//         if (percentage < 80) return 'Advanced 🏆';
//         return 'Expert 🌟';
//     }, [score, totalQuestions]);

//     // Updated Loading Component
//     const renderLoading = () => (
//         <div className="flex flex-col items-center justify-center h-screen space-y-4">
//             <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             <p className="text-gray-600 font-medium">Loading question...</p>
//         </div>
//     );

//     // Updated Question Card
//     const renderQuestionCard = () => (
//         <div className="max-w-3xl mx-auto">
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                 {/* Header Section */}
//                 <div className="p-6 border-b border-gray-100">
//                     <div className="flex items-center justify-between mb-4">
//                         <span className={`px-4 py-1 rounded-full text-sm font-medium ${difficultyStyles[difficulty].badge}`}>
//                             {difficultyStyles[difficulty].text}
//                         </span>
//                         <span className="text-sm text-gray-500 font-medium">
//                             Question {currentQuestionIndex + 1} of {totalQuestions}
//                         </span>
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-800 leading-tight">
//                         {currentQuestion.text}
//                     </h2>
//                 </div>

//                 {/* Options Section */}
//                 <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {['option1', 'option2', 'option3', 'option4'].map((optionKey) => (
//                             <button
//                                 key={optionKey}
//                                 onClick={() => handleOptionSelect(currentQuestion[optionKey])}
//                                 className={`
//                                     p-4 rounded-xl text-left transition-all duration-200
//                                     ${selectedOption === currentQuestion[optionKey]
//                                         ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
//                                         : 'bg-gray-50 border-2 border-gray-100 hover:border-gray-200 text-gray-700'}
//                                     font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
//                                 `}
//                             >
//                                 {currentQuestion[optionKey]}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         onClick={handleAnswerSubmit}
//                         disabled={!selectedOption}
//                         className={`
//                             w-full mt-6 py-4 rounded-xl font-semibold text-white transition-all duration-200
//                             ${selectedOption
//                                 ? 'bg-blue-600 hover:bg-blue-700'
//                                 : 'bg-gray-300 cursor-not-allowed'}
//                         `}
//                     >
//                         Submit Answer
//                     </button>
//                 </div>

//                 {/* Footer Section */}
//                 <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                             <span className="text-lg font-semibold text-gray-700">Score:</span>
//                             <span className="text-2xl font-bold text-blue-600">{score}</span>
//                             <span className="text-gray-500">/ {totalQuestions}</span>
//                         </div>
//                         <div className="text-sm text-gray-500">
//                             {Math.round((score / totalQuestions) * 100)}% completed
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     // Updated Quiz Completed Screen
//     const renderQuizCompletedScreen = () => (
//         <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="p-8 text-center">
//                 <div className="mb-6">
//                     <span className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
//                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                     </span>
//                     <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
//                     <p className="text-gray-600">Great job on completing the quiz</p>
//                 </div>

//                 <div className="mb-8">
//                     <div className="text-4xl font-bold text-blue-600 mb-2">
//                         {score} / {totalQuestions}
//                     </div>
//                     <div className="text-xl font-medium text-gray-600">
//                         {performanceAnalysis}
//                     </div>
//                 </div>

//                 <div className="space-y-4">
//                     <button
//                         onClick={restartQuiz}
//                         className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
//                     >
//                         Restart Quiz
//                     </button>
//                     <button
//                         className="w-full py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors duration-200"
//                     >
//                         View Detailed Results
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );

//     // Main Render
//     return (
//         <div className="min-h-screen bg-quiz-background flex items-center justify-center p-4">
//             <div className="w-full">
//                 {loading ? renderLoading() : (
//                     !quizCompleted && currentQuestion
//                         ? renderQuestionCard()
//                         : renderQuizCompletedScreen()
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QuizComponent;
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const QuizComponent = () => {
    // State Management
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [difficulty, setDifficulty] = useState('easy');
    const [loading, setLoading] = useState(false);
    
    // New state variables for tracking
    const [startTime, setStartTime] = useState(null);
    const [easyQuestionsAnswered, setEasyQuestionsAnswered] = useState(0);
    const [mediumQuestionsAnswered, setMediumQuestionsAnswered] = useState(0);
    const [hardQuestionsAnswered, setHardQuestionsAnswered] = useState(0);
    const [quizResultSaved, setQuizResultSaved] = useState(false);
    const [timeTaken, setTimeTaken] = useState(0);

    // API Endpoints
    const API_ENDPOINT = 'http://127.0.0.1:8000/quiz/generate-question/';
    const RESULT_ENDPOINT = 'http://127.0.0.1:8000/quiz/submit-quiz-result/';

    // Updated Difficulty Color Mapping
    const difficultyStyles = {
        easy: {
            badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
            text: 'EASY'
        },
        medium: {
            badge: 'bg-amber-100 text-amber-800 border border-amber-200',
            text: 'MEDIUM'
        },
        hard: {
            badge: 'bg-red-100 text-red-800 border border-red-200',
            text: 'HARD'
        }
    };

    // Start timer when quiz starts
    useEffect(() => {
        if (currentQuestionIndex === 0 && !startTime) {
            setStartTime(Date.now());
        }
    }, [currentQuestionIndex, startTime]);

    // Fetch Dynamic Question
    const fetchDynamicQuestion = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINT, {
                params: {
                    score: score,
                    total_questions: totalQuestions
                }
            });

            setCurrentQuestion(response.data);
            setDifficulty(response.data.current_difficulty);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching question:', error);
            setLoading(false);
        }
    };

    // Initial and Subsequent Question Fetching
    useEffect(() => {
        if (currentQuestionIndex < totalQuestions) {
            fetchDynamicQuestion();
        } else {
            setQuizCompleted(true);
            // Calculate time taken when quiz is completed
            if (startTime) {
                const endTime = Date.now();
                const totalSeconds = Math.floor((endTime - startTime) / 1000);
                setTimeTaken(totalSeconds);
            }
        }
    }, [currentQuestionIndex]);

    // Save quiz results when completed
    useEffect(() => {
        const saveQuizResults = async () => {
            if (quizCompleted && !quizResultSaved) {
                try {
                    const response = await axios.post(RESULT_ENDPOINT, {
                        score: score,
                        total_questions: totalQuestions,
                        easy_questions_answered: easyQuestionsAnswered,
                        medium_questions_answered: mediumQuestionsAnswered,
                        hard_questions_answered: hardQuestionsAnswered,
                        time_taken_seconds: timeTaken
                    });
                    
                    setQuizResultSaved(true);
                    console.log('Quiz results saved:', response.data);
                } catch (error) {
                    console.error('Error saving quiz results:', error);
                }
            }
        };
        
        saveQuizResults();
    }, [quizCompleted, quizResultSaved, timeTaken]);

    // Answer Submission Handler
    const handleAnswerSubmit = () => {
        if (!selectedOption) return;

        // Check if answer is correct
        const isCorrect = selectedOption === currentQuestion.correct_option;

        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        // Track question difficulty
        if (currentQuestion.difficulty === 'easy') {
            setEasyQuestionsAnswered(prev => prev + 1);
        } else if (currentQuestion.difficulty === 'medium') {
            setMediumQuestionsAnswered(prev => prev + 1);
        } else if (currentQuestion.difficulty === 'hard') {
            setHardQuestionsAnswered(prev => prev + 1);
        }

        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
    };

    // Option Selection
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    // Quiz Restart
    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        setSelectedOption(null);
        setStartTime(Date.now());
        setEasyQuestionsAnswered(0);
        setMediumQuestionsAnswered(0);
        setHardQuestionsAnswered(0);
        setQuizResultSaved(false);
        setTimeTaken(0);
    };

    // Performance Analysis
    const performanceAnalysis = useMemo(() => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage < 30) return 'Beginner 🌱';
        if (percentage < 60) return 'Intermediate 🚀';
        if (percentage < 80) return 'Advanced 🏆';
        return 'Expert 🌟';
    }, [score, totalQuestions]);

    // Format time function
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    // Updated Loading Component
    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading question...</p>
        </div>
    );

    // Updated Question Card
    const renderQuestionCard = () => (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${difficultyStyles[difficulty].badge}`}>
                            {difficultyStyles[difficulty].text}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                        {currentQuestion.text}
                    </h2>
                </div>

                {/* Options Section */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['option1', 'option2', 'option3', 'option4'].map((optionKey) => (
                            <button
                                key={optionKey}
                                onClick={() => handleOptionSelect(currentQuestion[optionKey])}
                                className={`
                                    p-4 rounded-xl text-left transition-all duration-200
                                    ${selectedOption === currentQuestion[optionKey]
                                        ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                                        : 'bg-gray-50 border-2 border-gray-100 hover:border-gray-200 text-gray-700'}
                                    font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                `}
                            >
                                {currentQuestion[optionKey]}
                            </button>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleAnswerSubmit}
                        disabled={!selectedOption}
                        className={`
                            w-full mt-6 py-4 rounded-xl font-semibold text-white transition-all duration-200
                            ${selectedOption
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-300 cursor-not-allowed'}
                        `}
                    >
                        Submit Answer
                    </button>
                </div>

                {/* Footer Section */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-700">Score:</span>
                            <span className="text-2xl font-bold text-blue-600">{score}</span>
                            <span className="text-gray-500">/ {totalQuestions}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {Math.round((score / totalQuestions) * 100)}% completed
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Updated Quiz Completed Screen
    const renderQuizCompletedScreen = () => (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
                <div className="mb-6">
                    <span className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-600">Great job on completing the quiz</p>
                </div>

                <div className="mb-8">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                        {score} / {totalQuestions}
                    </div>
                    <div className="text-xl font-medium text-gray-600 mb-4">
                        {performanceAnalysis}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-700 mb-2">Quiz Statistics</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-left text-gray-600">Time Taken:</div>
                            <div className="text-right font-medium">{formatTime(timeTaken)}</div>
                            
                            <div className="text-left text-gray-600">Easy Questions:</div>
                            <div className="text-right font-medium">{easyQuestionsAnswered}</div>
                            
                            <div className="text-left text-gray-600">Medium Questions:</div>
                            <div className="text-right font-medium">{mediumQuestionsAnswered}</div>
                            
                            <div className="text-left text-gray-600">Hard Questions:</div>
                            <div className="text-right font-medium">{hardQuestionsAnswered}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={restartQuiz}
                        className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                        Restart Quiz
                    </button>
                    <button
                        className="w-full py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors duration-200"
                    >
                        View Detailed Results
                    </button>
                </div>
                
                {quizResultSaved && (
                    <div className="mt-4 text-sm text-green-600">
                        Your results have been saved!
                    </div>
                )}
            </div>
        </div>
    );

    // Main Render
    return (
        <div className="min-h-screen bg-quiz-background flex items-center justify-center p-4">
            <div className="w-full">
                {loading ? renderLoading() : (
                    !quizCompleted && currentQuestion
                        ? renderQuestionCard()
                        : renderQuizCompletedScreen()
                )}
            </div>
        </div>
    );
};

export default QuizComponent;