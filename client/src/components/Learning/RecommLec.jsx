// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchLectureRecommendations } from '../../actions/projectActions';
// import { FaBook, FaChalkboardTeacher, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const RecommLec = () => {
//   const dispatch = useDispatch();
//   const [hoveredCard, setHoveredCard] = useState(null);

//   const lectureRecommend = useSelector((state) => state.lectureRecommend);
//   const { loading, error, lectures } = lectureRecommend;

//   useEffect(() => {
//     dispatch(fetchLectureRecommendations());
//   }, [dispatch]);

//   const getDifficultyColor = (level) => {
//     switch(level?.toLowerCase()) {
//       case 'beginner': return 'bg-green-100 text-green-800';
//       case 'intermediate': return 'bg-yellow-100 text-yellow-800';
//       case 'advanced': return 'bg-red-100 text-red-800';
//       default: return 'bg-blue-100 text-blue-800';
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
//       <div className="flex items-center mb-6">
//         <FaChalkboardTeacher className="text-indigo-600 text-2xl mr-3" />
//         <h2 className="text-2xl font-bold text-gray-800">Lectures</h2>
//       </div>
      
//       {loading ? (
//         <div className="flex justify-center items-center py-12">
//           <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
//           <p className="ml-3 text-gray-600 font-medium">Loading recommendations...</p>
//         </div>
//       ) : error ? (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
//           <div className="flex items-center">
//             <FaExclamationTriangle className="text-red-500 mr-3" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         </div>
//       ) : lectures?.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//           <p>No lecture recommendations available at this time.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {lectures?.map((lecture) => (
//             <div
//               key={lecture.lecture_id}
//               className={`bg-white border rounded-lg shadow-sm transition-all duration-300 overflow-hidden ${
//                 hoveredCard === lecture.lecture_id ? 'shadow-md transform -translate-y-1' : ''
//               }`}
//               onMouseEnter={() => setHoveredCard(lecture.lecture_id)}
//               onMouseLeave={() => setHoveredCard(null)}
//             >
//               <div className="p-5">
//                 <div className="flex justify-between items-start mb-3">
//                   <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{lecture.title}</h3>
//                   <FaBook className="text-indigo-500 flex-shrink-0 ml-2" />
//                 </div>
                
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                     {lecture.subject}
//                   </span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lecture.difficulty_level)}`}>
//                     {lecture.difficulty_level}
//                   </span>
//                 </div>
                
//                 <p className="text-gray-600 line-clamp-3 mb-3">
//                   {lecture.content_text?.slice(0, 150) || "No description available"}
//                   {lecture.content_text?.length > 150 && "..."}
//                 </p>
                
//                 <Link to={`/lectures/${lecture.lecture_id}`} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
//                   View lecture details
//                   <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommLec;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLectureRecommendations } from '../../actions/projectActions';
import { FaBook, FaChalkboardTeacher, FaSpinner, FaExclamationTriangle, FaPlayCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RecommLec = () => {
  const dispatch = useDispatch();
  const [hoveredCard, setHoveredCard] = useState(null);

  const lectureRecommend = useSelector((state) => state.lectureRecommend);
  const { loading, error, lectures } = lectureRecommend;
  console.log(lectures)
  useEffect(() => {
    dispatch(fetchLectureRecommendations());
  }, [dispatch]);

  const getDifficultyColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Format duration from DurationField
  const formatDuration = (duration) => {
    if (!duration) return null;
    
    // If duration is already a string like "1:30:45"
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // If duration is in seconds
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = Math.floor(duration % 60);
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6 pb-3 border-b border-indigo-100">
        <FaChalkboardTeacher className="text-indigo-600 text-2xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Lectures</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
          <p className="ml-3 text-gray-600 font-medium">Loading lectures...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : lectures?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No lectures available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures?.map((lecture) => (
            <div
              key={lecture.lecture_id}
              className={`bg-white rounded-lg shadow-sm transition-all duration-300 overflow-hidden ${
                hoveredCard === lecture.lecture_id ? 'shadow-md transform -translate-y-1' : ''
              }`}
              onMouseEnter={() => setHoveredCard(lecture.lecture_id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Video Thumbnail */}
              <Link to={`/lectures/${lecture.lecture_id}`} className="block relative">
                <div className="relative w-full h-48 bg-gray-200">
                  {lecture.video_thumbnail ? (
                    <img 
                      src={`http://127.0.0.1:8000${lecture.video_thumbnail}`} 
                      alt={lecture.title} 
                      className="w-full h-full object-cover"
                    />
                    
                  ) : (
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-400">
                      <FaBook className="text-4xl" />
                    </div>
                  )}
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <FaPlayCircle className="text-white text-5xl opacity-90" />
                  </div>
                  
                  {/* Duration badge */}
                  {lecture.video_duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-medium py-1 px-2 rounded">
                      <div className="flex items-center">
                        <FaClock className="mr-1 text-xs" />
                        {formatDuration(lecture.video_duration)}
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 hover:text-indigo-600 transition-colors">
                    <Link to={`/lectures/${lecture.lecture_id}`}>
                      {lecture.title}
                    </Link>
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {lecture.subject}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lecture.difficulty_level)}`}>
                    {lecture.difficulty_level}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {lecture.content_text?.slice(0, 120) || "No description available"}
                  {lecture.content_text?.length > 120 && "..."}
                </p>
                
                <div className="flex justify-between items-center mt-4">
                  {/* Resource indicators */}
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    {lecture.file1 && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        Resources
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/lectures/${lecture.lecture_id}`} 
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                  >
                    Watch now
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommLec;