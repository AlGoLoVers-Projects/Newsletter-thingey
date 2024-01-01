import React, {ReactNode, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {selectAuthState} from "../redux/rootslices/data/auth-data.slice";
import {validateAuthData} from "../util/validation";
import {clearData} from "../redux/store";
import {useBuildRedirectPath} from "../util/utilities";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const authData = useSelector(selectAuthState)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const redirectPath = useBuildRedirectPath()

    useEffect(() => {
        if (navigate !== undefined && dispatch !== undefined) {
            if (!validateAuthData(authData)) {
                clearData(dispatch)
                navigate(redirectPath)
            }
        }
    }, [authData, dispatch, navigate])

    return <>{children}</>;
};

export default ProtectedRoute;
