import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Star, Book, Trophy, Zap, MapPin, User, Bookmark, Clock, Award, Check } from 'lucide-react';

const RoadMap = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [activeNode, setActiveNode] = useState(null);
  const [completedNodes, setCompletedNodes] = useState({
    math: [1, 2, 3, 4, 5, 6], // Nodes 1-6 completed
    physics: [1, 2, 3, 4, 5, 6], // Nodes 1-6 completed
    chemistry: [1, 2, 3, 4, 5, 6] // Nodes 1-6 completed
  });
  const [currentPosition, setCurrentPosition] = useState({
    math: 7, // First unmarked node is 7
    physics: 7, // First unmarked node is 7
    chemistry: 7 // First unmarked node is 7
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeSubject, setActiveSubject] = useState('math');

  // Subject themes with colors
  const subjects = {
    physics: { color: 'bg-blue-500', pathColor: '#3b82f6', icon: '⚛️' },
    chemistry: { color: 'bg-green-500', pathColor: '#22c55e', icon: '🧪' },
    math: { color: 'bg-purple-500', pathColor: '#a855f7', icon: '📊' }
  };

  // Mock curriculum data for Physics, Chemistry, and Math
  const allNodes = {
    math: [
      { id: 1, title: "Rational Numbers", x: 150, y: 200, difficulty: "Grade 8", time: "2 weeks", complete: true, emoji: "➗" },
      { id: 2, title: "Linear Equations", x: 300, y: 150, difficulty: "Grade 8", time: "3 weeks", complete: true, emoji: "📈" },
      { id: 3, title: "Quadratic Expressions", x: 450, y: 200, difficulty: "Grade 8", time: "3 weeks", complete: true, emoji: "🔢" },
      { id: 4, title: "Geometry & Mensuration", x: 600, y: 150, difficulty: "Grade 8", time: "3 weeks", complete: true, emoji: "📐" },
      { id: 5, title: "Data Handling", x: 750, y: 200, difficulty: "Grade 8-9", time: "2 weeks", complete: true, emoji: "📊" },
      { id: 6, title: "Coordinate Geometry", x: 900, y: 150, difficulty: "Grade 9", time: "2 weeks", complete: true, emoji: "📍" },
      { id: 7, title: "Algebraic Identities", x: 1050, y: 200, difficulty: "Grade 9", time: "3 weeks", complete: false, locked: false, emoji: "🧮" },
      { id: 8, title: "Trigonometry", x: 1200, y: 150, difficulty: "Grade 10", time: "4 weeks", complete: false, locked: false, emoji: "📏" },
      { id: 9, title: "Probability", x: 1350, y: 200, difficulty: "Grade 10", time: "3 weeks", complete: false, locked: false, emoji: "🎲" },
      { id: 10, title: "Statistics", x: 1500, y: 150, difficulty: "Grade 10", time: "3 weeks", complete: false, locked: false, emoji: "📊" },
      { id: 11, title: "Calculus Basics", x: 1650, y: 200, difficulty: "Grade 11", time: "5 weeks", complete: false, locked: false, emoji: "📚" },
      { id: 12, title: "Vectors", x: 1800, y: 150, difficulty: "Grade 11", time: "4 weeks", complete: false, locked: false, emoji: "➡️" },
      { id: 13, title: "Matrices", x: 1950, y: 200, difficulty: "Grade 12", time: "4 weeks", complete: false, locked: false, emoji: "🔲" }
    ],
    physics: [
      { id: 1, title: "Motion & Forces", x: 150, y: 200, difficulty: "Grade 8", time: "3 weeks", complete: true, emoji: "🚀" },
      { id: 2, title: "Energy & Work", x: 300, y: 150, difficulty: "Grade 8", time: "2 weeks", complete: true, emoji: "⚡" },
      { id: 3, title: "Simple Machines", x: 450, y: 200, difficulty: "Grade 8", time: "3 weeks", complete: true, emoji: "⚙️" },
      { id: 4, title: "Sound & Waves", x: 600, y: 150, difficulty: "Grade 8-9", time: "2 weeks", complete: true, emoji: "🔊" },
      { id: 5, title: "Light & Optics", x: 750, y: 200, difficulty: "Grade 9", time: "3 weeks", complete: true, emoji: "🔆" },
      { id: 6, title: "Electricity", x: 900, y: 150, difficulty: "Grade 9", time: "4 weeks", complete: true, emoji: "⚡" },
      { id: 7, title: "Magnetism", x: 1050, y: 200, difficulty: "Grade 10", time: "3 weeks", complete: false, locked: false, emoji: "🧲" },
      { id: 8, title: "Thermodynamics", x: 1200, y: 150, difficulty: "Grade 10", time: "4 weeks", complete: false, locked: false, emoji: "🌡️" },
      { id: 9, title: "Nuclear Physics", x: 1350, y: 200, difficulty: "Grade 11", time: "5 weeks", complete: false, locked: false, emoji: "☢️" },
      { id: 10, title: "Quantum Mechanics", x: 1500, y: 150, difficulty: "Grade 12", time: "6 weeks", complete: false, locked: false, emoji: "⚛️" },
      { id: 11, title: "Relativity", x: 1650, y: 200, difficulty: "Grade 12", time: "5 weeks", complete: false, locked: false, emoji: "⏳" },
      { id: 12, title: "Astrophysics", x: 1800, y: 150, difficulty: "Grade 12", time: "4 weeks", complete: false, locked: false, emoji: "🌌" }
    ],
    chemistry: [
      { id: 1, title: "Matter & Properties", x: 150, y: 200, difficulty: "Grade 8", time: "2 weeks", complete: true, emoji: "🧱" },
      { id: 2, title: "Atoms & Elements", x: 300, y: 150, difficulty: "Grade 8", time: "3 weeks", complete: true, emoji: "⚛️" },
      { id: 3, title: "Periodic Table", x: 450, y: 200, difficulty: "Grade 8", time: "3 weeks", complete: true, emoji: "📋" },
      { id: 4, title: "Chemical Bonding", x: 600, y: 150, difficulty: "Grade 9", time: "3 weeks", complete: true, emoji: "🔗" },
      { id: 5, title: "Chemical Reactions", x: 750, y: 200, difficulty: "Grade 9", time: "4 weeks", complete: true, emoji: "💥" },
      { id: 6, title: "Acids & Bases", x: 900, y: 150, difficulty: "Grade 9", time: "3 weeks", complete: true, emoji: "🧪" },
      { id: 7, title: "Organic Chemistry", x: 1050, y: 200, difficulty: "Grade 10", time: "5 weeks", complete: false, locked: false, emoji: "🧬" },
      { id: 8, title: "Electrochemistry", x: 1200, y: 150, difficulty: "Grade 11", time: "4 weeks", complete: false, locked: false, emoji: "🔋" },
      { id: 9, title: "Chemical Kinetics", x: 1350, y: 200, difficulty: "Grade 11", time: "4 weeks", complete: false, locked: false, emoji: "⏱️" },
      { id: 10, title: "Thermodynamics", x: 1500, y: 150, difficulty: "Grade 12", time: "5 weeks", complete: false, locked: false, emoji: "🌡️" },
      { id: 11, title: "Biochemistry", x: 1650, y: 200, difficulty: "Grade 12", time: "6 weeks", complete: false, locked: false, emoji: "🧫" },
      { id: 12, title: "Environmental Chemistry", x: 1800, y: 150, difficulty: "Grade 12", time: "4 weeks", complete: false, locked: true, emoji: "🌍" }
    ]
  };

  // Find the next node after the current one
  const findNextNode = (currentId, subjectNodes) => {
    const currentIndex = subjectNodes.findIndex(node => node.id === currentId);
    if (currentIndex < subjectNodes.length - 1) {
      return subjectNodes[currentIndex + 1].id;
    }
    return currentId; // Stay at current node if there's no next node
  };

  // Toggle completed status of a node and move character to next node ONLY in the current subject
  const toggleNodeComplete = (id) => {
    const currentSubject = activeSubject;

    if (completedNodes[currentSubject].includes(id)) {
      // Mark as incomplete
      setCompletedNodes({
        ...completedNodes,
        [currentSubject]: completedNodes[currentSubject].filter(nodeId => nodeId !== id)
      });
    } else {
      // Mark as complete
      setCompletedNodes({
        ...completedNodes,
        [currentSubject]: [...completedNodes[currentSubject], id]
      });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Update ONLY the current subject's position when completing a node
      if (id === currentPosition[currentSubject]) {
        const nextNodeId = findNextNode(id, allNodes[currentSubject]);

        // Only advance the current subject
        setCurrentPosition({
          ...currentPosition,
          [currentSubject]: nextNodeId
        });
      }
    }

    // Close popup after marking complete/incomplete
    setShowPopup(false);
  };

  // Show node details in popup
  const handleNodeClick = (node) => {
    setActiveNode(node);
    setPopupContent(node);
    setShowPopup(true);
  };

  // Handle map dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setMapOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handling
  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  // Get nodes for current subject
  const nodes = allNodes[activeSubject];

  // Path connections between nodes
  const renderPaths = () => {
    return nodes.map((node, index) => {
      if (index === 0) return null;

      const prevNode = nodes[index - 1];
      const isCompletedPath = completedNodes[activeSubject].includes(prevNode.id) && completedNodes[activeSubject].includes(node.id);
      const isActivePath = (completedNodes[activeSubject].includes(prevNode.id) && currentPosition[activeSubject] === node.id);

      let pathStyle = "stroke-2 stroke-dashed";
      if (isCompletedPath) pathStyle = "stroke-4";
      if (isActivePath) pathStyle = "stroke-4 stroke-dashed animate-pulse";

      return (
        <svg key={`path-${index}`} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <path
            d={`M ${prevNode.x} ${prevNode.y} Q ${(prevNode.x + node.x)/2} ${prevNode.y > node.y ? prevNode.y - 50 : prevNode.y + 50}, ${node.x} ${node.y}`}
            fill="none"
            stroke={subjects[activeSubject].pathColor}
            strokeWidth={isCompletedPath || isActivePath ? 8 : 5}
            strokeDasharray={isActivePath ? "15,15" : isCompletedPath ? "none" : "10,10"}
            opacity={node.locked ? 0.3 : 0.8}
          />
        </svg>
      );
    });
  };

  // Render subject-specific character avatars
  const renderCharacterAvatars = () => {
    const characters = {
      math: "👧", // Girl for math
      physics: "🧒", // Boy for physics
      chemistry: "🧑‍🔬" // Scientist for chemistry
    };

    // Find the first unmarked node
    const firstUnmarkedNode = nodes.find(node => !completedNodes[activeSubject].includes(node.id));

    if (!firstUnmarkedNode) return null;

    return (
      <div 
        className="absolute w-16 h-16 transition-all duration-500 z-20"
        style={{ 
          left: `${firstUnmarkedNode.x * zoomLevel + mapOffset.x - 32}px`, 
          top: `${firstUnmarkedNode.y * zoomLevel + mapOffset.y - 32}px` 
        }}
      >
        <div className="w-full h-full bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
          <span className="text-2xl">{characters[activeSubject]}</span>
        </div>
      </div>
    );
  };

  // Function to handle "Start Learning" button click
  const handleStartLearning = () => {
    navigate('/core_learning'); // Redirect to the next page
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-4 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-3">
          <MapPin size={28} className="text-yellow-300" />
          <h1 className="text-2xl font-bold">Learning Adventure Map</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-300" />
            <span className="font-bold">
              {Object.values(completedNodes).reduce((sum, arr) => sum + arr.length, 0)} Completed
            </span>
          </div>

          {/* <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-1">
            <User size={20} />
            <span>Explorer Jenny</span>
          </div> */}
        </div>
      </div>

      {/* Subject Navigation Tabs */}
      <div className="flex justify-center gap-2 p-2 bg-white shadow-md z-10">
        {Object.entries(subjects).map(([key, subject]) => (
          <button
            key={key}
            className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-all ${
              activeSubject === key 
                ? `${subject.color} text-white shadow-md scale-105` 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveSubject(key)}
          >
            <span>{subject.icon}</span>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Map Area */}
      <div 
        className="relative flex-grow overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Map container with pan and zoom */}
        <div 
          className="absolute w-full h-full transition-transform duration-100 ease-out"
          style={{ 
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 w-[2000px] h-[1000px]" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }}>
          </div>

          {/* Path connections */}
          {renderPaths()}

          {/* Nodes */}
          {nodes.map(node => {
            const isCompleted = completedNodes[activeSubject].includes(node.id);
            const isCurrent = currentPosition[activeSubject] === node.id;

            let nodeClasses = "absolute flex flex-col items-center justify-center transition-all duration-300";
            if (isCompleted) nodeClasses += " opacity-100";
            else if (node.locked) nodeClasses += " opacity-50";
            else nodeClasses += " opacity-90";

            if (isCurrent) nodeClasses += " animate-pulse";

            return (
              <div 
                key={node.id}
                className={nodeClasses}
                style={{ 
                  left: `${node.x}px`, 
                  top: `${node.y}px`,
                  zIndex: activeNode?.id === node.id ? 50 : 10
                }}
                onClick={() => !node.locked && handleNodeClick(node)}
              >
                {/* Node main circle */}
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center
                  ${isCurrent ? 'ring-4 ring-yellow-400 ring-offset-4 animate-pulse' : ''}
                  ${node.locked 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : isCompleted 
                      ? `${subjects[activeSubject].color} cursor-pointer hover:scale-110` 
                      : `bg-white border-4 border-${subjects[activeSubject].color.split('-')[1]}-400 cursor-pointer hover:scale-110`}
                  shadow-lg transition-all
                `}>
                  {node.locked ? (
                    <Clock size={30} className="text-gray-500" />
                  ) : isCompleted ? (
                    <Check size={30} className="text-white" />
                  ) : (
                    <span className="text-3xl">{node.emoji}</span>
                  )}
                </div>

                {/* Node title */}
                <div className={`
                  mt-2 px-3 py-1 rounded-full text-center font-bold shadow-md
                  ${isCompleted 
                    ? `${subjects[activeSubject].color} text-white` 
                    : 'bg-white text-gray-800'}
                `}>
                  {node.title}
                </div>

                {/* Grade level badge */}
                <div className="mt-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  {node.difficulty}
                </div>
              </div>
            );
          })}

          {/* Subject-specific character avatars */}
          {renderCharacterAvatars()}

          {/* Confetti effect on completion */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-50">
              {Array.from({ length: 50 }).map((_, i) => {
                const size = Math.random() * 12 + 5;
                const color = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][Math.floor(Math.random() * 5)];
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 3 + 2;

                return (
                  <div 
                    key={i}
                    className={`absolute ${color} rounded-md animate-confetti`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${left}%`,
                      top: '-20px',
                      animationDuration: `${animationDuration}s`,
                      animationDelay: `${Math.random() * 0.5}s`
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 bg-white rounded-full shadow-lg flex flex-col p-1 z-30">
        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={handleZoomIn}>
          <Zap size={20} className="text-blue-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={handleZoomReset}>
          <MapPin size={20} className="text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={handleZoomOut}>
          <Zap size={20} className="text-blue-500 transform rotate-180" />
        </button>
      </div>

      {/* Node details popup */}
      {showPopup && popupContent && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40" onClick={() => setShowPopup(false)}>
          <div 
            className="bg-white rounded-2xl p-6 w-96 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full ${subjects[activeSubject].color} flex items-center justify-center`}>
                <span className="text-3xl">{popupContent.emoji}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{popupContent.title}</h2>
                <p className="text-gray-600">{popupContent.difficulty}</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <Clock size={16} />
                <span>{popupContent.time}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <Star size={16} />
                <span>15 XP</span>
              </div>
            </div>

            <p className="mb-4 text-gray-700">
              Master the concepts of {popupContent.title.toLowerCase()} through interactive lessons, games, and quizzes!
            </p>

            <div className="bg-gray-100 p-3 rounded-xl mb-4">
              <h3 className="font-bold mb-2">What you'll learn:</h3>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Core concepts of {popupContent.title}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Practical applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Problem-solving techniques</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-bold transition-colors"
                onClick={handleStartLearning} // Add onClick handler
              >
                Start Learning
              </button>
              {!popupContent.locked && (
                <button 
                  className={`flex-1 ${
                    completedNodes[activeSubject].includes(popupContent.id)
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } py-3 px-4 rounded-xl font-bold transition-colors`}
                  onClick={() => toggleNodeComplete(popupContent.id)}
                >
                  {completedNodes[activeSubject].includes(popupContent.id) ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress sidebar - moved to bottom left */}
      <div className="absolute left-4 bottom-4 bg-white rounded-2xl shadow-lg p-4 w-64 z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Your Progress</h2>
          <Award size={24} className="text-yellow-500" />
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Level 5</span>
            <span className="text-sm text-gray-600">750/1000 XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(subjects).map(([key, subject]) => {
            const subjectNodes = allNodes[key];
            const completed = completedNodes[key].length;
            const total = subjectNodes.length;
            const percent = Math.round((completed / total) * 100);

            return (
              <div key={key} className="bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{subject.icon}</span>
                    <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                  <span className="text-sm text-gray-600">{completed}/{total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`bg-${subject.color.split('-')[1]}-500 h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current streak</span>
            <div className="flex items-center gap-1">
              <Zap size={16} className="text-orange-500" />
              <span className="font-bold">5 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;