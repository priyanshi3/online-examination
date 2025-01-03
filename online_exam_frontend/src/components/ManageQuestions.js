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
  Radio,
  FormControlLabel,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManageQuestions = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    category: 0,
    difficulty: 0,
    numberOfOptions: 2,
    options: ['', '', '', ''],
    answerOption: ' ',
    programmingDetails: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === 1 || value === 2) {
        setNewQuestion({ ...newQuestion, [name]: value, difficulty: 0, numberOfOptions: 2 });
      } else {
        setNewQuestion({ ...newQuestion, [name]: value, numberOfOptions: 0 });
      }
    } else {
      setNewQuestion({ ...newQuestion, [name]: value });
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleNumberOfOptionsChange = (value) => {
    const newNumberOfOptions = Math.max(2, Math.min(4, value));
    const updatedOptions = newQuestion.options.slice(0, newNumberOfOptions);
    // Fill the remaining options with empty strings 
    while (updatedOptions.length < newNumberOfOptions) {
      updatedOptions.push('');
    }
    setNewQuestion({ ...newQuestion, numberOfOptions: newNumberOfOptions, options: updatedOptions });
  };

  const handleAnswerChange = (event) => {
    setNewQuestion({ ...newQuestion, answerOption: event.target.value });
  };

  const handleSubmit = async () => {
    const { questionText, category, difficulty, options, answerOption, programmingDetails } = newQuestion;

    let questionData = {
      question: questionText,
      categoryId: parseInt(category, 10),
    };

    if (difficulty !== 0) {
      questionData.difficultyLevelId = parseInt(difficulty, 10);
    }

    try {
      const response = await axios.post('http://localhost:8080/question/addQuestion', questionData);
      console.log('Question submitted successfully:', response.data);

      // add options value to database
      const newQuestionId = parseInt(response.data.questionId, 10);
      if (difficulty === 0) {
        for (const option of options) {
          if (option !== '') {
            const optionData = {
              optionText: option,
              questionId: newQuestionId
            };
            try {
              await axios.post('http://localhost:8080/options/addOption', optionData);

              // add answer value to database
              const answerData = {
                questionId: newQuestionId,
                optionId: answerOption
              }
              try {
                await axios.post('http://localhost:8080/answer/addAnswer', answerData);
              } catch (error) {
                console.error('Error submitting answer:', error);
                setSnackbarMessage('Error submitting answer. Please try again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
              }
            } catch (error) {
              console.error('Error submitting option:', error);
              setSnackbarMessage('Error submitting option. Please try again.');
              setSnackbarSeverity('error');
              setSnackbarOpen(true);
            }
          }
        }
      }
      else {
        const programData = {
          programSolution: programmingDetails,
          questionId: newQuestionId
        }
        try {
          await axios.post('http://localhost:8080/program/addProgram', programData);
        } catch (error) {
          console.error('Error submitting program solution:', error);
          setSnackbarMessage('Error submitting program solution. Please try again.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
      // Reset the form after successful submission
      setNewQuestion({
        questionText: '',
        category: '',
        difficulty: '',
        numberOfOptions: 2,
        options: ['', '', '', ''],
        answerOption: '',
        programmingDetails: '',
      });

      // Success message
      setSnackbarMessage('Question submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error submitting question:', error);
      setSnackbarMessage('Error submitting question. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3, marginLeft: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Questions
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Add New Question</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Question Text"
            name="questionText"
            value={newQuestion.questionText}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newQuestion.category}
              onChange={handleInputChange}
              label="Category"
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No categories available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        {newQuestion.category === 3 ? (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={newQuestion.difficulty}
                  onChange={handleInputChange}
                  label="Difficulty"
                  required
                >
                  {difficulties.length > 0 ? (
                    difficulties.map((difficulty) => (
                      <MenuItem key={difficulty.difficultyLevelId} value={difficulty.difficultyLevelId}>
                        {difficulty.difficultyLevel}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No difficulties available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Programming Details"
                name="programmingDetails"
                value={newQuestion.programmingDetails}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Options"
                type="number"
                value={newQuestion.numberOfOptions}
                onChange={(e) => handleNumberOfOptionsChange(e.target.value)}
                variant="outlined"

                slotProps={{
                  inputLabel: {
                    sx: { min: 2, max: 4 },
                  },
                }}
                required
              />
            </Grid>
            {newQuestion.options.slice(0, newQuestion.numberOfOptions).map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant="outlined"
                  required
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={newQuestion.answerOption === option} // Check if this option is the selected answer
                      onChange={handleAnswerChange}
                      value={option}
                      disabled={option.trim() === ''} // Disable the radio button if option text is empty
                    />
                  }
                  label="Select as Answer"
                />
              </Grid>
            ))}
          </>
        )}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit Question
          </Button>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageQuestions;