import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { setAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const [emailId, setEmailID] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');   // For admin
  const [showPasswordField, setShowPasswordField] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message
    // Check if user is admin
    if (emailId === "admin@gmail.com") {
      if (!showPasswordField) {
        setShowPasswordField(true);
        return;
      } else if (password !== "AdminPassword") {
        setError("Invalid password for admin.");
        return;
      } else {
        setAuthenticated(true);
        setUser(emailId);
        navigate('/admin');
        return;
      }
    }

    try {
      const responseStudent = await axios.post('http://localhost:8080/student/login', {
        emailId: emailId,
      }); // check if the user is student
      if (responseStudent.data) {
        setAuthenticated(true);
        setUser(responseStudent.data);
        navigate('/student');
      } else {
        const responseEmployee = await axios.post('http://localhost:8080/employee/login', {
          emailId: emailId,
        }); // check if the user is employee
        if (responseEmployee.data) {
          setAuthenticated(true);
          setUser(responseEmployee.data);
          navigate('/home');
        } else {
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
            error={!!error}
            helperText={error}
            sx={{ backgroundColor: 'white' }}
          />
          {showPasswordField && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              error={!!error}
              helperText={error}
              sx={{ backgroundColor: 'white' }}
            />
          )}
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            {showPasswordField ? "Login as Admin" : "Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
