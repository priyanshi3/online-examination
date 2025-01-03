import React, { useState, useEffect, createContext } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ExamContext = createContext();

const HomePageStudent = () => {

  const [exam, setExam] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    const fetchActiveExam = async () => {
      try {
        const response = await axios.post('http://localhost:8080/exam/fetchActiveExam');
        setExam(response.data);
      } catch (error) {
        console.error('Error fetching active exam:', error);
      }
    };

    fetchActiveExam();
  }, []);

  const startExam = () => {
    setExamStarted(true);
    navigate('exam');
  };

  return (
    <ExamContext.Provider value={{ exam, setExam }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        height: '100vh',
      }}>

        {!examStarted ? (
          <Container maxWidth="sm" sx={{ padding: '40px', backgroundColor: '#f4f4f9', borderRadius: '8px', boxShadow: 3 }}>
            <Typography variant="h3" component="h1" align="center" sx={{ marginBottom: 4, color: '#333' }}>
              Welcome to the Aptitude Exam
            </Typography>
            <Box>
              <Typography variant="h5" sx={{ marginBottom: 1, color: '#555' }}>
                Instructions:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Read all the questions carefully. Answer all the questions to the best of your ability." />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`You have ${exam?.duration} minutes to complete the exam. Exam will be auto-submitted after ${exam?.duration} minutes.`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Once you start the exam, you cannot pause it or change tabs or window." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Test will be submitted automatically on tab or window change and after test duration." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Click 'Start Exam' to begin." />
                </ListItem>
              </List>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 3, fontSize: '1.2rem', }}
                onClick={startExam}
              >
                Start Exam
              </Button>
            </Box>
          </Container>

        ) : <Outlet />
        }
      </Box>
    </ExamContext.Provider>
  );
};

export { ExamContext };
export default HomePageStudent;
