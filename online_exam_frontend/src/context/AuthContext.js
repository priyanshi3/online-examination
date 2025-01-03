import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [authenticated, setAuthenticated] = useState(() => {
    const saved = sessionStorage.getItem('authenticated');
    return saved === 'true';
  });

  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // update localStorage 
  useEffect(() => {
    sessionStorage.setItem('authenticated', authenticated);
  }, [authenticated]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');  // Remove user if logged out
    }
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
