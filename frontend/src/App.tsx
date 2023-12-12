import React, {useEffect, useState} from 'react';
import {useRoutes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
    clearAuthData,
    selectToken,
    setUserData,
    UserData,
} from './redux/rootslices/auth-data-slice';
import {
    TokenValidationRequest,
    useValidateTokenMutation,
} from './pages/authentication/authentication.slice';
import {Result} from './types/result';
import {showFailureToast} from './util/toasts';
import {buildRoutes} from "./router/route-builder";

export default function App() {
    const token = useSelector(selectToken);
    const [isValidatingToken, setValidatingToken] = useState(true);
    const dispatch = useDispatch();
    const [validateToken] = useValidateTokenMutation();
    const Routes = () => useRoutes(buildRoutes())

    useEffect(() => {
        if (token) {
            let tokenValidationRequest: TokenValidationRequest = {
                token
            }
            setValidatingToken(true)
            validateToken(tokenValidationRequest)
                .then((response) => {
                    if ('data' in response) {
                        let responseData: Result<UserData> = response.data
                        if (responseData.success) {
                            dispatch(setUserData(responseData.data));
                        } else {
                            showFailureToast(responseData.message ?? 'Token validation failed, signing out')
                            dispatch(clearAuthData())
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Token validation failed, signing out')
                        dispatch(clearAuthData())
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Token validation failed, signing out')
                    dispatch(clearAuthData())
                }).finally(() => {
                setValidatingToken(false)
            })
        } else {
            setValidatingToken(false)
        }
    }, [token, validateToken, dispatch]);

    if (isValidatingToken) {
        return <div>Loading...</div>;
    }

    return <Routes/>
}
