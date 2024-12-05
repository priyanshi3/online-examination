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
} from '@mui/material';
import axios from 'axios'; // Make sure to install axios

const ManageQuestions = () => {
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    category: '',
    difficulty: '',
    numberOfOptions: 2,
    options: ['', '', '', ''],
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/category/fetchAll'); // Adjust the URL as needed
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch difficulties
    const fetchDifficulties = async () => {
      try {
        const response = await axios.get('http://localhost:8080/difficulty/fetchAll'); // Adjust the URL as needed
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
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions, numberOfOptions: updatedOptions.length });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log(newQuestion);
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
        {newQuestion.category === 3 ? ( // Adjust this condition based on your category ID or name
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={newQuestion.difficulty}
                  onChange={handleInputChange}
                  label="Difficulty"
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
                onChange={(e) => setNewQuestion({ ...newQuestion, numberOfOptions: Math.max(2, Math.min(4, e.target.value)) })}
                variant="outlined"
                inputProps={{ min: 2, max: 4 }}
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
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveOption(index)}
                  style={{ marginTop: '10px' }}
                >
                  Remove Option
                </Button>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageQuestions;