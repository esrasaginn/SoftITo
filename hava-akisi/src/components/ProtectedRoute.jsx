import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Yetkilendirme (Rol) tabanlı sayfa koruma katmanı
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Oturum açılmamışsa ana sayfaya (giriş yapılabilen yer) yönlendir
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Oturum açık ancak kullanıcının rolü bu sayfa için yetersizse yönlendir
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
