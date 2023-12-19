import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
    clearAuthData,
    selectToken,
    setUserData,
    UserData,
} from './redux/rootslices/data/auth-data.slice';
import {
    TokenValidationRequest,
    useValidateTokenMutation,
} from './redux/rootslices/api/authentication.slice';
import {Result} from './types/result';
import {showFailureToast} from './util/toasts';
import {CircularProgress, Container, CssBaseline} from "@mui/material";
import ApplicationRoutes from "./router/ApplicationRoutes";
import {paths} from "./router/paths";

export default function App() {
    const token = useSelector(selectToken);
    const [isValidatingToken, setValidatingToken] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [validateToken] = useValidateTokenMutation();

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
                            navigate(paths.signIn)
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Token validation failed, signing out')
                        dispatch(clearAuthData())
                        navigate(paths.signIn)
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Token validation failed, cannot authenticate')
                    dispatch(clearAuthData())
                    navigate(paths.signIn)
                }).finally(() => {
                setValidatingToken(false)
            })
        } else {
            setValidatingToken(false)
        }
    }, [token, validateToken, dispatch, navigate]);

    if (isValidatingToken) {
        return (
            <Container
                component="main"
                disableGutters
                sx={{
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    minWidth: "100vw",
                }}
            >
                <CssBaseline/>
                <CircularProgress/>
            </Container>
        );
    }

    return <ApplicationRoutes/>
}
