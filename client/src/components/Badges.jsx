// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const Badges = () => {
//   // Sample data for the quiz performance
//   const [quizData] = useState([
//     { day: 'Mon', quizzes: 3, score: 85 },
//     { day: 'Tue', quizzes: 5, score: 92 },
//     { day: 'Wed', quizzes: 4, score: 78 },
//     { day: 'Thu', quizzes: 7, score: 95 },
//     { day: 'Fri', quizzes: 6, score: 88 },
//     { day: 'Sat', quizzes: 8, score: 97 },
//     { day: 'Sun', quizzes: 5, score: 91 },
//   ]);

//   // Calculate if the user is a top performer (e.g., average score > 90)
//   const averageScore = quizData.reduce((sum, day) => sum + day.score, 0) / quizData.length;
//   const isTopPerformer = averageScore > 90;
//   const totalQuizzes = quizData.reduce((sum, day) => sum + day.quizzes, 0);

//   return (
//     <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
//       <h1 className="text-2xl font-bold mb-6">Quiz Performance Dashboard</h1>
      
//       {/* Graph on the first line */}
//       <div className="w-full mb-8">
//         <h2 className="text-lg font-semibold mb-4">Quiz Activity</h2>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={quizData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//             <XAxis dataKey="day" stroke="#ccc" />
//             <YAxis stroke="#ccc" />
//             <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: 'none' }} />
//             <Line 
//               type="monotone" 
//               dataKey="quizzes" 
//               stroke="#a4d65e" 
//               strokeWidth={3} 
//               dot={{ r: 5, fill: '#a4d65e' }} 
//               activeDot={{ r: 8 }} 
//             />
//             <Line 
//               type="monotone" 
//               dataKey="score" 
//               stroke="#8884d8" 
//               strokeWidth={3} 
//               dot={{ r: 5, fill: '#8884d8' }} 
//               activeDot={{ r: 8 }} 
//             />
//           </LineChart>
//         </ResponsiveContainer>
        
//         <div className="mt-4 flex justify-center gap-8 text-sm">
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
//             <span>Quizzes Completed</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
//             <span>Score</span>
//           </div>
//         </div>
//       </div>
      
//       {/* Two badges on the second line */}
//       <div className="flex justify-center gap-16 w-full">
//         {/* Performance Badge */}
//         <div className="relative">
//           <div className="w-40 h-40">
//             <svg viewBox="0 0 100 100" className="w-full h-full">
//               {/* Outer hexagon */}
//               <path 
//                 d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
//                 fill="none" 
//                 stroke="#cccccc" 
//                 strokeWidth="3"
//               />
              
//               {/* Inner content - Green fill */}
//               <path 
//                 d="M50 10 L83.3 30 L83.3 70 L50 90 L16.7 70 L16.7 30 Z" 
//                 fill="#a4d65e" 
//               />
              
//               {/* Curved line */}
//               <path 
//                 d="M40 60 Q50 20, 70 50" 
//                 fill="none" 
//                 stroke="#999999" 
//                 strokeWidth="3"
//                 strokeLinecap="round"
//               />
              
//               {/* "DAYS" text */}
//               <text 
//                 x="50" 
//                 y="20" 
//                 textAnchor="middle" 
//                 fill="#ffffff" 
//                 fontWeight="bold"
//                 fontSize="8"
//               >
//                 DAYS
//               </text>
              
//               {/* Badge text - Top Performer instead of 50 */}
//               <text 
//                 x="50" 
//                 y="57" 
//                 textAnchor="middle" 
//                 fill="#333333" 
//                 fontWeight="bold"
//                 fontSize="10"
//               >
//                 TOP
//               </text>
              
//               <text 
//                 x="50" 
//                 y="67" 
//                 textAnchor="middle" 
//                 fill="#333333" 
//                 fontWeight="bold"
//                 fontSize="10"
//               >
//                 PERFORMER
//               </text>
              
//               {/* Stars */}
//               <circle cx="20" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="80" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="15" cy="75" r="1.5" fill="#ffffff" />
//               <circle cx="85" cy="85" r="1.5" fill="#ffffff" />
//             </svg>
//           </div>
          
//           {/* Additional stars */}
//           <div className="absolute -top-4 -right-4 text-white text-xl">✦</div>
//           <div className="absolute -bottom-2 -right-4 text-white text-xl">✦</div>
          
//           <div className="text-center mt-2">
//             <h3 className="text-lg font-semibold">Performance</h3>
//             <p className="text-green-400">{averageScore.toFixed(1)}% Average</p>
//           </div>
//         </div>
        
//         {/* Quiz Count Badge */}
//         <div className="relative">
//           <div className="w-40 h-40">
//             <svg viewBox="0 0 100 100" className="w-full h-full">
//               {/* Outer hexagon */}
//               <path 
//                 d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
//                 fill="none" 
//                 stroke="#cccccc" 
//                 strokeWidth="3"
//               />
              
//               {/* Inner content - Purple fill */}
//               <path 
//                 d="M50 10 L83.3 30 L83.3 70 L50 90 L16.7 70 L16.7 30 Z" 
//                 fill="#8884d8" 
//               />
              
//               {/* Curved line */}
//               <path 
//                 d="M40 60 Q50 20, 70 50" 
//                 fill="none" 
//                 stroke="#999999" 
//                 strokeWidth="3"
//                 strokeLinecap="round"
//               />
              
//               {/* "QUIZ" text */}
//               <text 
//                 x="50" 
//                 y="20" 
//                 textAnchor="middle" 
//                 fill="#ffffff" 
//                 fontWeight="bold"
//                 fontSize="8"
//               >
//                 QUIZ
//               </text>
              
//               {/* Badge text - Quiz count */}
//               <text 
//                 x="50" 
//                 y="65" 
//                 textAnchor="middle" 
//                 fill="#333333" 
//                 fontWeight="bold"
//                 fontSize="24"
//               >
//                 {totalQuizzes}
//               </text>
              
//               {/* Stars */}
//               <circle cx="20" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="80" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="15" cy="75" r="1.5" fill="#ffffff" />
//               <circle cx="85" cy="85" r="1.5" fill="#ffffff" />
//             </svg>
//           </div>
          
//           {/* Additional stars */}
//           <div className="absolute -top-4 -right-4 text-white text-xl">✦</div>
//           <div className="absolute -bottom-2 -right-4 text-white text-xl">✦</div>
          
//           <div className="text-center mt-2">
//             <h3 className="text-lg font-semibold">Total Quizzes</h3>
//             <p className="text-purple-400">Completed This Week</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Summary section */}
//       <div className="mt-8 w-full">
//         <div className="bg-gray-800 rounded-lg p-4">
//           <div className="flex justify-between">
//             <span>Status:</span>
//             <span className="font-semibold text-green-400">
//               {isTopPerformer ? 'Top Performer 🏆' : 'Regular Learner 📚'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Badges;
// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const Badges = () => {
//   // Sample data for the quiz performance
//   const [quizData] = useState([
//     { day: 'Mon', quizzes: 3, score: 85 },
//     { day: 'Tue', quizzes: 5, score: 92 },
//     { day: 'Wed', quizzes: 4, score: 78 },
//     { day: 'Thu', quizzes: 7, score: 95 },
//     { day: 'Fri', quizzes: 6, score: 88 },
//     { day: 'Sat', quizzes: 8, score: 97 },
//     { day: 'Sun', quizzes: 5, score: 91 },
//   ]);

//   // Calculate if the user is a top performer (e.g., average score > 90)
//   const averageScore = quizData.reduce((sum, day) => sum + day.score, 0) / quizData.length;
//   const isTopPerformer = averageScore > 90;
//   const totalQuizzes = quizData.reduce((sum, day) => sum + day.quizzes, 0);

//   return (
//     <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-8 bg-white text-gray-800 rounded-xl shadow-lg">
//       <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Quiz Performance Dashboard</h1>
      
//       {/* Graph on the first line */}
//       <div className="w-full mb-10 p-6 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
//         <h2 className="text-xl font-semibold mb-6 text-blue-800">Quiz Activity</h2>
//         <ResponsiveContainer width="100%" height={280}>
//           <LineChart data={quizData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//             <XAxis dataKey="day" stroke="#3b82f6" />
//             <YAxis stroke="#3b82f6" />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: '#ffffff', 
//                 border: 'none', 
//                 borderRadius: '8px', 
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
//               }} 
//             />
//             <Line 
//               type="monotone" 
//               dataKey="quizzes" 
//               stroke="#3b82f6" 
//               strokeWidth={3} 
//               dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
//               activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} 
//             />
//             <Line 
//               type="monotone" 
//               dataKey="score" 
//               stroke="#1d4ed8" 
//               strokeWidth={3} 
//               dot={{ r: 6, fill: '#1d4ed8', strokeWidth: 2, stroke: '#fff' }} 
//               activeDot={{ r: 8, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }} 
//             />
//           </LineChart>
//         </ResponsiveContainer>
        
//         <div className="mt-6 flex justify-center gap-12 text-sm">
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
//             <span className="text-blue-800 font-medium">Quizzes Completed</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 bg-blue-700 rounded-full mr-2"></div>
//             <span className="text-blue-800 font-medium">Score</span>
//           </div>
//         </div>
//       </div>
      
//       {/* Two badges on the second line */}
//       <div className="flex justify-center gap-16 w-full mb-10">
//         {/* Performance Badge */}
//         <div className="relative group transition-all duration-300 hover:scale-105">
//           <div className="w-48 h-48 filter drop-shadow-lg">
//             <svg viewBox="0 0 100 100" className="w-full h-full">
//               {/* Outer hexagon */}
//               <defs>
//                 <linearGradient id="darkGoldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#92400e" />
//                   <stop offset="50%" stopColor="#b45309" />
//                   <stop offset="100%" stopColor="#78350f" />
//                 </linearGradient>
//                 <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
//                   <feGaussianBlur stdDeviation="3" result="blur" />
//                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
//                 </filter>
//                 <radialGradient id="goldShine" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
//                   <stop offset="0%" stopColor="#fcd34d" />
//                   <stop offset="20%" stopColor="#d97706" stopOpacity="0.8" />
//                   <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
//                 </radialGradient>
//               </defs>
              
//               {/* Outer hexagon */}
//               <path 
//                 d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
//                 fill="white" 
//                 stroke="url(#darkGoldGradient1)" 
//                 strokeWidth="2"
//                 filter="url(#goldGlow)"
//               />
              
//               {/* Inner content - Dark Gold gradient fill */}
//               <path 
//                 d="M50 10 L83.3 30 L83.3 70 L50 90 L16.7 70 L16.7 30 Z" 
//                 fill="url(#darkGoldGradient1)" 
//               />
              
//               {/* Shine overlay */}
//               <circle cx="35" cy="30" r="30" fill="url(#goldShine)" opacity="0.6" />
              
//               {/* Curved line */}
//               <path 
//                 d="M40 60 Q50 20, 70 50" 
//                 fill="none" 
//                 stroke="rgba(255,255,255,0.8)" 
//                 strokeWidth="2"
//                 strokeLinecap="round"
//               />
              
//               {/* "DAYS" text */}
//               <text 
//                 x="50" 
//                 y="20" 
//                 textAnchor="middle" 
//                 fill="#ffffff" 
//                 fontWeight="bold"
//                 fontSize="8"
//               >
//                 DAYS
//               </text>
              
//               {/* Badge text - Top Performer */}
//               <text 
//                 x="50" 
//                 y="57" 
//                 textAnchor="middle" 
//                 fill="#ffffff" 
//                 fontWeight="bold"
//                 fontSize="10"
//               >
//                 TOP
//               </text>
              
//               <text 
//                 x="50" 
//                 y="67" 
//                 textAnchor="middle" 
//                 fill="#ffffff" 
//                 fontWeight="bold"
//                 fontSize="10"
//               >
//                 PERFORMER
//               </text>
              
//               {/* Stars */}
//               <circle cx="20" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="80" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="15" cy="75" r="1.5" fill="#ffffff" />
//               <circle cx="85" cy="85" r="1.5" fill="#ffffff" />
//             </svg>
//           </div>
          
//           {/* Animated stars */}
//           <div className="absolute -top-4 -right-4 text-blue-400 text-2xl animate-pulse">✦</div>
//           <div className="absolute -bottom-2 -right-4 text-blue-400 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
          
//           <div className="text-center mt-4">
//             <h3 className="text-xl font-bold text-blue-800">Performance</h3>
//             <p className="text-blue-600 font-semibold">{averageScore.toFixed(1)}% Average</p>
//           </div>
//         </div>
        
//         {/* Quiz Count Badge */}
//         <div className="relative group transition-all duration-300 hover:scale-105">
//           <div className="w-48 h-48 filter drop-shadow-lg">
//             <svg viewBox="0 0 100 100" className="w-full h-full">
//               {/* Gradient definition */}
//               <defs>
//                 <linearGradient id="darkGoldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#92400e" />
//                   <stop offset="50%" stopColor="#b45309" />
//                   <stop offset="100%" stopColor="#78350f" />
//                 </linearGradient>
//                 <filter id="goldGlow2" x="-20%" y="-20%" width="140%" height="140%">
//                   <feGaussianBlur stdDeviation="3" result="blur" />
//                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
//                 </filter>
//                 <radialGradient id="goldShine2" cx="65%" cy="35%" r="50%" fx="65%" fy="35%">
//                   <stop offset="0%" stopColor="#fcd34d" />
//                   <stop offset="20%" stopColor="#d97706" stopOpacity="0.8" />
//                   <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
//                 </radialGradient>
//               </defs>
              
//               {/* Outer hexagon */}
//               <path 
//                 d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
//                 fill="white" 
//                 stroke="url(#darkGoldGradient2)" 
//                 strokeWidth="2"
//                 filter="url(#goldGlow2)"
//               />
              
//               {/* Inner content - Dark Gold gradient fill */}
//               <path 
//                 d="M50 10 L83.3 30 L83.3 70 L50 90 L16.7 70 L16.7 30 Z" 
//                 fill="url(#darkGoldGradient2)" 
//               />
              
//               {/* Shine overlay */}
//               <circle cx="65" cy="35" r="25" fill="url(#goldShine2)" opacity="0.6" />
              
//               {/* Curved line */}
//               <path 
//                 d="M40 60 Q50 20, 70 50" 
//                 fill="none" 
//                 stroke="rgba(255,255,255,0.8)" 
//                 strokeWidth="2"
//                 strokeLinecap="round"
//               />
              
//               {/* "QUIZ" text */}
//               <text 
//                 x="50" 
//                 y="20" 
//                 textAnchor="middle" 
//                 fill="#ffffff" 
//                 fontWeight="bold"
//                 fontSize="8"
//               >
//                 QUIZ
//               </text>
              
//               {/* Badge text - Quiz count */}
//               <text 
//                 x="50" 
//                 y="65" 
//                 textAnchor="middle" 
//                 fill="#ffffff" 
//                 fontWeight="bold"
//                 fontSize="24"
//                 filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
//               >
//                 {totalQuizzes}
//               </text>
              
//               {/* Stars */}
//               <circle cx="20" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="80" cy="15" r="1.5" fill="#ffffff" />
//               <circle cx="15" cy="75" r="1.5" fill="#ffffff" />
//               <circle cx="85" cy="85" r="1.5" fill="#ffffff" />
//             </svg>
//           </div>
          
//           {/* Animated stars */}
//           <div className="absolute -top-4 -right-4 text-blue-400 text-2xl animate-pulse">✦</div>
//           <div className="absolute -bottom-2 -right-4 text-blue-400 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
          
//           <div className="text-center mt-4">
//             <h3 className="text-xl font-bold text-blue-800">Total Quizzes</h3>
//             <p className="text-blue-600 font-semibold">Completed This Week</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Summary section */}
//       <div className="mt-4 w-full">
//         <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
//           <div className="flex justify-between items-center">
//             <span className="text-blue-800 font-medium">Status:</span>
//             <span className="font-bold px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white">
//               {isTopPerformer ? 'Top Performer 🏆' : 'Regular Learner 📚'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Badges;


import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Badges = () => {
  // Sample data for the quiz performance
  const [quizData] = useState([
    { day: 'Mon', quizzes: 3, score: 85 },
    { day: 'Tue', quizzes: 5, score: 92 },
    { day: 'Wed', quizzes: 4, score: 78 },
    { day: 'Thu', quizzes: 7, score: 95 },
    { day: 'Fri', quizzes: 6, score: 88 },
    { day: 'Sat', quizzes: 8, score: 97 },
    { day: 'Sun', quizzes: 5, score: 91 },
  ]);

  // Calculate if the user is a top performer (e.g., average score > 90)
  const averageScore = quizData.reduce((sum, day) => sum + day.score, 0) / quizData.length;
  const isTopPerformer = averageScore > 90;
  const totalQuizzes = quizData.reduce((sum, day) => sum + day.quizzes, 0);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-8 bg-white text-gray-800 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Quiz Performance Dashboard</h1>
      
      {/* Graph on the first line */}
      <div className="w-full mb-10 p-6 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
        <h2 className="text-xl font-semibold mb-6 text-blue-800">Quiz Activity</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={quizData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="day" stroke="#3b82f6" />
            <YAxis stroke="#3b82f6" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="quizzes" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} 
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#1d4ed8" 
              strokeWidth={3} 
              dot={{ r: 6, fill: '#1d4ed8', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 8, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-6 flex justify-center gap-12 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-blue-800 font-medium">Quizzes Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-700 rounded-full mr-2"></div>
            <span className="text-blue-800 font-medium">Score</span>
          </div>
        </div>
      </div>
      
      {/* Two badges on the second line */}
      <div className="flex justify-center gap-16 w-full mb-10">
        {/* Performance Badge - Hexagon with Animation */}
        <div className="relative group transition-all duration-300 hover:scale-105">
          <div className="w-48 h-48 filter drop-shadow-lg animate-pulse">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Outer hexagon with gold gradient border */}
              <path 
                d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
                fill="none" 
                stroke="url(#goldBorder)" 
                strokeWidth="4"
                filter="url(#glow)"
              />
              
              {/* Inner hexagon with purple gradient fill */}
              <path 
                d="M50 4 L89.3 27 L89.3 73 L50 96 L10.7 73 L10.7 27 Z" 
                fill="url(#purpleGradient)" 
              />
              
              {/* Trophy icon */}
              <path 
                d="M35 30 H65 V32 H68 Q73 32 73 37 V42 Q73 46 69 46 Q67 49 66 52 H63 Q64 48 65 45 H35 Q36 48 37 52 H34 Q33 49 31 46 Q27 46 27 42 V37 Q27 32 32 32 H35 V30 Z M38 32 H62 V40 H38 V32 Z M40 55 H60 V58 H50 V65 H55 V68 H45 V65 H50 V58 H40 V55 Z" 
                fill="#fbbf24" 
                filter="url(#innerGlow)"
              />
              
              {/* Text - TOP PERFORMER */}
              <text 
                x="50" 
                y="80" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontWeight="bold"
                fontSize="7"
              >
                TOP PERFORMER
              </text>
            </svg>
          </div>
          
          {/* Animated stars */}
          <div className="absolute -top-4 -left-4 text-yellow-400 text-2xl animate-pulse">✦</div>
          <div className="absolute -top-4 -right-4 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
          <div className="absolute -bottom-2 -left-4 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>✦</div>
          <div className="absolute -bottom-2 -right-4 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.7s' }}>✦</div>
          
          <div className="text-center mt-4">
            <h3 className="text-xl font-bold text-blue-800">Performance</h3>
            <p className="text-blue-600 font-semibold">{averageScore.toFixed(1)}% Average</p>
          </div>
        </div>
        
        {/* Quiz Count Badge - Hexagon with Animation */}
        <div className="relative group transition-all duration-300 hover:scale-105">
          <div className="w-48 h-48 filter drop-shadow-lg animate-pulse" style={{ animationDelay: '0.4s' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="purpleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="goldBorder2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              
              {/* Outer hexagon with gold gradient border */}
              <path 
                d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
                fill="none" 
                stroke="url(#goldBorder2)" 
                strokeWidth="4"
                filter="url(#glow)"
              />
              
              {/* Inner hexagon with purple gradient fill */}
              <path 
                d="M50 4 L89.3 27 L89.3 73 L50 96 L10.7 73 L10.7 27 Z" 
                fill="url(#purpleGradient2)" 
              />
              
              {/* Number */}
              <text 
                x="50" 
                y="60" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontWeight="bold"
                fontSize="28"
                filter="url(#innerGlow)"
              >
                15
              </text>
              
              {/* Text - QUIZ MASTER */}
              <text 
                x="50" 
                y="80" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontWeight="bold"
                fontSize="8"
              >
                QUIZ MASTER
              </text>
            </svg>
          </div>
          
          {/* Animated stars */}
          <div className="absolute -top-4 -left-4 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.2s' }}>✦</div>
          <div className="absolute -top-4 -right-4 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.6s' }}>✦</div>
          <div className="absolute -bottom-2 -left-4 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.4s' }}>✦</div>
          <div className="absolute -bottom-2 -right-4 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.8s' }}>✦</div>
          
          <div className="text-center mt-4">
            <h3 className="text-xl font-bold text-blue-800">Total Quizzes</h3>
            <p className="text-blue-600 font-semibold">Completed This Week</p>
          </div>
        </div>
      </div>
      
      {/* Summary section */}
      <div className="mt-4 w-full">
        <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-blue-800 font-medium">Status:</span>
            <span className="font-bold px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              {isTopPerformer ? 'Top Performer 🏆' : 'Regular Learner 📚'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;