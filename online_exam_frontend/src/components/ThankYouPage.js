import { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {

    const { authenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated) {
            navigate('/');
        }
    }, [authenticated, navigate]);

    return (
        <Container sx={{ textAlign: 'center', marginTop: '50px' }}>
            <Box sx={{ backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Thank You for Submitting Your Exam!
                </Typography>
                <Typography variant="body1" paragraph>
                    Your exam has been successfully submitted. We will review your responses shortly.
                </Typography>
            </Box>
        </Container>
    );
};

export default ThankYouPage;
