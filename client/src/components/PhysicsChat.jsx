import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  IconButton,
  Avatar,
  Paper,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const PhysicsChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const initialPhysicsMessages = [
    {
      text: "Can someone explain Newton's Third Law with an example?",
      timestamp: "10:30 AM",
      sender: "Vrinda"
    },
    {
      text: "Sure! Newton's Third Law states that for every action, there's an equal and opposite reaction. For example, when you're walking, you push the ground backward, and the ground pushes you forward with equal force.",
      timestamp: "10:32 AM",
      sender: "Harsh"
    },
    {
      text: "I'm still confused about the difference between mass and weight. Can anyone help?",
      timestamp: "10:35 AM",
      sender: "Siddhi"
    },
    {
      text: "Mass is the amount of matter in an object and remains constant everywhere. Weight is the force of gravity acting on the mass and changes depending on location. For example, your mass on Earth and Moon is same but weight is different!",
      timestamp: "10:37 AM",
      sender: "Veer"
    }
  ];

  useEffect(() => {
    setMessages(initialPhysicsMessages);
  }, []);

  const handleSendMessage = () => {
    if (currentMessage.trim() === '' && !selectedImage) return;

    const newMessage = {
      text: currentMessage,
      image: selectedImage,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user'
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage('');
    setSelectedImage(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const MessageBubble = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        {message.sender !== 'user' && (
          <Avatar
            sx={{
              bgcolor: message.sender === 'Harsh' ? '#e91e63' :
                      message.sender === 'Vrinda' ? '#9c27b0' :
                      message.sender === 'Veer' ? '#2196f3' :
                      '#4caf50'
            }}
          >
            {message.sender[0]}
          </Avatar>
        )}
        <Box>
          {message.sender !== 'user' && (
            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
              {message.sender}
            </Typography>
          )}
          <Box
            sx={{
              maxWidth: '400px',
              backgroundColor: message.sender === 'user' ? '#1976d2' : '#f5f5f5',
              color: message.sender === 'user' ? 'white' : 'black',
              borderRadius: 2,
              p: 1.5,
              boxShadow: 1,
            }}
          >
            {message.image && (
              <img 
                src={message.image} 
                alt="Uploaded content"
                style={{ maxWidth: '100%', borderRadius: 4, marginBottom: 8 }}
              />
            )}
            <Typography>{message.text}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
              {message.timestamp}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: '#ffffff'
      }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2 }}>
          Physics Chat Room
        </Typography>
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2, 
        bgcolor: '#f8f9fa',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}>
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </Box>

      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0', 
        bgcolor: '#ffffff'
      }}>
        {selectedImage && (
          <Box sx={{ mb: 1 }}>
            <img 
              src={selectedImage} 
              alt="Selected" 
              style={{ maxHeight: 100, borderRadius: 4 }}
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <input
            type="file"
            accept="image/*"
            id="physics-image-upload"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <label htmlFor="physics-image-upload">
            <IconButton 
              component="span" 
              color="primary"
              sx={{ 
                bgcolor: '#f5f5f5',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <ImageIcon />
            </IconButton>
          </label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            size="small"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            autoComplete="off"
            InputProps={{
              sx: {
                bgcolor: '#ffffff',
                '&.Mui-focused': {
                  bgcolor: '#ffffff',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                }
              }
            }}
          />
          <IconButton 
            color="primary"
            onClick={handleSendMessage}
            sx={{ 
              bgcolor: '#1976d2',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#1565c0',
              },
              width: '40px',
              height: '40px'
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PhysicsChat;