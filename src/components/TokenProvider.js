import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const saveToken = (newToken) => {
    setToken(newToken);
  };

  const getToken = () => {
    return token;
  };

  return (
    <TokenContext.Provider value={{ saveToken, getToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};