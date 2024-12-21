import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    AppBar,
    Tabs,
    Tab,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import axios from 'axios';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ManageExam = () => {
    const [value, setValue] = useState(0);
    const [passingCriteria, setPassingCriteria] = useState('');
    const [duration, setDuration] = useState('');
    const [active, setActive] = useState(false);
    const [category, setCategory] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/category/fetchAll');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        // Fetch difficulties
        const fetchDifficulties = async () => {
            try {
                const response = await axios.get('http://localhost:8080/difficulty/fetchAll');
                setDifficulties(response.data);
            } catch (error) {
                console.error('Error fetching difficulties:', error);
            }
        };

        fetchCategories();
        fetchDifficulties();
    }, []);

    // Fetch questions based on category and difficulty
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/question/fetchToCreateExam?categoryId=` + category + "&difficultyLevelId=" + difficulty);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setCategory(value);
            setDifficulty(0); // Reset difficulty when changing category
            setQuestions([]);   // To reset questions fetched
        } else if (name === 'difficulty') {
            setDifficulty(value);
        } else if (name === 'duration') {
            setDuration(value);
        }
    };

    const handleQuestionSelect = (event, questionId) => {
        if (event.target.checked) {
            setSelectedQuestions([...selectedQuestions, questionId]);
        } else {
            setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isNaN(passingCriteria)) {
            setSnackbarMessage('Invalid Passing Criteria. Please enter a valid number.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        setActive(false);
        const newExamData = {
            passingCriteria: parseFloat(passingCriteria),
            duration: parseInt(duration),
            active: false
        }

        try {
            const response = await axios.post('http://localhost:8080/exam/createExam', newExamData);

            // Add questions to examQuestion
            for (let questionId of selectedQuestions) {
                const examQuestionData = {
                    examId: response.data.examId,
                    questionId: questionId,
                };

                try {
                    await axios.post('http://localhost:8080/examQuestion/addExamQuestion', examQuestionData);
                } catch (error) {
                    console.error(`Error adding question ${questionId} to exam:`, error);
                    setSnackbarMessage('Error adding some questions to the exam. Please try again.');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                }
            }
            // Reset all form fields after exam creation
            setPassingCriteria('');
            setDuration('');
            setActive(false);
            setCategory(0);
            setDifficulty(0);
            setSelectedQuestions([]);
            setQuestions([]);
            setSnackbarMessage('Exam created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error creating exam:', error);
            setSnackbarMessage('Error creating exam. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if ((category === 3 && difficulty !== 0) || category !== 3) {
            fetchQuestions();
        }
    }, [category, difficulty]);

    return (
        <Box sx={{ padding: 3, marginLeft: 4 }}>
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
                <Tabs value={value} onChange={handleChange} aria-label="exam management tabs">
                    <Tab label="Create Exam" sx={{ color: '#3f51b5', fontSize: '1.01rem' }} />
                    <Tab label="Assess Program" sx={{ color: '#3f51b5', fontSize: '1.01rem' }} />
                    <Tab label="Results" sx={{ color: '#3f51b5', fontSize: '1.01rem' }} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Typography variant="h6" gutterBottom>
                    Create New Exam
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Passing Criteria"
                                variant="outlined"
                                value={passingCriteria}
                                onChange={(e) => setPassingCriteria(e.target.value)}
                                required
                                type="number"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Duration (minutes)"
                                variant="outlined"
                                value={duration}
                                onChange={handleInputChange}
                                required
                                type="number"
                                name="duration"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined" required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    onChange={handleInputChange}
                                    label="Category"
                                    name="category"
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {category === 3 && (
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        value={difficulty}
                                        onChange={handleInputChange}
                                        label="Difficulty"
                                        name="difficulty"
                                    >
                                        {difficulties.map((difficulty) => (
                                            <MenuItem key={difficulty.difficultyLevelId} value={difficulty.difficultyLevelId}>
                                                {difficulty.difficultyLevel}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {questions.length > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Select Questions
                                </Typography>
                                <Box>
                                    {questions.map((question) => (
                                        <Box key={question.questionId} >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedQuestions.includes(question.questionId)}
                                                        onChange={(e) => handleQuestionSelect(e, question.questionId)}
                                                    />
                                                }
                                                label={question.question}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Create Exam
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </TabPanel>

            {/* Assess Program */}
            <TabPanel value={value} index={1}>
                <Typography variant="h6" gutterBottom>
                    Program
                </Typography>
            </TabPanel>

            <TabPanel value={value} index={2}>
                <Typography variant="h6" gutterBottom>
                    Exam Results
                </Typography>
            </TabPanel>
        </Box>
    );
};

export default ManageExam;
