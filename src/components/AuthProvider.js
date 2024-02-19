import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const saveAuthData = (newToken, newUserId) => {
    setToken(newToken);
    setUserId(newUserId);
  };

  const getAuthData = () => {
    return { token, userId };
  };

  return (
    <AuthContext.Provider value={{ saveAuthData, getAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};