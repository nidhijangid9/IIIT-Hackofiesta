// components/ChatBot/ChatBotIcon.jsx
import React from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

const ChatBotIcon = ({ isOpen, toggleChat }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
    >
      {isOpen ? (
        <FiX className="w-6 h-6" />
      ) : (
        <FiMessageCircle className="w-6 h-6" />
      )}
    </button>
  );
};

export default ChatBotIcon;