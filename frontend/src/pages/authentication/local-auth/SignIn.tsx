import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {authorizedPaths, paths} from "../../../router/paths";
import {DesignedBy} from "../../../components/branding/DesignedBy";
import {Card} from "@mui/material";
import OrDivider from "../../../components/elements/OrDivider";
import GoogleAuthButton from "../../../components/elements/GoogleAuthButton";
import {SignInRequest, useSignInMutation} from "../../../redux/rootslices/api/authentication.slice";
import {useState} from "react";
import {isEmpty, isValidEmail, validateAuthData} from "../../../util/validation";
import {Result} from "../../../types/result";
import {showFailureToast, showSuccessToast} from "../../../util/toasts";
import {useDispatch, useSelector} from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import {Navigate, useNavigate} from "react-router-dom";
import {AuthData, selectToken, setAuthData} from "../../../redux/rootslices/data/auth-data.slice";


export default function SignIn(): React.ReactElement {

    const token = useSelector(selectToken)
    const dispatch = useDispatch();
    let navigation = useNavigate();

    const [signIn, {isLoading: isSigningIn}] = useSignInMutation();

    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get('email')?.toString() ?? '';
        const password = data.get('password')?.toString() ?? '';

        let valid: boolean = true;

        if (!email) {
            setEmailError('Please enter an email address');
            valid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Please enter a password');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (valid) {
            const signInRequest: SignInRequest = {
                password: password,
                email: email
            };

            signIn(signInRequest)
                .then((response) => {
                    if ('data' in response) {
                        let responseData: Result<AuthData> = response.data
                        if (responseData.success) {
                            if (validateAuthData(responseData.data)) {
                                showSuccessToast(responseData.message ?? 'Signed in successfully')
                                dispatch(setAuthData(responseData.data));
                                navigation(authorizedPaths.dashboardRoot)
                            } else {
                                showFailureToast(responseData.message ?? 'Could not decode user information, please try signing in again')
                            }
                        } else {
                            showFailureToast(responseData.message ?? 'Sign in failed, please check credentials')
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Sign in failed, please check credentials')
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Sign in failed, please check credentials')
                })
        }

    };

    if (token) {
        return <Navigate to={authorizedPaths.dashboardRoot}/>;
    }

    return (
        <Container
            component="main"
            maxWidth="sm"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh"
            }}
        >
            <CssBaseline/>
            <Box>
                <Card
                    sx={{
                        paddingLeft: {xs: 1, sm: 6},
                        paddingRight: {xs: 1, sm: 6},
                        paddingTop: 6,
                        paddingBottom: 6,
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Sign in to Newsletter
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 3}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={!isEmpty(emailError)}
                            helperText={emailError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!isEmpty(passwordError)}
                            helperText={passwordError}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSigningIn}
                            sx={{mt: 3, mb: 1}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href={paths.forgotPassword} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                        <OrDivider/>
                        <GoogleAuthButton disabled={isSigningIn}/>
                    </Box>
                </Card>
                <Grid container justifyContent="center">
                    <Grid item sx={{mt: 1, mb: 1}}>
                        Dont' have an account?
                        <Link href={paths.signUp} variant="body2" sx={{pl: 0.5}}>
                            Sign up
                        </Link>
                    </Grid>
                </Grid>
                <DesignedBy sx={{mt: 5}}/>
            </Box>
        </Container>
    );
}