// //this is the code with proper drowsiness detection

// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import axios from 'axios';
// import { useParams, Link, useNavigate } from 'react-router-dom';

// // --- Component for Drowsiness Detection ---
// const DrowsinessDetector = ({ isVideoPlaying, videoRef, onDrowsinessDetected }) => {
//     const webcamRef = useRef(null);
//     const canvasRef = useRef(null);
//     const audioRef = useRef(null);
//     const [isDetecting, setIsDetecting] = useState(false);
//     const [detectionStatus, setDetectionStatus] = useState('Ready');
//     const [error, setError] = useState(null);
//     const [drowsyEvents, setDrowsyEvents] = useState([]);
//     const intervalRef = useRef(null); // To store interval ID
//     const autoModeRef = useRef(false); // Track if we're in auto mode

//     const API_URL = 'http://127.0.0.1:8000/api/drowsiness/detect/'; // Adjust if needed

//     // Function to send frame to backend
//     const sendFrameForDetection = useCallback(async () => {
//         if (!webcamRef.current || !canvasRef.current || webcamRef.current.readyState < 3) {
//             return; // Make sure video is ready
//         }

//         const video = webcamRef.current;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         // Set canvas dimensions to video dimensions
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         // Draw video frame onto canvas
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // Get base64 data URL (use JPEG for smaller payload)
//         const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);

//         try {
//             const response = await axios.post(API_URL, { 
//                 image: imageDataUrl,
//                 user_id: localStorage.getItem('userId') || 'default_user' // Use stored user ID if available
//             });
            
//             // Update detection status display
//             const statusText = `${response.data.status}${
//                 response.data.ear ? ` (EAR: ${response.data.ear})` : ''
//             }`;
//             setDetectionStatus(statusText);
            
//             // Handle drowsiness detection events
//             if (response.data.status === 'Drowsy') {
//                 // If this is the first drowsy detection in this sequence
//                 if (response.data.first_drowsy) {
//                     // Play audio alert
//                     if (audioRef.current) {
//                         audioRef.current.play().catch(e => {
//                             console.error("Audio play error:", e);
//                         });
//                     }
                    
//                     // Get current video timestamp (if videoRef exists and is valid)
//                     let videoTimestamp = 'N/A';
//                     if (videoRef.current) {
//                         const currentTime = videoRef.current.currentTime;
//                         const minutes = Math.floor(currentTime / 60);
//                         const seconds = Math.floor(currentTime % 60);
//                         videoTimestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        
//                         // Pause the video
//                         videoRef.current.pause();
//                     }
                    
//                     // Add new drowsy event to list with video timestamp
//                     const newEvent = {
//                         timestamp: videoTimestamp,
//                         systemTime: new Date().toLocaleTimeString(),
//                         coords: response.data.face_coords || 'Not available'
//                     };
                    
//                     setDrowsyEvents(prev => [...prev, newEvent]);
                    
//                     // Notify parent component if callback provided
//                     if (onDrowsinessDetected) {
//                         onDrowsinessDetected(newEvent);
//                     }
//                 }
//             }
            
//             setError(null); // Clear previous errors
//         } catch (err) {
//             console.error("Drowsiness detection API error:", err);
//             setError('Detection API call failed');
//             setDetectionStatus('Error');
//         }
//     }, [API_URL, onDrowsinessDetected, videoRef]); 

//     // Function to start camera and detection loop
//     const startDetection = useCallback(async (auto = false) => {
//         setError(null);
//         setDetectionStatus('Starting Camera...');
//         autoModeRef.current = auto; // Set auto mode flag
        
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: { 
//                     width: { ideal: 640 },
//                     height: { ideal: 480 },
//                     facingMode: "user" // Prefer front camera
//                 },
//                 audio: false
//             });

//             if (webcamRef.current) {
//                 webcamRef.current.srcObject = stream;
                
//                 // Wait for video metadata to load to get dimensions
//                 webcamRef.current.onloadedmetadata = () => {
//                     webcamRef.current.play();
//                     setIsDetecting(true);
//                     setDetectionStatus('Detecting...');
                    
//                     // Clear any existing interval before starting a new one
//                     if (intervalRef.current) clearInterval(intervalRef.current);
                    
//                     // Start sending frames periodically - increased frequency for better detection
//                     intervalRef.current = setInterval(sendFrameForDetection, 300); // Send every 300ms
//                 };
//             }
//         } catch (err) {
//             console.error("Camera access error:", err);
//             setError(`Camera Error: ${err.message}. Please grant permission.`);
//             setDetectionStatus('Camera Error');
//             setIsDetecting(false);
//         }
//     }, [sendFrameForDetection]);

//     // Function to stop camera and detection loop
//     const stopDetection = useCallback(() => {
//         if (intervalRef.current) {
//             clearInterval(intervalRef.current);
//             intervalRef.current = null;
//         }
        
//         if (webcamRef.current && webcamRef.current.srcObject) {
//             const stream = webcamRef.current.srcObject;
//             const tracks = stream.getTracks();
//             tracks.forEach(track => track.stop()); // Stop camera stream
//             webcamRef.current.srcObject = null;
//         }
        
//         setIsDetecting(false);
//         setDetectionStatus('Stopped');
//         autoModeRef.current = false; // Reset auto mode flag
//     }, []);

//     // Effect to handle auto mode when video playing status changes
//     useEffect(() => {
//         if (isVideoPlaying && !isDetecting) {
//             startDetection(true); // Start with auto mode flag
//         } else if (!isVideoPlaying && isDetecting && autoModeRef.current) {
//             // Only stop if we're in auto mode and video stopped
//             stopDetection();
//         }
//     }, [isVideoPlaying, isDetecting, startDetection, stopDetection]);

//     // Cleanup on component unmount
//     useEffect(() => {
//         return () => {
//             stopDetection();
//         };
//     }, [stopDetection]);

//     return (
//         <div className="bg-gray-100 p-4 rounded-lg shadow-inner mt-6">
//             <h3 className="text-lg font-semibold mb-3 text-gray-700">Attention Monitor</h3>
            
//             {/* Video and status container */}
//             <div className="relative mb-3" style={{ maxWidth: '320px' }}>
//                 {/* Webcam element */}
//                 <video
//                     ref={webcamRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="w-full h-auto rounded border bg-black"
//                     style={{ transform: 'scaleX(-1)' }} // Mirror effect
//                 />
                
//                 {/* Status overlay */}
//                 <div className={`absolute bottom-0 left-0 right-0 p-2 text-center text-white text-sm font-medium rounded-b ${
//                     detectionStatus.includes('Drowsy') ? 'bg-red-600' :
//                     detectionStatus.includes('Awake') ? 'bg-green-600' :
//                     detectionStatus.includes('Error') || detectionStatus.includes('Not Detected') ? 'bg-yellow-600' :
//                     'bg-gray-700'
//                 }`}>
//                     {detectionStatus}
//                 </div>
//             </div>

//             {/* Canvas element (hidden) for frame processing */}
//             <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            
//             {/* Audio element for alert */}
//             <audio ref={audioRef} style={{ display: 'none' }}>
//                 <source src="/static/audio/drowsy_alert.mp3" type="audio/mpeg" />
//                 {/* Fallback text-to-speech alert if audio file not available */}
//                 Your browser does not support the audio element.
//             </audio>

//             {/* Error display */}
//             {error && <p className="text-red-500 text-sm mt-2 mb-2">Error: {error}</p>}

            
//             {/* {!autoModeRef.current && (
//                 <div className="mb-4">
//                     {!isDetecting ? (
//                         <button
//                             onClick={() => startDetection(false)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                         >
//                             Start Monitoring
//                         </button>
//                     ) : (
//                         <button
//                             onClick={stopDetection}
//                             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//                         >
//                             Stop Monitoring
//                         </button>
//                     )}
//                 </div>
//             )} */}

//             {/* Show drowsiness events log only if there are events */}
//             {drowsyEvents.length > 0 && (
//                 <div className="mt-4">
//                     <h4 className="font-medium text-gray-700 mb-2">Drowsiness Detected:</h4>
//                     <div className="bg-white p-2 rounded max-h-32 overflow-y-auto text-sm">
//                         {drowsyEvents.map((event, index) => (
//                             <div key={index} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
//                                 <span className="font-mono text-red-600">Video Time: {event.timestamp}</span>
//                                 <span className="text-gray-500 text-xs ml-2">
//                                     ({typeof event.coords === 'object' ? 
//                                         `x:${event.coords[0]}, y:${event.coords[1]}` : 
//                                         event.coords})
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- Modified LectureDetail Component With Integrated Drowsiness Detection ---
// const LectureDetail = () => {
//     const { lectureId } = useParams();
//     const navigate = useNavigate();
//     const [lecture, setLecture] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//     const videoRef = useRef(null);
//     const [drowsinessAlerts, setDrowsinessAlerts] = useState([]);

//     // Text-to-speech function for drowsiness alerts
//     const speakAlert = useCallback(() => {
//         // Check if browser supports speech synthesis
//         if ('speechSynthesis' in window) {
//             // Create a new speech synthesis utterance
//             const utterance = new SpeechSynthesisUtterance(
//                 "You seem tired. Video paused. Take a break or click play to continue."
//             );
            
//             // Set voice properties
//             utterance.volume = 1; // 0 to 1
//             utterance.rate = 0.9; // 0.1 to 10
//             utterance.pitch = 1; // 0 to 2
            
//             // Optional: try to use a male voice if available
//             const voices = window.speechSynthesis.getVoices();
//             const maleVoice = voices.find(voice => 
//                 voice.name.includes('Male') || 
//                 voice.name.includes('male') || 
//                 voice.name.includes('David') || 
//                 voice.name.includes('Thomas')
//             );
//             if (maleVoice) utterance.voice = maleVoice;
            
//             // Speak the message
//             window.speechSynthesis.speak(utterance);
//         }
//     }, []);
    
//     // Callback for drowsiness detection
//     const handleDrowsinessDetected = useCallback((event) => {
//         setDrowsinessAlerts(prev => [...prev, event]);
//         speakAlert();
//         // Video is already paused in the DrowsinessDetector component
//     }, [speakAlert]);

//     // Video event listeners to track play/pause state
//     useEffect(() => {
//         const videoElement = videoRef.current;
        
//         if (videoElement) {
//             const handlePlay = () => setIsVideoPlaying(true);
//             const handlePause = () => setIsVideoPlaying(false);
//             const handleEnded = () => setIsVideoPlaying(false);
            
//             videoElement.addEventListener('play', handlePlay);
//             videoElement.addEventListener('pause', handlePause);
//             videoElement.addEventListener('ended', handleEnded);
            
//             return () => {
//                 videoElement.removeEventListener('play', handlePlay);
//                 videoElement.removeEventListener('pause', handlePause);
//                 videoElement.removeEventListener('ended', handleEnded);
//             };
//         }
//     }, [lecture]); // Re-attach when lecture changes

//     // Fetch Lecture Data
//     useEffect(() => {
//         const fetchLecture = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/lectures/${lectureId}/`);
//                 setLecture(response.data);
//                 setError(null);
//             } catch (err) {
//                 console.error("Fetch lecture error:", err);
//                 setError(err.response?.data?.detail || err.message || 'Failed to fetch lecture data.');
//                 setLecture(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLecture();
        
//         // Initialize speechSynthesis voices
//         if ('speechSynthesis' in window) {
//             window.speechSynthesis.getVoices();
//         }
//     }, [lectureId]);

//     // Format video timestamp for display
//     const formatVideoTime = (seconds) => {
//         if (!seconds && seconds !== 0) return 'N/A';
//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     // Loading state
//     if (loading) return (
//         <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//     );

//     // Error state
//     if (error && !lecture) return (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto my-8">
//             <p className="text-red-600 font-semibold">Could not load lecture details.</p>
//             <p className="text-red-500 mt-1">Error: {error}</p>
//         </div>
//     );

//     // Render lecture content
//     return (
//         <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto my-8">
//             {lecture ? (
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2 border-b pb-2">{lecture.title}</h1>

//                     <div className="flex flex-wrap gap-2 mb-4">
//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                             {lecture.subject}
//                         </span>
//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {lecture.difficulty_level}
//                         </span>
//                     </div>

//                     <div className="flex flex-col md:flex-row gap-8">
//                         {/* Left Column (Video + Drowsiness Detector) */}
//                         <div className="w-full md:w-1/2">
//                             <div className="sticky top-8 space-y-6">
//                                 <div>
//                                     <h2 className="text-xl font-bold mb-2 text-gray-700">Video Lecture</h2>
//                                     <div className="rounded-lg overflow-hidden shadow-lg">
//                                         <video
//                                             ref={videoRef}
//                                             controls
//                                             width="100%"
//                                             poster={lecture.video_thumbnail}
//                                             className="w-full aspect-video bg-black"
//                                         >
//                                             <source src={lecture.lecture} type="video/mp4" />
//                                             Your browser does not support the video tag.
//                                         </video>
//                                     </div>
//                                     <p className="text-sm text-gray-500 mt-2 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                         </svg>
//                                         Duration: {lecture.video_duration || 'N/A'}
//                                     </p>
//                                 </div>

//                                 {/* Status message about auto-detection and auto-pause */}
//                                 <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 border border-blue-100">
//                                     <p className="flex items-center">
//                                         <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
//                                                   d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                         </svg>
//                                         Attention monitoring will automatically start when the video plays. The video will pause if drowsiness is detected.
//                                     </p>
//                                 </div>

//                                 {/* Integrate Drowsiness Detector Component with video state and ref */}
//                                 <DrowsinessDetector 
//                                     isVideoPlaying={isVideoPlaying}
//                                     videoRef={videoRef}
//                                     onDrowsinessDetected={handleDrowsinessDetected}
//                                 />

//                                 {/* Quiz Button */}
//                                 {/* <Link
//                                     to={`/quiz/${lectureId}`}
//                                     className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors inline-block"
//                                 >
//                                     Take Quiz
//                                 </Link> */}
// {/* 
//                                 <button
//                     onClick={() => navigate('/quiz')}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
//                   >
//                     Take Quiz
//                   </button> */}
//                   {/* <button
//                                     onClick={() => navigate(`/quiz/${lectureId}`)}
//                                     className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
//                                 >
//                                     Take Quiz
//                                 </button> */}

//                                 <button
//                                     onClick={handleQuizClick}
//                                     className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
//                                 >
//                                     Take Quiz
//                                 </button>

//                             </div>
//                         </div>

//                         {/* Right Column (Content) */}
//                         <div className="w-full md:w-1/2">
//                             <div className="mb-6">
//                                 <h2 className="text-xl font-bold mb-3 text-gray-700">Description</h2>
//                                 <p className="text-gray-600 leading-relaxed">{lecture.content_text || 'No description available.'}</p>
//                             </div>

//                             {lecture.file1 && (
//                                 <div className="mb-6 bg-gray-50 p-4 rounded-lg">
//                                     <h2 className="text-xl font-bold mb-3 text-gray-700">Lecture Notes</h2>
//                                     <a
//                                         href={lecture.file1}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="flex items-center text-indigo-600 hover:text-indigo-800 bg-white p-3 rounded-md shadow-sm hover:shadow transition"
//                                     >
//                                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
//                                         </svg>
//                                         Download Lecture Notes (PDF)
//                                     </a>
//                                 </div>
//                             )}

//                             {lecture.topics?.topic && (
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <h2 className="text-xl font-bold mb-3 text-gray-700">Topics Covered</h2>
//                                     <div className="space-y-2">
//                                         <div className="bg-white p-3 rounded shadow-sm">
//                                             <p className="font-semibold text-gray-800">Topic:</p>
//                                             <p className="text-gray-600">{lecture.topics.topic}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
                            
//                             {/* Drowsiness Alert Log */}
//                             {drowsinessAlerts.length > 0 && (
//                                 <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//                                     <h2 className="text-xl font-bold mb-3 text-red-700 flex items-center">
//                                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
//                                                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//                                         </svg>
//                                         Attention Report
//                                     </h2>
//                                     <div className="bg-white p-3 rounded shadow-sm">
//                                         <p className="text-gray-700 mb-2">
//                                             You appeared drowsy {drowsinessAlerts.length} time{drowsinessAlerts.length !== 1 ? 's' : ''} during this lecture.
//                                         </p>
//                                         <div className="text-sm text-gray-600">
//                                             <p className="font-medium mb-1">Detected at video timestamps:</p>
//                                             <ul className="space-y-1 list-disc pl-5">
//                                                 {drowsinessAlerts.map((alert, index) => (
//                                                     <li key={index}>
//                                                         {alert.timestamp}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="text-center py-8">
//                     <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                     </svg>
//                     <p className="mt-2 text-gray-500">Lecture data is unavailable.</p>
//                     {error && <p className="text-red-500 text-sm mt-1">Error: {error}</p>}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LectureDetail;



//this is the code with proper drowsiness detection

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

// --- Component for Drowsiness Detection ---
const DrowsinessDetector = ({ isVideoPlaying, videoRef, onDrowsinessDetected }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionStatus, setDetectionStatus] = useState('Ready');
    const [error, setError] = useState(null);
    const [drowsyEvents, setDrowsyEvents] = useState([]);
    const intervalRef = useRef(null); // To store interval ID
    const autoModeRef = useRef(false); // Track if we're in auto mode

    const API_URL = 'http://127.0.0.1:8000/api/drowsiness/detect/'; // Adjust if needed

    // Function to send frame to detection
    const sendFrameForDetection = useCallback(async () => {
        if (!webcamRef.current || !canvasRef.current || webcamRef.current.readyState < 3) {
            return; // Make sure video is ready
        }

        const video = webcamRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get base64 data URL (use JPEG for smaller payload)
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);

        try {
            const response = await axios.post(API_URL, { 
                image: imageDataUrl,
                user_id: localStorage.getItem('userId') || 'default_user' // Use stored user ID if available
            });
            
            // Update detection status display
            const statusText = `${response.data.status}${
                response.data.ear ? ` (EAR: ${response.data.ear})` : ''
            }`;
            setDetectionStatus(statusText);
            
            // Handle drowsiness detection events
            if (response.data.status === 'Drowsy') {
                // If this is the first drowsy detection in this sequence
                if (response.data.first_drowsy) {
                    // Play audio alert
                    if (audioRef.current) {
                        audioRef.current.play().catch(e => {
                            console.error("Audio play error:", e);
                        });
                    }
                    
                    // Get current video timestamp (if videoRef exists and is valid)
                    let videoTimestamp = 'N/A';
                    if (videoRef.current) {
                        const currentTime = videoRef.current.currentTime;
                        const minutes = Math.floor(currentTime / 60);
                        const seconds = Math.floor(currentTime % 60);
                        videoTimestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        
                        // Pause the video
                        videoRef.current.pause();
                    }
                    
                    // Add new drowsy event to list with video timestamp
                    const newEvent = {
                        timestamp: videoTimestamp,
                        systemTime: new Date().toLocaleTimeString(),
                        coords: response.data.face_coords || 'Not available'
                    };
                    
                    setDrowsyEvents(prev => [...prev, newEvent]);
                    
                    // Notify parent component if callback provided
                    if (onDrowsinessDetected) {
                        onDrowsinessDetected(newEvent);
                    }
                }
            }
            
            setError(null); // Clear previous errors
        } catch (err) {
            console.error("Drowsiness detection API error:", err);
            setError('Detection API call failed');
            setDetectionStatus('Error');
        }
    }, [API_URL, onDrowsinessDetected, videoRef]); 

    // Function to start camera and detection loop
    const startDetection = useCallback(async (auto = false) => {
        setError(null);
        setDetectionStatus('Starting Camera...');
        autoModeRef.current = auto; // Set auto mode flag
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user" // Prefer front camera
                },
                audio: false
            });

            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
                
                // Wait for video metadata to load to get dimensions
                webcamRef.current.onloadedmetadata = () => {
                    webcamRef.current.play();
                    setIsDetecting(true);
                    setDetectionStatus('Detecting...');
                    
                    // Clear any existing interval before starting a new one
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    
                    // Start sending frames periodically - increased frequency for better detection
                    intervalRef.current = setInterval(sendFrameForDetection, 300); // Send every 300ms
                };
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError(`Camera Error: ${err.message}. Please grant permission.`);
            setDetectionStatus('Camera Error');
            setIsDetecting(false);
        }
    }, [sendFrameForDetection]);

    // Function to stop camera and detection loop
    const stopDetection = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        if (webcamRef.current && webcamRef.current.srcObject) {
            const stream = webcamRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop()); // Stop camera stream
            webcamRef.current.srcObject = null;
        }
        
        setIsDetecting(false);
        setDetectionStatus('Stopped');
        autoModeRef.current = false; // Reset auto mode flag
    }, []);

    // Effect to handle auto mode when video playing status changes
    useEffect(() => {
        if (isVideoPlaying && !isDetecting) {
            startDetection(true); // Start with auto mode flag
        } else if (!isVideoPlaying && isDetecting && autoModeRef.current) {
            // Only stop if we're in auto mode and video stopped
            stopDetection();
        }
    }, [isVideoPlaying, isDetecting, startDetection, stopDetection]);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, [stopDetection]);

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Attention Monitor</h3>
            
            {/* Video and status container */}
            <div className="relative mb-3" style={{ maxWidth: '320px' }}>
                {/* Webcam element */}
                <video
                    ref={webcamRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto rounded border bg-black"
                    style={{ transform: 'scaleX(-1)' }} // Mirror effect
                />
                
                {/* Status overlay */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 text-center text-white text-sm font-medium rounded-b ${
                    detectionStatus.includes('Drowsy') ? 'bg-red-600' :
                    detectionStatus.includes('Awake') ? 'bg-green-600' :
                    detectionStatus.includes('Error') || detectionStatus.includes('Not Detected') ? 'bg-yellow-600' :
                    'bg-gray-700'
                }`}>
                    {detectionStatus}
                </div>
            </div>

            {/* Canvas element (hidden) for frame processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            
            {/* Audio element for alert */}
            <audio ref={audioRef} style={{ display: 'none' }}>
                <source src="/static/audio/drowsy_alert.mp3" type="audio/mpeg" />
                {/* Fallback text-to-speech alert if audio file not available */}
                Your browser does not support the audio element.
            </audio>

            {/* Error display */}
            {error && <p className="text-red-500 text-sm mt-2 mb-2">Error: {error}</p>}

            
            {/* {!autoModeRef.current && (
                <div className="mb-4">
                    {!isDetecting ? (
                        <button
                            onClick={() => startDetection(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Start Monitoring
                        </button>
                    ) : (
                        <button
                            onClick={stopDetection}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Stop Monitoring
                        </button>
                    )}
                </div>
            )} */}

            {/* Show drowsiness events log only if there are events */}
            {drowsyEvents.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Drowsiness Detected:</h4>
                    <div className="bg-white p-2 rounded max-h-32 overflow-y-auto text-sm">
                        {drowsyEvents.map((event, index) => (
                            <div key={index} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                                <span className="font-mono text-red-600">Video Time: {event.timestamp}</span>
                                <span className="text-gray-500 text-xs ml-2">
                                    ({typeof event.coords === 'object' ? 
                                        `x:${event.coords[0]}, y:${event.coords[1]}` : 
                                        event.coords})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Modified LectureDetail Component With Integrated Drowsiness Detection ---
const LectureDetail = () => {
    const { lectureId } = useParams();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef(null);
    const [drowsinessAlerts, setDrowsinessAlerts] = useState([]);

    // Add the missing handleQuizClick function
    const handleQuizClick = () => {
        navigate(`/quiz/${lectureId}`);
    };

    // Text-to-speech function for drowsiness alerts
    const speakAlert = useCallback(() => {
        // Check if browser supports speech synthesis
        if ('speechSynthesis' in window) {
            // Create a new speech synthesis utterance
            const utterance = new SpeechSynthesisUtterance(
                "You seem tired. Video paused. Take a break or click play to continue."
            );
            
            // Set voice properties
            utterance.volume = 1; // 0 to 1
            utterance.rate = 0.9; // 0.1 to 10
            utterance.pitch = 1; // 0 to 2
            
            // Optional: try to use a male voice if available
            const voices = window.speechSynthesis.getVoices();
            const maleVoice = voices.find(voice => 
                voice.name.includes('Male') || 
                voice.name.includes('male') || 
                voice.name.includes('David') || 
                voice.name.includes('Thomas')
            );
            if (maleVoice) utterance.voice = maleVoice;
            
            // Speak the message
            window.speechSynthesis.speak(utterance);
        }
    }, []);
    
    // Callback for drowsiness detection
    const handleDrowsinessDetected = useCallback((event) => {
        setDrowsinessAlerts(prev => [...prev, event]);
        speakAlert();
        // Video is already paused in the DrowsinessDetector component
    }, [speakAlert]);

    // Video event listeners to track play/pause state
    useEffect(() => {
        const videoElement = videoRef.current;
        
        if (videoElement) {
            const handlePlay = () => setIsVideoPlaying(true);
            const handlePause = () => setIsVideoPlaying(false);
            const handleEnded = () => setIsVideoPlaying(false);
            
            videoElement.addEventListener('play', handlePlay);
            videoElement.addEventListener('pause', handlePause);
            videoElement.addEventListener('ended', handleEnded);
            
            return () => {
                videoElement.removeEventListener('play', handlePlay);
                videoElement.removeEventListener('pause', handlePause);
                videoElement.removeEventListener('ended', handleEnded);
            };
        }
    }, [lecture]); // Re-attach when lecture changes

    // Fetch Lecture Data
    useEffect(() => {
        const fetchLecture = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/lectures/${lectureId}/`);
                setLecture(response.data);
                setError(null);
            } catch (err) {
                console.error("Fetch lecture error:", err);
                setError(err.response?.data?.detail || err.message || 'Failed to fetch lecture data.');
                setLecture(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLecture();
        
        // Initialize speechSynthesis voices
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    }, [lectureId]);

    // Format video timestamp for display
    const formatVideoTime = (seconds) => {
        if (!seconds && seconds !== 0) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Loading state
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    // Error state
    if (error && !lecture) return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-4xl mx-auto my-8">
            <p className="text-red-600 font-semibold">Could not load lecture details.</p>
            <p className="text-red-500 mt-1">Error: {error}</p>
        </div>
    );

    // Render lecture content
    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto my-8">
            {lecture ? (
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 border-b pb-2">{lecture.title}</h1>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {lecture.subject}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {lecture.difficulty_level}
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column (Video + Drowsiness Detector) */}
                        <div className="w-full md:w-1/2">
                            <div className="sticky top-8 space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-2 text-gray-700">Video Lecture</h2>
                                    <div className="rounded-lg overflow-hidden shadow-lg">
                                        <video
                                            ref={videoRef}
                                            controls
                                            width="100%"
                                            poster={lecture.video_thumbnail}
                                            className="w-full aspect-video bg-black"
                                        >
                                            <source src={lecture.lecture} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Duration: {lecture.video_duration || 'N/A'}
                                    </p>
                                </div>

                                {/* Status message about auto-detection and auto-pause */}
                                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 border border-blue-100">
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Attention monitoring will automatically start when the video plays. The video will pause if drowsiness is detected.
                                    </p>
                                </div>

                                {/* Integrate Drowsiness Detector Component with video state and ref */}
                                <DrowsinessDetector 
                                    isVideoPlaying={isVideoPlaying}
                                    videoRef={videoRef}
                                    onDrowsinessDetected={handleDrowsinessDetected}
                                />

                                {/* Quiz Button */}
                                {/* <Link
                                    to={`/quiz/${lectureId}`}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors inline-block"
                                >
                                    Take Quiz
                                </Link> */}
{/* 
                                <button
                    onClick={() => navigate('/quiz')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                    Take Quiz
                  </button> */}
                  {/* <button
                                    onClick={() => navigate(`/quiz/${lectureId}`)}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                                >
                                    Take Quiz
                                </button> */}

                                <button
                                    onClick={handleQuizClick}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                                >
                                    Take Quiz
                                </button>
                                
                            </div>
                        </div>

                        {/* Right Column (Content) */}
                        <div className="w-full md:w-1/2">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-3 text-gray-700">Description</h2>
                                <p className="text-gray-600 leading-relaxed">{lecture.content_text || 'No description available.'}</p>
                            </div>

                            {lecture.file1 && (
                                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-xl font-bold mb-3 text-gray-700">Lecture Notes</h2>
                                    <a
                                        href={lecture.file1}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-indigo-600 hover:text-indigo-800 bg-white p-3 rounded-md shadow-sm hover:shadow transition"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                        </svg>
                                        Download Lecture Notes (PDF)
                                    </a>
                                </div>
                            )}

                            {lecture.topics?.topic && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-xl font-bold mb-3 text-gray-700">Topics Covered</h2>
                                    <div className="space-y-2">
                                        <div className="bg-white p-3 rounded shadow-sm">
                                            <p className="font-semibold text-gray-800">Topic:</p>
                                            <p className="text-gray-600">{lecture.topics.topic}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Drowsiness Alert Log */}
                            {drowsinessAlerts.length > 0 && (
                                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-xl font-bold mb-3 text-red-700 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                        Attention Report
                                    </h2>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <p className="text-gray-700 mb-2">
                                            You appeared drowsy {drowsinessAlerts.length} time{drowsinessAlerts.length !== 1 ? 's' : ''} during this lecture.
                                        </p>
                                        <div className="text-sm text-gray-600">
                                            <p className="font-medium mb-1">Detected at video timestamps:</p>
                                            <ul className="space-y-1 list-disc pl-5">
                                                {drowsinessAlerts.map((alert, index) => (
                                                    <li key={index}>
                                                        {alert.timestamp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="mt-2 text-gray-500">Lecture data is unavailable.</p>
                    {error && <p className="text-red-500 text-sm mt-1">Error: {error}</p>}
                </div>
            )}
        </div>
    );
};

export default LectureDetail;