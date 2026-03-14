import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Júklenbekte...</div>;

    // 1. User kirgen be?
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Roli durıs pa? (Eger rol talap etilse)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Ruxsat joq bolsa, Bas betke qaytaradı
        return <Navigate to="/" replace />;
    }

    // Ruxsat bar, betti kórset
    return <Outlet />;
};

export default ProtectedRoute;