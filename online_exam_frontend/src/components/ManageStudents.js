import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';

const ManageStudents = () => {
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
    cpi: ''
  });

  const [students, setStudents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch students from database
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/student/fetchAll');
      setStudents(response.data);
    } catch (error) {
      setSnackbarMessage('Error fetching students: ' + error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddStudent = async () => {
    if (Object.values(newStudent).some((field) => field === '')) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/student/addDetails', newStudent);
      setStudents([...students, response.data]);
      fetchStudents();
      resetForm();
    } catch (error) {
      setSnackbarMessage('Error adding student: ' + error.message);
      setSnackbarOpen(true);
    }
  };

  const handleUpdateStudent = async () => {
    // update details
    if (Object.values(newStudent).some((field) => field === '')) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const studentIdToUpdate = editingIndex;
      const response = await axios.put(`http://localhost:8080/student/update/${studentIdToUpdate}`, newStudent);
      setNewStudent(response.data);
      setIsEditing(false);
      setEditingIndex(null);
      // Fetch updated student list to reflect changes
      fetchStudents();
      resetForm();
    } catch (error) {
      setSnackbarMessage('Error updating student: ' + error.message);
      setSnackbarOpen(true);
    }
  };

  const handleEditStudent = (index) => {
    // change buttons
    const studentToEdit = students[index];
    setEditingIndex(studentToEdit.studentId);
    setNewStudent(studentToEdit);
    setIsEditing(true);

  };

  const resetForm = () => {
    setNewStudent({ firstName: '', lastName: '', emailId: '', phoneNumber: '', cpi: '' });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3, marginLeft: 5 }}>
      <Typography variant="h4" gutterBottom>
        Manage Students
      </Typography>

      {/* Form to add or update student */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">{isEditing ? 'Update Student' : 'Add New Student'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={newStudent.firstName}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={newStudent.lastName}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="emailId"
            type="email"
            value={newStudent.emailId}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={newStudent.phoneNumber}
            onChange={handleInputChange}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CPI"
            name="cpi"
            type="number"
            value={newStudent.cpi}
            onChange={handleInputChange}
            variant="outlined"
            required
            inputProps={{
              min: 0, // Minimum value
              max: 10, // Maximum value
              step: 0.1 // decimal values
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? handleUpdateStudent : handleAddStudent}
          >
            {isEditing ? 'Update Student' : 'Add Student'}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Table to view all students */}
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>All Students</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>First Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Last Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} sx={{ width: '250px' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>CPI</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell sx={{ width: '250px' }}>{student.emailId}</TableCell>
                    <TableCell>{student.phoneNumber}</TableCell>
                    <TableCell>{student.cpi}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => handleEditStudent(index)}>
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageStudents;
