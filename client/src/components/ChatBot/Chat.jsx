import React, { useState, useEffect, useRef } from 'react';
import Bot from '../../assests/Bot.jpg';
import { FiPaperclip, FiMic, FiSend, FiX } from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const genAI = new GoogleGenerativeAI("AIzaSyCmfZHcW5BaPiVAsa1T4QJA_mTEaTWGClI");

// Utility functions
const cleanResponse = (text) => {
  let cleaned = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  cleaned = cleaned.split('\n').map(line => {
    return line.replace(/^[-*•]\s+/, '• ').trim();
  }).join('\n');

  return cleaned;
};

const formatResponse = (text) => {
  const paragraphs = text.split('\n').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => (
    <span key={index}>
      {paragraph}
      {index < paragraphs.length - 1 && <br />}<br />
    </span>
  ));
};

const Chat = ({ isOpen, toggleChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [documentContext, setDocumentContext] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If chat is not open, don't render anything
  if (!isOpen) return null;

  const simulateTyping = (response, callback) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback(response);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      const userQuestion = inputMessage;
      setInputMessage('');

      try {
        let response;
        
        if (documentContext) {
          setIsTyping(true);
          response = await axios.post('http://127.0.0.1:8000/bot/ask-question/', {
            question: userQuestion
          });
          
          const cleanedResponse = cleanResponse(response.data.answer);
          simulateTyping(cleanedResponse, (text) => {
            setMessages(prev => [...prev, {
              text: text,
              sender: 'bot'
            }]);
          });
        } else {
          setIsTyping(true)
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const result = await model.generateContent(userQuestion);
          const geminiResponse = await result.response;
          
          const cleanedResponse = cleanResponse(geminiResponse.text());
          simulateTyping(cleanedResponse, (text) => {
            setMessages(prev => [...prev, {
              text: text,
              sender: 'bot'
            }]);
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setIsTyping(false);
        setMessages(prev => [...prev, {
          text: "Sorry, I couldn't process your request.",
          sender: 'bot',
          error: true
        }]);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessages(prev => [...prev, {
        text: "File size too large. Please upload a file smaller than 10MB.",
        sender: 'bot',
        error: true
      }]);
      return;
    }

    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      setMessages(prev => [...prev, {
        text: "Unsupported file type. Please upload PDF, DOCX, or TXT files.",
        sender: 'bot',
        error: true
      }]);
      return;
    }

    setFileProcessing(true);
    setMessages(prev => [...prev, {
      text: `Processing file: ${file.name}...`,
      sender: 'bot'
    }]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'http://127.0.0.1:8000/bot/process-file/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setDocumentContext(response.data.text);

      setMessages(prev => [...prev, {
        text: `Uploaded file: ${file.name}`,
        sender: 'user',
        isFile: true
      }]);

      if (response.data.summary) {
        const cleanedSummary = cleanResponse(response.data.summary);
        setIsTyping(true);
        simulateTyping(cleanedSummary, (text) => {
          setMessages(prev => [...prev, {
            text: text,
            sender: 'bot'
          }]);
        });
      }

    } catch (error) {
      console.error('Error processing file:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error processing your file. Please try again.",
        sender: 'bot',
        error: true
      }]);
    } finally {
      setFileProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderFileUploadButton = () => (
    <label className={`cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 
      ${fileProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <FiPaperclip className='w-6 h-6 text-gray-500' />
      <input 
        type="file" 
        className='hidden' 
        onChange={handleFileUpload}
        disabled={fileProcessing}
        accept=".pdf,.docx,.txt"
      />
    </label>
  );

  const renderMessage = (message, index) => (
    <div 
      key={index} 
      className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
    >
      {message.sender === 'bot' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden mr-2 ring-2 ring-indigo-200">
          <img src={Bot} alt="Bot" className="w-full h-full object-cover" />
        </div>
      )}
      <div 
        className={`max-w-[70%] p-4 rounded-2xl shadow-sm whitespace-pre-wrap break-words ${
          message.sender === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
        } ${message.error ? 'bg-red-50 border-red-200 text-red-600' : ''} 
          ${message.isFile ? 'bg-green-50 border-green-200 text-green-600' : ''}`}
      >
        {message.sender === 'bot' ? formatResponse(message.text) : message.text}
      </div>
      {message.sender === 'user' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ml-2 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {message.isFile ? (
            <FiPaperclip className="w-5 h-5" />
          ) : (
            "You"
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed bottom-4 right-6 z-50 animate-slideUp">
      <div className='w-[400px] h-[600px] border rounded-3xl bg-white shadow-xl overflow-hidden'>
        {/* Header */}
        <div className='w-full h-[80px] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-3xl py-2 px-5 flex items-center justify-between border-b'>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full ring-2 ring-white/50 overflow-hidden bg-white p-0.5">
              <img 
                className="w-full h-full rounded-full object-cover" 
                src={Bot} 
                alt="Bot avatar" 
              />
            </div>
            <div className='ml-3'>
              <h3 className='font-bold text-lg text-white'>AI Assistant</h3>
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 ${fileProcessing ? 'bg-yellow-400' : 'bg-green-400'} rounded-full mr-2 animate-pulse`}></span>
                <p className='text-sm text-white/80'>
                  {fileProcessing ? 'Processing...' : 'Online'}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className='h-[calc(600px-160px)] overflow-y-auto p-4 bg-gray-50'
          style={{backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0,0,0,0.02) 2px, transparent 0)'}}
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 text-gray-500">
              <div className="w-20 h-20 mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                <FiMic className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="font-medium text-lg text-gray-700">Welcome to AI Assistant!</p>
              <p className="mt-2">Ask me anything or upload a document to analyze.</p>
            </div>
          )}
          {messages.map((message, index) => renderMessage(message, index))}
          {isTyping && (
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden mr-2 ring-2 ring-indigo-200">
                <img src={Bot} alt="Bot" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className='h-[80px] border-t bg-white p-4 shadow-inner'>
          <div className='flex items-center bg-gray-100 rounded-full pl-4 pr-2 py-2'>
            {renderFileUploadButton()}
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className='flex-1 bg-transparent px-2 py-1 focus:outline-none'
              disabled={fileProcessing}
            />

            <button 
              className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-200 text-gray-500'} transition-all duration-300`}
              onClick={() => setIsRecording(!isRecording)}
              disabled={fileProcessing}
            >
              <FiMic className='w-5 h-5' />
            </button>

            <button 
              className='p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white disabled:opacity-50 transition-opacity duration-200 ml-2'
              onClick={handleSendMessage}
              disabled={fileProcessing || !inputMessage.trim()}
            >
              <FiSend className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;