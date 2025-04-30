


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const LecturePage1 = () => {
  const navigate = useNavigate();
  const { mentor_id } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLectures();
  }, [mentor_id]);

  const fetchLectures = async () => {
    try {
      const response = await axios.get('http://localhost:8000/resources/');
      // Transform the API response to match your component's data structure
      const formattedLectures = response.data.map(resource => ({
        id: resource.id,
        title: resource.title,
        uploadedDate: new Date(resource.created_at).toISOString().split('T')[0],
        thumbnail: resource.video_thumbnail,
        videoUrl: resource.lecture 
          ? `http://localhost:8000${resource.lecture}` 
          : null,
        file1: resource.file1,
        file2: resource.file2
      }));
      
      setLectures(formattedLectures);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching lectures:', err);
      setError('Failed to load lectures');
      setLoading(false);
    }
  };

  const handleWatchNow = (id) => {
    navigate(`/lecture/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">{error}</p>
          <button 
            onClick={fetchLectures}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Recommended Lectures</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {lectures.map((lecture) => (
          <div
            key={lecture.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 w-[30vw]"
          >
            <div className="relative">
              <img
                src={lecture.thumbnail}
                alt={lecture.title}
                className="w-full h-50 object-cover"
              />
              {lecture.videoUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <svg 
                    className="w-16 h-16 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">{lecture.title}</h2>
              <p className="text-gray-500 text-sm">Uploaded on: {lecture.uploadedDate}</p>
              
              {/* Additional files indicators */}
              <div className="mt-2 space-y-1">
                {lecture.file1 && (
                  <p className="text-sm text-gray-600">
                    📄 Additional Resource 1
                  </p>
                )}
                {lecture.file2 && (
                  <p className="text-sm text-gray-600">
                    📄 Additional Resource 2
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                  onClick={() => handleWatchNow(lecture.id)}
                >
                  Watch Now
                </button>
                {(lecture.file1 || lecture.file2) && (
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => window.open(lecture.file1 || lecture.file2)}
                  >
                    Resources
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturePage1;