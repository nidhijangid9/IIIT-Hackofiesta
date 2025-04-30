import React from 'react';
import { motion } from 'framer-motion';

const Page3 = () => {
  const redirectToCalendar = () => {
    window.open('https://calendar.google.com/calendar/u/0/r', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
      <motion.div 
        className="w-full max-w-lg bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100 mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Meetings</h2>
          <div className="bg-blue-600 text-white p-2 rounded-full shadow-md">
            <svg 
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Parent-Teacher Conference */}
          <motion.div 
            className="group relative p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={redirectToCalendar}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <div className="flex items-start gap-5">
              <div className="p-3 bg-blue-600 rounded-lg shadow-md text-white">
                <svg 
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">Parent-Teacher Conference</h3>
                <div className="flex items-center mt-2 mb-3">
                  <svg 
                    className="w-4 h-4 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600">Tomorrow at 3:00 PM</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Pending Confirmation
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg 
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Study Group Session */}
          <motion.div 
            className="group relative p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={redirectToCalendar}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
            <div className="flex items-start gap-5">
              <div className="p-3 bg-blue-600 rounded-lg shadow-md text-white">
                <svg 
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">Study Group Session</h3>
                <div className="flex items-center mt-2 mb-3">
                  <svg 
                    className="w-4 h-4 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600">Friday at 4:00 PM</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Confirmed
                </span>
              </div>
              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg 
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page3;