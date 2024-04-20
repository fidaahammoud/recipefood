import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [recieveNotification, setRecieveNotification] = useState(true);

  const saveAuthData = (newToken, newUserId) => {
    setToken(newToken);
    setUserId(newUserId);
  };

  const saveStatusOfRecieveNotification = (status) => {
    setRecieveNotification(status);
  };


  const getAuthData = () => {
    return { token, userId,recieveNotification };
  };

  const logout = () => {
    // Clear the authentication data
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ saveAuthData, getAuthData,logout,saveStatusOfRecieveNotification }}>
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
