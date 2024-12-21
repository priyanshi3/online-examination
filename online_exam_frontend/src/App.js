import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppBar from './components/MenuAppBar';
import LoginPage from './components/LoginPage';
import HomePageAdmin from './components/HomePageAdmin';
import ManageStudents from './components/ManageStudents';
import ManageQuestions from './components/ManageQuestions';
import ManageExam from './components/ManageExam';
import HomePageStudent from './components/HomePageStudent';
import Exam from './components/Exam';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/home" element={<HomePageAdmin />}>   // home page for employee after login
            <Route path="students" element={<ManageStudents />} />   // page to manage students by employee
            <Route path="questions" element={<ManageQuestions />} />  // page to manage questions by employee
            <Route path="exams" element={<ManageExam />} />   // page to manage exam by employee
          </Route>

          <Route path="/student" element={<HomePageStudent />}>
            <Route path="exam" element={<Exam />} />  // give exam by student
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
