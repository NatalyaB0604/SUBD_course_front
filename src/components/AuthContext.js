import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem('userInfo');
    if (savedInfo) {
      setUserInfo(JSON.parse(savedInfo));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (info) => {
    setIsAuthenticated(true);
    setUserInfo(info);
    localStorage.setItem('userInfo', JSON.stringify(info));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
