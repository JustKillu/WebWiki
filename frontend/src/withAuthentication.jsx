import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ThemeContext } from './ThemeProvider';

export function withAuthentication(WrappedComponent, requiredRole) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, rol } = useContext(ThemeContext);

    if (!isAuthenticated || (requiredRole && rol !== requiredRole)) {
      return <Navigate to="/unauthorized" />; 
    }

    return <WrappedComponent {...props} />;
  };
}
