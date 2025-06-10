import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('fwtoken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default Protected;
