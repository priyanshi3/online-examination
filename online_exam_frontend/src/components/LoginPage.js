import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { setAuthenticated, setEmailId } = useAuth();
  const navigate = useNavigate();

  const [emailId, setEmailID] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    try {
      const responseStudent = await axios.post('http://localhost:8080/student/login', {
        emailId: emailId,
      }); // check if the user is student
      if (responseStudent.data) {
        setAuthenticated(true);
        setEmailId(emailId);
        navigate('/exam');
      } else {
        const responseEmployee = await axios.post('http://localhost:8080/employee/login', {
          emailId: emailId,
        }); // check if the user is employee
        if (responseEmployee.data) {
          setAuthenticated(true);
          setEmailId(emailId);
          navigate('/home');
        }
        else {
          setAuthenticated(false);
          setError("Invalid email");
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex',
      paddingTop: '10rem',
    }}>
      <Paper elevation={10} sx={{ padding: 4, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" align="center" sx={{ marginBottom: 2, color: '#3f51b5' }}>
          Welcome
        </Typography>
        <Typography variant="body1" align="center" sx={{ marginBottom: 2 }}>
          Please login to your account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={emailId}
            onChange={(e) => setEmailID(e.target.value)}
            autoComplete="email"
            autoFocus
            variant="outlined"
            error={!!error} // Show error if there's an error message
            helperText={error} // Display error message
            sx={{ backgroundColor: 'white' }}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
