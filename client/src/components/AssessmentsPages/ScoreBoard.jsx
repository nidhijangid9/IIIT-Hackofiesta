// src/components/ScoreBoard.jsx
const ScoreBoard = ({ score, difficulty, streak }) => {
    const getDifficultyColor = (diff) => {
      const colors = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        hard: 'bg-red-100 text-red-800'
      };
      return colors[diff] || 'bg-gray-100 text-gray-800';
    };
  
    return (
      <div className="bg-white rounded-lg shadow p-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-2xl font-bold text-blue-600">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Difficulty</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Streak</p>
          <div className="flex items-center justify-center">
            <p className="text-2xl font-bold text-orange-500">{streak}</p>
            {streak >= 3 && <span className="ml-1 text-2xl">🔥</span>}
          </div>
        </div>
      </div>
    );
  };
  
  export default ScoreBoard;