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
import {DesignedBy} from "../../components/branding/DesignedBy";
import {paths} from "../../router/paths";
import {Card} from "@mui/material";
import OrDivider from "../../components/elements/OrDivider";
import GoogleAuthButton from "../../components/elements/GoogleAuthButton";
import {SignupRequest, useSignUpMutation} from "./authentication.slice";
import {isEmpty, isValidEmail, isValidName, isValidPassword} from "../../util/validation";
import {useState} from "react";
import {Result} from "../../types/result";
import 'react-toastify/dist/ReactToastify.css';
import {showFailureToast, showSuccessToast} from "../../util/toasts";

export default function SignUp() {

    const [signUp, {isLoading: isSigningUp}] = useSignUpMutation();

    //TODO: Add loading spinner and block all buttons

    const [displayNameError, setDisplayNameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get('email')?.toString() ?? '';
        const password = data.get('password')?.toString() ?? '';
        const displayName = data.get('displayName')?.toString() ?? '';

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
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            valid = false;
        } else if (!isValidPassword(password)) {
            setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (!displayName) {
            setDisplayNameError('Please enter a display name');
            valid = false;
        } else if (displayName.trim().length < 3) {
            setDisplayNameError('Display name must have a minimum of 3 characters');
            valid = false;
        } else if (!isValidName(displayName)) {
            setDisplayNameError('Display name can only contain letters, numbers, spaces, and underscores');
            valid = false;
        } else {
            setDisplayNameError('');
        }

        if (valid) {
            const signupRequest: SignupRequest = {
                userName: displayName,
                password: password,
                email: email
            };

            signUp(signupRequest)
                .then((response) => {
                    if ('data' in response) {
                        let responseData: Result<null> = response.data
                        if (responseData.success) {
                            showSuccessToast(responseData.message ?? 'Registration successfully')
                            //TODO: Redirect
                        } else {
                            showFailureToast(responseData.message ?? 'Registration failed, please check credentials')
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Registration failed, please check credentials')
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Registration failed, please check credentials')
                })
        }
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
                        Sign up to Newsletter
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                                <TextField
                                    margin="normal"
                                    autoComplete="given-name"
                                    name="displayName"
                                    required
                                    fullWidth
                                    id="displayName"
                                    label="Display Name"
                                    autoFocus
                                    error={!isEmpty(displayNameError)}
                                    helperText={displayNameError}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
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
                                    autoComplete="new-password"
                                    error={!isEmpty(passwordError)}
                                    helperText={passwordError}
                                />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 1}}
                            disabled={isSigningUp}
                        >
                            Sign Up
                        </Button>
                        <OrDivider/>
                        <GoogleAuthButton disabled={isSigningUp}/>
                    </Box>
                </Card>
                <Grid container justifyContent="center">
                    <Grid item sx={{mt: 1, mb: 1}}>
                        Already have an account?
                        <Link href={paths.signIn} variant="body2" sx={{pl: 0.5}}>
                            Sign in
                        </Link>
                    </Grid>
                </Grid>
                <DesignedBy sx={{mt: 5}}/>
            </Box>
        </Container>
    );
}