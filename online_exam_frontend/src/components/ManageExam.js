import React, { useState, useEffect, useContext } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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
    const [value, setValue] = useState(0);  // for tabs
    const [active, setActive] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    // to create exam
    const [passingCriteria, setPassingCriteria] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    // to activate exam
    const [exams, setExams] = useState([]);
    const [activeExam, setActiveExam] = useState({});
    // to assess program
    const [programCodes, setProgramCodes] = useState([]);
    const [marks, setMarks] = useState({});
    const [finalMarks, setFinalMarks] = useState({});
    // to view result
    const [results, setResults] = useState([]);
    const [filterPassing, setFilterPassing] = useState(false);
    const [sortTotalScore, setSortTotalScore] = useState(false);
    const [filteredResults, setFilteredResults] = useState(results);

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

    // fetch exams to activate
    const fetchExams = async () => {
        try {
            const response = await axios.get('http://localhost:8080/exam/fetchAll');
            setExams(response.data);
            response.data.map((exam) => exam.active ? setActiveExam(exam) : null);
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };

    // fetch programCodes to assess
    const fetchProgramCodes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/programCheck/fetchAll');
            setProgramCodes(response.data);
        } catch (error) {
            console.error("Error fetching program codes to assess:", error);
        }
    }

    // fetch all results for active exam
    const fetchResults = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/result/fetchAllByExam?examId=${parseInt(activeExam.examId)}`);
            setResults(response.data);
            setFilteredResults(response.data);
        } catch (error) {
            console.error("Error fecthing result: ", error);
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchDifficulties();
        fetchExams();
        fetchProgramCodes();
    }, []);

    useEffect(() => {
        if (activeExam) {
            fetchResults(); // Fetch results only after activeExam is set
        }
    }, [activeExam]);

    // Fetch questions based on category and difficulty
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/question/fetchToCreateExam?categoryId=` + category + "&difficultyLevelId=" + difficulty);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    // Change in category or difficulty selection
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

    // Handles selected questions to create exam
    const handleQuestionSelect = (event, questionId) => {
        if (event.target.checked) {
            setSelectedQuestions([...selectedQuestions, questionId]);
        } else {
            setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
        }
    };

    // For tab change
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // To create new exam
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

    // Fetch questions according to category and difficulty selected
    useEffect(() => {
        if ((category === 3 && difficulty !== 0) || category !== 3) {
            fetchQuestions();
        }
    }, [category, difficulty]);

    // To activate exam
    const handleExamOperation = async (operation, exam) => {
        try {
            await axios.put(`http://localhost:8080/exam/manageExam/${exam.examId}?operation=${operation}`);
            fetchExams();
            if (operation === 'activate') {
                setActiveExam(exam);
            }
            else if (operation === 'deactivate') {
                setActiveExam(null);
            }
            setSnackbarMessage(
                operation === 'activate'
                    ? 'Exam activated successfully!'
                    : operation === 'deactivate'
                        ? 'Exam deactivated successfully!'
                        : 'Exam deleted successfully!'
            );
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error(`Error performing ${operation} operation:`, error);
            setSnackbarMessage(
                `Failed to ${operation} exam. Please try again.`
            );
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };


    // To set marks of program codes
    const handleMarksChange = async (programCheckId) => {
        const markToSend = marks[programCheckId] || 0;
        try {
            await axios.put(`http://localhost:8080/programCheck/update/${programCheckId}/${parseInt(activeExam.examId)}`, markToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            setFinalMarks((finalMarks) => ({
                ...finalMarks,
                [programCheckId]: markToSend,
            }));
            setSnackbarMessage('Marks updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchResults();
        } catch (error) {
            console.error('Error updating marks:', error);
            setSnackbarMessage('Failed to update marks. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // to filter the exam result
    const applyFilters = () => {
        let filtered = [...results];

        // Filter by passing score
        if (filterPassing && results[0].exam.passingCriteria) {
            const passing = parseInt(results[0].exam.passingCriteria, 10);
            filtered = filtered.filter((result) => result.totalScore >= passing);
        }

        // Sort by total score (high to low)
        if (sortTotalScore) {
            filtered.sort((a, b) => b.totalScore - a.totalScore);
        }

        setFilteredResults(filtered);
    };

    // reset filters
    const resetFilters = () => {
        setFilterPassing(false);
        setSortTotalScore(false);
        setFilteredResults(results);
    };

    return (
        <Box sx={{ padding: 3, marginLeft: 4 }}>
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
                <Tabs value={value} onChange={handleChange} aria-label="exam management tabs">
                    <Tab label="Create Exam" sx={{ color: '#3f51b5', fontSize: '1.01rem' }} />
                    <Tab label="Activate Exam" sx={{ color: '#3f51b5', fontSize: '1.01rem' }} />
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

            {/* Activate exam */}
            <TabPanel value={value} index={1}>
                <Typography variant="h6" gutterBottom>
                    Activate Exam
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Exam ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Passing criteria</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Duration(minutes)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Active Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exams.map((exam) => (
                                <TableRow key={exam.examId}>
                                    <TableCell>{exam.examId}</TableCell>
                                    <TableCell>{exam.passingCriteria}</TableCell>
                                    <TableCell>{exam.duration}</TableCell>
                                    <TableCell>{exam.active ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell>
                                        {exam.active ? (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleExamOperation('deactivate', exam)}
                                            >
                                                Deactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleExamOperation('activate', exam)}
                                            >
                                                Activate
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ marginLeft: 1 }}
                                            onClick={() => handleExamOperation('delete', exam)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </TabPanel>

            {/* Assess Program */}
            <TabPanel value={value} index={2}>
                <Typography variant="h6" gutterBottom>
                    Program Assessment
                </Typography>
                {/*questionId and their questions */}
                <Box sx={{ marginBottom: 2 }}>
                    <Paper variant="outlined" sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {/* Map for deduplication to remove duplicate questionID display */}
                            {[...new Map(programCodes.map((program) => [program.question.questionId, program])).values()]
                                .map((program) => (
                                    <Box
                                        key={program.programCheckId}
                                        sx={{
                                            display: 'flex',
                                            padding: 1,
                                            borderRadius: 1,
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                                            gap: 3
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Question ID:
                                            </Typography>
                                            <Typography variant="body2">{program.question.questionId}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', marginLeft: 2 }}>
                                                Question:
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                {program.question.question}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                        </Box>
                    </Paper>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Question ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Program Code</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Marks</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {programCodes
                                .filter((program) => !finalMarks[program.programCheckId])
                                .map((program) => (
                                    <TableRow key={program.programCheckId}>
                                        <TableCell>{program.question.questionId}</TableCell>
                                        <TableCell sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{program.programCode}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={marks[program.programCheckId] || ''}
                                                onChange={(e) => {
                                                    setMarks((marks) => ({
                                                        ...marks,
                                                        [program.programCheckId]: e.target.value,
                                                    }));
                                                }}
                                                placeholder="Enter Marks"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    fontSize: '1.5rem',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleMarksChange(program.programCheckId)}
                                            >
                                                ✅
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </TabPanel>

            <TabPanel value={value} index={3}>
                <Typography variant="h6" gutterBottom>
                    Exam Results
                </Typography>
                {/* Filter and Sort Controls */}
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filterPassing}
                                onChange={(e) => setFilterPassing(e.target.checked)}
                            />
                        }
                        label="Filter by Passing Criteria"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={sortTotalScore}
                                onChange={(e) => setSortTotalScore(e.target.checked)}
                            />
                        }
                        label="Sort by Total Score (High to Low)"
                    />
                    <Button variant="contained" onClick={applyFilters}>
                        Apply Filters
                    </Button>
                    <Button variant="outlined" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Exam</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Logical Score</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Technical Score</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Program Score</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Total Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredResults.map((result) => (
                                <TableRow key={result.resultId}>
                                    <TableCell>{result.exam.examId}</TableCell>
                                    <TableCell sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result.student.lastName + " " + result.student.firstName}</TableCell>
                                    <TableCell>{result.logicalScore}</TableCell>
                                    <TableCell>{result.technicalScore}</TableCell>
                                    <TableCell>{result.programScore}</TableCell>
                                    <TableCell>{result.totalScore}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar> */}
            </TabPanel>
        </Box>
    );
};

export default ManageExam;
