import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import ScienceIcon from '@mui/icons-material/Science';

const ConnectIQ = () => {
  const navigate = useNavigate();

  const handlePhysicsClick = () => {
    navigate('/physics-chat');
  };

  const handleChemistryClick = () => {
    navigate('/chemistry-chat');
  };

  const cardStyle = {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
    }
  };

  return (
    <Box sx={{ p: 4, background: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: '#1a237e' }}>
        Connect IQ Chat Rooms
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle} onClick={handlePhysicsClick}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <ConstructionIcon sx={{ fontSize: 80, color: '#1976d2', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Physics Chat Room
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                Discuss physics problems and concepts
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
                Join discussions on mechanics, energy, waves, and more
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Chip label="Mechanics" color="primary" />
                <Chip label="Energy" color="secondary" />
                <Chip label="Waves" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle} onClick={handleChemistryClick}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <ScienceIcon sx={{ fontSize: 80, color: '#9c27b0', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Chemistry Chat Room
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                Discuss chemistry problems and concepts
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
                Explore chemical reactions, periodic table, and more
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Chip label="Reactions" color="primary" />
                <Chip label="Periodic Table" color="secondary" />
                <Chip label="Solutions" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConnectIQ;