import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
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
import {clearData} from "./redux/store";

export default function App() {
    const token = useSelector(selectToken);
    const [isValidatingToken, setValidatingToken] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
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
                            clearData(dispatch)
                            navigate(`${paths.signIn}?redirect=${encodeURIComponent(location.pathname)}`);
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Token validation failed, signing out')
                        clearData(dispatch)
                        navigate(`${paths.signIn}?redirect=${encodeURIComponent(location.pathname)}`);
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Token validation failed, cannot authenticate')
                    clearData(dispatch)
                    navigate(`${paths.signIn}?redirect=${encodeURIComponent(location.pathname)}`);
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
