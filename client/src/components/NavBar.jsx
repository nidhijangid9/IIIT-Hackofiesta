import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, logoutProject } from '../actions/projectActions';

const NavBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const dispatch = useDispatch();

    const auth = useSelector((state) => state.userLogin);
    const { userInfo, isAuthenticated } = auth;

    const userDetails = useSelector((state) => state.userDetails);
    const { user } = userDetails;

    useEffect(() => {
        if (userInfo) {
            try {
                const token = userInfo.access;
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = JSON.parse(atob(base64));
                const userId = decodedPayload.user_id;
                dispatch(getUserDetails(userInfo.access, userId));
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [dispatch, userInfo]);

    const logoutHandler = () => {
        dispatch(logoutProject());
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const menuItems = [
        { name: "Home", path: "/home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { name: "RoadMap", path: "/roadmap", icon: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12zm0 0l6 6" },
        { name: "Lectures", path: "/core_learning", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { name: "Connect", path: "/connectIQ", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
        // { name: "ARClass", path: "http://127.0.0.1:5500/client/src/utilities/index.html", external: true, icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
        { name: "Visualize", path: "/visualise", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { name: "Quiz", path: "/quiz", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { name: "Progress", path: "/progress", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { name: "Blogs", path: "/enangement", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
        { name: "Badges", path: "/badges", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
        { name: "Sticky Notes", path: "/notes", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"},
        // { name: "Support & Accessibility", path: "/support" }
        { name: "PTMs", path: "/meeting", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
        { name: "Student Profile", path: "/stu_profile", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    ];

    const authlinks = (
        <div className='flex items-center space-x-6'>
            <div className='text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 
                           px-4 py-2 rounded-lg shadow-lg'>
                Welcome, <span className="font-bold">{user?.name}</span>
            </div>
            <button
                onClick={logoutHandler}
                className="relative px-6 py-2 font-semibold text-white bg-gradient-to-r from-red-500 
                         to-pink-500 rounded-lg shadow-lg overflow-hidden transition-all duration-200 
                         hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 
                         focus:ring-pink-500 focus:ring-offset-2"
            >
                <span className="relative z-10">Sign Out</span>
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
            </button>
        </div>
    );

    const guestlinks = (
        <div className="flex items-center space-x-4">
            <Link to="/signin">
                <button className="relative px-6 py-2 font-semibold text-white bg-gradient-to-r 
                                 from-cyan-500 to-blue-500 rounded-lg shadow-lg overflow-hidden 
                                 transition-all duration-200 hover:scale-105 hover:shadow-xl 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
                </button>
            </Link>
            <Link to="/signup">
                <button className="relative px-6 py-2 font-semibold text-white bg-gradient-to-r 
                                 from-purple-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden 
                                 transition-all duration-200 hover:scale-105 hover:shadow-xl 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
                </button>
            </Link>
        </div>
    );

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Main navbar - stays fixed at top */}
            <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 backdrop-blur-lg bg-opacity-80 shadow-2xl 
                transition-all duration-500 border-b border-gray-800 
                ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Menu Icon */}
                        <button 
                            onClick={toggleSidebar}
                            className="text-white p-2 focus:outline-none z-50 -ml-10 hover:bg-gray-800 rounded-lg transition-all duration-200"
                            aria-label="Open menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Centered Logo */}
                        <Link to="/home" className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center group">
                            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 
                                    to-indigo-600 bg-clip-text text-transparent animate-gradient-x 
                                    transition-all duration-300 group-hover:scale-105">
                                AcuLearn
                            </span>
                        </Link>

                        {/* Auth Links */}
                        <div className="flex items-center">
                            {isAuthenticated ? authlinks : guestlinks}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar navigation - overlays content */}
            <div className={`fixed top-0 left-0 h-full bg-gray-900 bg-opacity-95 shadow-2xl z-40 w-72 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Sidebar header */}
                <div className="pt-6 px-6 flex items-center justify-between border-b border-gray-800 pb-4">
                    <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl font-bold">A</span>
                        </div>
                        <span className="ml-3 text-2xl font-bold text-white">AcuLearn</span>
                    </div>
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Menu items with scrollbar */}
                <div className="pt-6 px-4 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
                    <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: rgba(75, 85, 99, 0.2);
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: linear-gradient(to bottom, #9333ea, #ec4899);
                            border-radius: 10px;
                        }
                        .custom-scrollbar {
                            scrollbar-width: thin;
                            scrollbar-color: #9333ea #111827;
                        }
                    `}</style>
                    
                    <div className="flex flex-col space-y-2">
                        {menuItems.map((item, index) => (
                            item.external ? (
                                <a 
                                    key={index}
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-3 text-gray-300 font-medium rounded-xl 
                                    transition-all duration-200 hover:text-white group hover:bg-gradient-to-r 
                                    hover:from-purple-600/20 hover:to-pink-600/20 border border-transparent
                                    hover:border-purple-500/50"
                                    onClick={() => setShowSidebar(false)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 group-hover:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                    </svg>
                                    <span>{item.name}</span>
                                    {item.external && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    )}
                                </a>
                            ) : (
                                <Link 
                                    key={index}
                                    to={item.path}
                                    className="flex items-center px-4 py-3 text-gray-300 font-medium rounded-xl 
                                    transition-all duration-200 hover:text-white group hover:bg-gradient-to-r 
                                    hover:from-purple-600/20 hover:to-pink-600/20 border border-transparent
                                    hover:border-purple-500/50"
                                    onClick={() => setShowSidebar(false)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 group-hover:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                    </svg>
                                    <span>{item.name}</span>
                                </Link>
                            )
                        ))}
                    </div>
                    <div className="h-4"></div>
                </div>
            </div>

            {/* Invisible backdrop just for clicking to close sidebar */}
            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-transparent z-30 transition-opacity duration-300"
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}

            {/* This div ensures the page content is padded properly below the fixed navbar */}
            <div className="pt-20"></div>
        </>
    );
};

export default NavBar;