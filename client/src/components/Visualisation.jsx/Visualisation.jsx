import React from 'react'
import { Link } from 'react-router-dom'

const Visualisation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Container */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          
          {/* Chemical Model Card */}
          <div className="w-full md:w-1/2 max-w-md bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              {/* Card Image */}
              <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mb-6 flex items-center justify-center">
                <svg 
                  className="w-24 h-24 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>

              {/* Card Content */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3D Chemical Model
              </h2>
              <p className="text-gray-600 mb-6">
                Explore interactive 3D molecular structures and chemical compounds. 
                Visualize atomic bonds and molecular geometry in an immersive environment.
              </p>

              {/* Card Button */}
              <Link
                 to={'/chem3d'}
                className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Chemical Models
              </Link>
            </div>
          </div>

          {/* Solar System Card */}
          <div className="w-full md:w-1/2 max-w-md bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              {/* Card Image */}
              <div className="w-full h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-6 flex items-center justify-center">
                <svg 
                  className="w-24 h-24 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>

              {/* Card Content */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3D Solar System
              </h2>
              <p className="text-gray-600 mb-6">
                Journey through our solar system in stunning 3D visualization. 
                Explore planetary orbits and understand the scale of our cosmic neighborhood.
              </p>

              {/* Card Button */}
              <a 
                href="http://127.0.0.1:5500/client/src/utilities/thesolsystem.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Solar System
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Visualisation