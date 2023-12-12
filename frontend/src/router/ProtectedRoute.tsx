import React, {ReactNode, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {paths} from "./paths";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthData, selectAuthState} from "../redux/rootslices/auth-data-slice";
import {validateAuthData} from "../util/validation";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const authData = useSelector(selectAuthState)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (navigate !== undefined && dispatch !== undefined) {
            if (!validateAuthData(authData)) {
                dispatch(clearAuthData())
                navigate(paths.signIn)
            }
        }
    }, [authData, dispatch, navigate])

    return <>{children}</>;
};

export default ProtectedRoute;
