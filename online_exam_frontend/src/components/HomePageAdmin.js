import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ManageStudents from './ManageStudents';
import ManageQuestions from './ManageQuestions';
import ManageExam from './ManageExam';

const HomePageAdmin = () => {
  const { authenticated, emailId } = useAuth();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState('welcome');

  const handleMenuItemClick = (path, item) => {
    navigate('.' + path);
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'students':
        return <ManageStudents />;
      case 'questions':
        return <ManageQuestions />;
      case 'exams':
        return <ManageExam />;
      default:
        return <Typography align="center" sx={{ fontSize: '24px' }}>Welcome, {emailId}</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: 200,
          height: '100vh',
          bgcolor: 'white',
          color: 'black',
          position: 'fixed',
          top: 0,
          left: 0,
          paddingTop: '64px',
          boxShadow: 5,
        }}
      >
        <List>
          <ListItem>
            <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
              Welcome
            </Typography>
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/students', 'students')}>
            <ListItemText primary="Students" sx={{ color: 'black' }} />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/questions', 'questions')}>
            <ListItemText primary="Questions" sx={{ color: 'black' }} />
          </ListItem>
          <ListItem button onClick={() => handleMenuItemClick('/exams', 'exams')}>
            <ListItemText primary="Exams" sx={{ color: 'black' }} />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Toolbar />
        <Container sx={{ marginTop: 4 }}>
          {renderContent()} {/* Render content based on the selected item */}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePageAdmin;
