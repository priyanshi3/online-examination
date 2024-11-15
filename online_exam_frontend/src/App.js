import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import AppBar from './components/MenuAppBar';
import LoginPage from './components/LoginPage';
import HomePageStudent from './components/HomePageStudent';
import HomePageAdmin from './components/HomePageAdmin';
import ManageStudents from './components/ManageStudents';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/exam" element={<HomePageStudent/>} />   // home page for student after login
          <Route path="/home" element={<HomePageAdmin/>}>   // home page for employee after login
            <Route path="students" element={<ManageStudents/>} />   // page to manage students by employee
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
