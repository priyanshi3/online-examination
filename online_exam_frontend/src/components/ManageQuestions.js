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

const ManageQuestions = () => {
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    category: 0,
    difficulty: 0,
    numberOfOptions: 2,
    options: ['', '', '', ''],
    answerOption: '',
    programmingDetails: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
    const selectedOption = event.target.value;
    setNewQuestion({ ...newQuestion, answerOption: selectedOption });
  };

  const handleSubmit = async () => {
    const { questionText, category, difficulty, numberOfOptions, options, answerOption, programmingDetails } = newQuestion;

    var questionData;
    if (difficulty == 0) {
      questionData = {
        question: questionText,
        categoryId: parseInt(category, 10),
      };
    }
    else {
      questionData = {
        question: questionText,
        categoryId: parseInt(category, 10),
        difficultyId: difficulty,
      };
    }

    var response;
    try {
      response = await axios.post('http://localhost:8080/question/addQuestion', questionData);
      console.log('Question submitted successfully:', response.data);
      // Reset the form after successful submission
      // setNewQuestion({
      //   questionText: '',
      //   category: '',
      //   difficulty: '',
      //   numberOfOptions: 2,
      //   options: ['', '', '', ''],
      //   answerOption: '',
      //   programmingDetails: '',
      // });
      setSnackbarMessage('Question submitted successfully!');
    } catch (error) {
      console.error('Error submitting question:', error);
      setSnackbarMessage('Error submitting question. Please try again.');
    } finally {
      setSnackbarOpen(true);
    }

    if (difficulty == 0) {
      options.forEach((option, index) => {
        const dataToSend = {
          questionId: response.data.questionId,
          option: option.option,
        };
        try {
          response = axios.post('http://localhost:8080/options/addOption', dataToSend);
          console.log('Option submitted successfully:', response.data);
        } catch (error) {
          console.error('Error submitting question:', error);
          setSnackbarMessage('Error submitting question. Please try again.');
        }
      })
    };

    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };

    return (
      <Box sx={{ padding: 3, marginLeft: 6 }}>
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
                {categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </MenuItem>
                ))}
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
                    {difficulties.map((difficulty) => (
                      <MenuItem key={difficulty.difficultyLevelId} value={difficulty.difficultyLevelId}>
                        {difficulty.difficultyLevel}
                      </MenuItem>
                    ))}
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
                        checked={newQuestion.answerOption === option}
                        onChange={handleAnswerChange}
                        value={option}
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
              <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Grid>
        </Grid>
      </Box>
    );
  };
}
export default ManageQuestions;