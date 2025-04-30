import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
    Paperclip, MapPin, Image, Share2, Smile, List, 
    Settings, Camera, Download, Maximize, Sparkles,
    Zap, ChevronRight, Moon, Sun, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

const Blogs = () => {
    const [content, setContent] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [topics, setTopic] = useState('');
    const [blog, setBlog] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('read');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/blog/');
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchData();
    }, []);

    // Handle clicking outside emoji picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmoji(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert('File size too large. Please select an image under 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setContent(prevContent => prevContent + emojiObject.emoji);
        setShowEmoji(false);
    };

    const handlePublish = async () => {
        if (!title.trim() || !name.trim() || !content.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        const blogData = {
            title,
            author: name,
            keytopics: topics,
            content,
            image: selectedImage,
            created_at: new Date().toISOString()
        };

        try {
            // In a real application, you would make an API call here
            setBlog(prevBlogs => [blogData, ...prevBlogs]);
            setActiveSection('read');
            
            // Reset form
            setTitle('');
            setName('');
            setTopic('');
            setContent('');
            setSelectedImage(null);
            
            alert('Blog published successfully!');
        } catch (error) {
            console.error('Error publishing blog:', error);
            alert('Failed to publish blog. Please try again.');
        }
    };

    const BlogCard = ({ post, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
            }`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {post.author[0].toUpperCase()}
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{post.author}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </div>
            {post.image && (
                <div className="overflow-hidden rounded-lg mb-4">
                    <img 
                        src={post.image} 
                        alt="Blog" 
                        className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
            <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-5 line-clamp-3`}>
                {post.content}
            </p>
            <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium truncate max-w-[150px]">
                    {post.keytopics}
                </span>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBlog(post)}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium flex items-center gap-1"
                >
                    Read More
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );

    const BlogModal = ({ blog, onClose }) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8 overflow-y-auto"
          onClick={() => onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 0 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9 }}
            className={`relative max-w-3xl w-full rounded-xl p-6 md:p-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-2xl mt-115 mb-8`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 pt-2">{blog.title}</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {blog.author[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{blog.author}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {new Date(blog.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            {blog.image && (
              <div className="overflow-hidden rounded-xl mb-6">
                <img 
                  src={blog.image} 
                  alt="Blog" 
                  className="w-full h-60 md:h-80 object-cover"
                />
              </div>
            )}
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} whitespace-pre-wrap text-base md:text-lg leading-relaxed`}>
              {blog.content}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {blog.keytopics.split(',').map((topic, index) => (
                <span key={index} className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium">
                  {topic.trim()}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            {/* Header */}
            <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="relative overflow-hidden h-64"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                <div className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] opacity-20 bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-600/30" />
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
                    <motion.h1 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-7xl font-bold text-white mb-2"
                    >
                        Blog<span className="text-yellow-300">Space</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-2xl text-gray-100 tracking-wide font-light"
                    >
                        Where ideas come to life
                    </motion.p>
                </div>
                
                {/* Animated particles */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ 
                                x: Math.random() * window.innerWidth, 
                                y: Math.random() * window.innerHeight,
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{ 
                                y: [null, Math.random() * -100],
                                opacity: [0.7, 0]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: Math.random() * 10 + 10,
                                ease: "linear" 
                            }}
                            className="absolute w-2 h-2 rounded-full bg-white opacity-70"
                        />
                    ))}
                </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 -mt-6 mb-12 relative z-10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection('read')}
                    className={`px-8 py-3 rounded-full font-medium shadow-lg ${
                        activeSection === 'read' 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                >
                    Read Blogs
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection('write')}
                    className={`px-8 py-3 rounded-full font-medium shadow-lg ${
                        activeSection === 'write' 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                >
                    Write Blog
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-3 rounded-full shadow-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {activeSection === 'read' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="container mx-auto px-6 py-4 mb-16"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blog.map((post, index) => (
                                <BlogCard key={index} post={post} index={index} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeSection === 'write' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-4xl mx-auto px-6 py-4 mb-16"
                    >
                        <div className={`rounded-xl shadow-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className="text-2xl font-bold mb-6 text-center">Share Your Thoughts</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg ${
                                            isDarkMode 
                                                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                                                : 'bg-gray-50 text-gray-900 border-gray-200'
                                        } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                </div>
                                
                                <div>
                                    <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Blog Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Give your blog a catchy title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg ${
                                            isDarkMode 
                                                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                                                : 'bg-gray-50 text-gray-900 border-gray-200'
                                        } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                </div>
                                
                                <div>
                                    <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Topics
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Add topics separated by commas (tech, travel, food)"
                                        value={topics}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg ${
                                            isDarkMode 
                                                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                                                : 'bg-gray-50 text-gray-900 border-gray-200'
                                        } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                </div>
                                
                                <div>
                                    <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Add Media
                                    </label>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => fileInputRef.current.click()}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Image className="w-5 h-5" />
                                            <span>Upload Image</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowEmoji(!showEmoji)}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Smile className="w-5 h-5" />
                                            <span>Add Emoji</span>
                                        </motion.button>
                                    </div>

                                    {selectedImage && (
                                        <div className="relative mb-6 border-2 border-blue-500 rounded-lg p-2">
                                            <img 
                                                src={selectedImage} 
                                                alt="Selected" 
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => setSelectedImage(null)}
                                                className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="relative">
                                    <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Your Story
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Share your thoughts, experiences, or knowledge..."
                                        className={`w-full h-64 p-4 rounded-lg ${
                                            isDarkMode 
                                                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                                                : 'bg-gray-50 text-gray-900 border-gray-200'
                                        } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                    />
                                    
                                    {showEmoji && (
                                        <div ref={emojiPickerRef} className="absolute bottom-full right-0 mb-2 z-50">
                                            <EmojiPicker 
                                                onEmojiClick={handleEmojiClick}
                                                theme={isDarkMode ? 'dark' : 'light'}
                                            />
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handlePublish}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg transition-all"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Publish Your Blog
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedBlog && (
                    <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Blogs;