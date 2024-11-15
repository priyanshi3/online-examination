import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [authenticated, setAuthenticated] = useState(() => {
    const saved = localStorage.getItem('authenticated');
    return saved === 'true'; // Convert string to boolean
  });

  // Initialize emailId from localStorage
  const [emailId, setEmailId] = useState(() => {
    return localStorage.getItem('emailId') || '';
  });

  // update localStorage 
  useEffect(() => {
    localStorage.setItem('authenticated', authenticated);
  }, [authenticated]);

  useEffect(() => {
    localStorage.setItem('emailId', emailId);
  }, [emailId]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, emailId, setEmailId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
