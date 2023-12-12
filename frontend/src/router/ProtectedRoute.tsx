import React, {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {paths} from "./paths";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthData, selectAuthState} from "../redux/rootslices/auth-data-slice";
import {showFailureToast} from "../util/toasts";
import {validateAuthData} from "../util/validation";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const authData = useSelector(selectAuthState)
    const dispatch = useDispatch()

    if (!validateAuthData(authData)) {
        showFailureToast('Token not found, try signing in')
        dispatch(clearAuthData())
        return <Navigate to={paths.signIn}/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
