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
    MenuItem,
    Select,
    InputLabel,
} from '@mui/material';
import axios from 'axios';
import { useTimer } from 'react-timer-hook';
import { useNavigate } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';

function MyTimer({ expiryTimestamp, onPause, handleSubmitExam }) {
    const {
        seconds,
        minutes,
        hours,
        days,
        pause,
    } = useTimer({
        expiryTimestamp,
        onExpire: () => {
            handleSubmitExam();
        }
    });

    React.useEffect(() => {
        if (onPause) {
            onPause(() => pause);
        }
    }, [pause, onPause]);


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
    const navigate = useNavigate();
    const { authenticated, user } = useAuth();
    const { exam, setExam } = useContext(ExamContext);
    const [pauseFunction, setPauseFunction] = useState(null);       // to pause the timer and submit exam
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editorLanguage, setEditorLanguage] = useState('javascript');

    // for timer
    const time = new Date();
    time.setSeconds(time.getSeconds() + 60 * (exam.duration));

    useEffect(() => {
        if (!authenticated) {
            navigate('/');
        }
    }, [authenticated, navigate]);

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
                alert('You cannot switch to another tab during the exam!');
                if (pauseFunction) {
                    pauseFunction();
                    handleSubmitExam();
                } else {
                    console.warn("Pause function is not available.");
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Disable certain keys
        const disableKeys = (event) => {
            const forbiddenKeys = ['Alt', 'Meta'];

            if (forbiddenKeys.includes(event.key) || event.altKey || event.metaKey) {
                event.preventDefault();
                alert('This key combination is disabled during the exam.');
            }
        };

        // Add the event listener
        document.addEventListener('keydown', disableKeys);



        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', disableKeys);
        };
    }, [pauseFunction]);

    const handleAnswerChange = (event) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = {
            ...answers[currentQuestionIndex],
            optionId: event.target.value
        };
        setAnswers(updatedAnswers);
    };

    const handleProgrammingAnswerChange = (value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = {
            ...answers[currentQuestionIndex],
            optionId: value,
        };
        setAnswers(updatedAnswers);
    };

    const isQuestionAnswered = (index) => {
        return answers[index]?.optionId !== null && answers[index]?.optionId !== '';
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

    const handleLanguageChange = (event) => {
        setEditorLanguage(event.target.value);
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
        navigate('/student/thankYou');
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
                                                borderColor: isQuestionAnswered(index) ? 'green' : 'blue',
                                                bgcolor: currentQuestionIndex === index ? isQuestionAnswered(index) ? 'green' : 'blue' : isQuestionAnswered(index) ? 'green' : 'transparent',
                                                color: currentQuestionIndex === index ? 'white' : isQuestionAnswered(index) ? 'white' : 'blue',
                                                width: 40,
                                                height: 40,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: isQuestionAnswered(index) ? 'green' : 'blue',
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
                    <MyTimer expiryTimestamp={time} onPause={setPauseFunction} handleSubmitExam={handleSubmitExam} />
                    <Container sx={{ textAlign: 'left' }} >

                        <Typography variant="h5">{questions[currentQuestionIndex].question}</Typography>

                        {questions[currentQuestionIndex].categoryId.categoryName === 'Programming' ? (
                            <>
                                <FormControl sx={{ marginTop: '20px', minWidth: 120, height: '40px' }}>
                                    <InputLabel id="language-select-label">Language</InputLabel>
                                    <Select
                                        value={editorLanguage}
                                        onChange={handleLanguageChange}
                                        label="Language"
                                    >
                                        <MenuItem value="javascript">JavaScript</MenuItem>
                                        <MenuItem value="python">Python</MenuItem>
                                        <MenuItem value="java">Java</MenuItem>
                                        <MenuItem value="csharp">C#</MenuItem>
                                        <MenuItem value="cpp">C++</MenuItem>
                                        <MenuItem value="sql">SQL</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box sx={{ marginTop: '20px' }}>
                                    <MonacoEditor
                                        height="500px"
                                        defaultLanguage={editorLanguage}
                                        value={answers[currentQuestionIndex]?.optionId || ''}
                                        onChange={handleProgrammingAnswerChange}
                                        options={{
                                            selectOnLineNumbers: true,
                                            minimap: { enabled: false },
                                        }}
                                        theme="vs-dark"
                                    />
                                </Box>
                            </>
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
        </>
    );
};

export default Exam;