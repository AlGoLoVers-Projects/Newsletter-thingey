import React, {ReactNode, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {paths} from "./paths";
import {useDispatch, useSelector} from "react-redux";
import {selectAuthState} from "../redux/rootslices/data/auth-data.slice";
import {validateAuthData} from "../util/validation";
import {clearData} from "../redux/store";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const authData = useSelector(selectAuthState)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        if (navigate !== undefined && dispatch !== undefined) {
            if (!validateAuthData(authData)) {
                clearData(dispatch)
                navigate(`${paths.signIn}?redirect=${encodeURIComponent(location.pathname)}`);
            }
        }
    }, [authData, dispatch, navigate])

    return <>{children}</>;
};

export default ProtectedRoute;
