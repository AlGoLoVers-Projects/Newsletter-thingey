import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import {paths} from "./paths";
import {useSelector} from "react-redux";
import {selectToken} from "../redux/rootslices/auth-token-slice";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = useSelector(selectToken)

    if (!token) {
        return <Navigate to={paths.signIn} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
