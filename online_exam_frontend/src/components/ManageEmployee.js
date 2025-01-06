import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManageEmployee = () => {
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [email, setEmail] = useState('');
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        if (!authenticated) {
            navigate('/');
        }
    }, [authenticated, navigate]);

    const handleAddEmployee = async () => {
        if (!email) {
            setSnackbarMessage('Please enter an email.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/employee/addEmployee', { emailId: email });
            setEmployees([...employees, response.data]);
            setEmail('');
            setSnackbarMessage('Employee added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setSnackbarMessage('Employee already exists');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setEmail('');
            } else {
                setSnackbarMessage('Error adding employee: ' + error.message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                sx={{
                    width: 400,
                    padding: 3,
                    backgroundColor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                }}
            >
                <Typography variant="h4" gutterBottom align="center">
                    Manage Employees
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            Add New Employee
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleAddEmployee}
                        >
                            Add Employee
                        </Button>
                    </Grid>
                </Grid>

                {/* Snackbar for notifications */}
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default ManageEmployee;
