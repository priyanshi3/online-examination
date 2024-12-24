import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [authenticated, setAuthenticated] = useState(() => {
    const saved = localStorage.getItem('authenticated');
    return saved === 'true';
  });

  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    return localStorage.getItem('user') || '';
  });

  // update localStorage 
  useEffect(() => {
    localStorage.setItem('authenticated', authenticated);
  }, [authenticated]);

  useEffect(() => {
    localStorage.setItem('user', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
