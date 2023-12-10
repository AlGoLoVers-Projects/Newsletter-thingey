import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import {paths} from "./paths";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = '';

    if (!token) {
        alert("Not authorised")
        return <Navigate to={paths.login} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
