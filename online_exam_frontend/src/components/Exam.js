import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';   // Get student email
import { ExamContext } from './HomePageStudent';
import {
    Box,
    Typography,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    List,
    ListItem,
    ListItemText,
    Divider,
    Container,
    Avatar,
    Grid,
    TextField,
    Toolbar,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';
import { useTimer } from 'react-timer-hook';

function MyTimer({ expiryTimestamp }) {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '10px',
                right: '20px',
                background: '#f5f5f5',
                padding: '10px 20px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '20px',
                textAlign: 'center',
                marginTop: '5rem',
                marginRight: '3rem'
            }}
        >
            <Typography variant="h6" color="blue">
                Time Left
            </Typography>
            <Typography variant="h5">
                {days}:{hours}:{minutes}:{seconds}
            </Typography>
        </Box>
    );
}

const Exam = () => {
    const { user } = useAuth();
    const { exam, setExam } = useContext(ExamContext);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    // for timer
    const time = new Date();
    time.setSeconds(time.getSeconds() + 60 * (exam.duration));

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questionResponse = await axios.get('http://localhost:8080/question/fetchQuestionForExam?examId=' + parseInt(exam.examId));

                const questionsWithOptions = await Promise.all(questionResponse.data.map(async (question) => {
                    try {
                        const optionsResponse = await axios.get('http://localhost:8080/options/fetchOptionsForExam?questionId=' + parseInt(question.questionId));
                        return {
                            ...question,
                            options: optionsResponse.data
                        };
                    } catch (error) {
                        console.log("Error fetching options:", error);
                    }
                }));
                setQuestions(questionsWithOptions);
                setAnswers(questionResponse.data.map((q) => ({ questionId: parseInt(q.questionId), optionId: null })));
            } catch (error) {
                console.log("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();

        // Prevent text selection during the exam
        document.body.style.userSelect = 'none';

        // Prevent right-click menu
        const preventContextMenu = (event) => {
            event.preventDefault();
            alert('Right-click is disabled during the exam.');
        };
        document.addEventListener('contextmenu', preventContextMenu);

        // Handle visibility change (when switching tabs)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // alert('You cannot switch to another tab during the exam!');
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleAnswerChange = (event) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = {
            ...answers[currentQuestionIndex],
            optionId: event.target.value
        };
        setAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSelectQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmitExam = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/answer/submitAnswer?studentId=${user.studentId}&examId=${parseInt(exam.examId)}`, answers);
            if (response.data === "success") {
                setSnackbarMessage('Exam submitted successfully!');
                setSnackbarSeverity('success');
            } else {
                setSnackbarMessage(response.data);
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
        } catch (error) {
            console.error(`Error submitting exam:`, error);
            setSnackbarMessage('Error submitting exam. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <Typography variant="h6">Loading questions...</Typography>;
    }

    return (
        <>
            <Box sx={{ display: 'flex', height: '100vh', }}>
                {/* Question navigation */}
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
                            <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: '20px' }}>
                                Exam Navigation
                            </Typography>
                        </ListItem>
                        <Divider />
                        {Array.isArray(questions) && questions.length > 0 ? (
                            <Grid container spacing={1} sx={{ padding: 1 }}>
                                {questions.map((question, index) => (
                                    <Grid item xs={4} key={question.questionId}>
                                        <Avatar
                                            sx={{
                                                border: '2px solid',
                                                borderColor: 'primary.main',
                                                bgcolor: currentQuestionIndex === index ? 'blue' : 'transparent',
                                                color: currentQuestionIndex === index ? 'white' : 'blue',
                                                width: 40,
                                                height: 40,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                },
                                            }}
                                            onClick={() => handleSelectQuestion(index)}
                                        >
                                            {index + 1}
                                        </Avatar>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <ListItem>
                                <ListItemText primary="No questions available." />
                            </ListItem>
                        )}
                    </List>
                </Box>

                {/* Questions */}
                <Box sx={{
                    flexGrow: 1, padding: 2, minWidth: '100vh', justifyContent: 'center', marginTop: 5
                }}>
                    <Toolbar />
                    <MyTimer expiryTimestamp={time} />
                    <Container sx={{ textAlign: 'left' }} >

                        <Typography variant="h5">{questions[currentQuestionIndex].question}</Typography>

                        {questions[currentQuestionIndex].categoryId.categoryName === 'Programming' ? (
                            <TextField
                                multiline
                                rows={15}
                                variant="outlined"
                                fullWidth
                                value={answers[currentQuestionIndex]?.optionId || ''}
                                onChange={handleAnswerChange}
                                placeholder="Your answer here..."
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'white',
                                    fontFamily: 'monospace',
                                    fontSize: '16px',
                                    padding: 2
                                }}
                            />
                        ) : (
                            <FormControl component="fieldset" sx={{ marginTop: '20px' }}>
                                <RadioGroup
                                    name={`question-${currentQuestionIndex}`}
                                    value={answers[currentQuestionIndex]?.optionId || ''}
                                    onChange={handleAnswerChange}
                                >
                                    {questions[currentQuestionIndex]?.options.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={option.optionId}
                                            control={<Radio />}
                                            label={option.optionText}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}


                        <Box sx={{ marginTop: '20px' }}>
                            <Button
                                variant="outlined"
                                disabled={currentQuestionIndex === 0}
                                onClick={handlePrevQuestion}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ marginLeft: '10px' }}
                                disabled={currentQuestionIndex === questions.length - 1}
                                onClick={handleNextQuestion}
                            >
                                Next
                            </Button>
                        </Box>

                        <Box sx={{ marginTop: '20px' }}>
                            <Button variant="contained" color="primary" onClick={handleSubmitExam}>
                                Submit Exam
                            </Button>
                        </Box>
                    </Container>
                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
            {/* <MyTimer expiryTimestamp={time} /> */}
        </>
    );
};

export default Exam;