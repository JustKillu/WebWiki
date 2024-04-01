import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    if (token) {
      setIsAuthenticated(true);
      setRol(rol);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [darkMode]);

  if (loading) {
    return <div>Cargando...</div>; 
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, isAuthenticated, setIsAuthenticated, rol, setRol }}>
      {children}
    </ThemeContext.Provider>
  );
};
