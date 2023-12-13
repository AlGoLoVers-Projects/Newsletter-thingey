import React, {useState} from "react";
import {
    ForgotPasswordRequest,
    useForgotPasswordMutation,
} from "../authentication.slice";
import {useNavigate} from "react-router-dom";
import {isEmpty, isValidEmail} from "../../../util/validation";
import {showFailureToast, showSuccessToast} from "../../../util/toasts";
import {Result} from "../../../types/result";
import {paths} from "../../../router/paths";
import {Card, Container, CssBaseline} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {PasswordTwoTone} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {DesignedBy} from "../../../components/branding/DesignedBy";
import Alert from "@mui/material/Alert";

export default function ForgotPassword(): React.ReactElement {

    const [forgotPassword, {isLoading: isVerifying}] = useForgotPasswordMutation();

    const navigate = useNavigate();
    const [emailError, setEmailError] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')?.toString() ?? '';

        let valid: boolean = true

        if (!email) {
            setEmailError('Please enter an email address');
            valid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (valid) {
            const forgotPasswordRequest: ForgotPasswordRequest = {
                email: email,
            };

            forgotPassword(forgotPasswordRequest)
                .then((response) => {
                    if ('data' in response) {
                        let responseData: Result<null> = response.data
                        if (responseData.success) {
                            showSuccessToast(responseData.message ?? 'Password reset email sent successfully, please check your email for further instructions')
                            navigate(paths.signIn)
                        } else {
                            showFailureToast(responseData.message ?? 'Password reset process failed, please try again later')
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Password reset process failed, please try again later')
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Password reset process failed, please try again later')
                })
        }

    }

    return (
        <Container
            component="main"
            sx={{
                padding: 0,
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                minWidth: "100vw",
                flexDirection: "column"
            }}
        >
            <CssBaseline/>
            <Card
                sx={{
                    paddingLeft: {xs: 2, sm: 6},
                    paddingRight: {xs: 2, sm: 6},
                    paddingTop: 6,
                    paddingBottom: 6,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <PasswordTwoTone/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    Forgot your password
                </Typography>
                <Alert severity="info" sx={{
                    mt: 2,
                    textAlign: "center"
                }}>
                    Enter your account email address
                    <br/>
                    We will send you a code to help reset your account password.
                </Alert>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3, width: "100%"}}>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 1}}
                        disabled={isVerifying}
                    >
                        Continue
                    </Button>
                </Box>
            </Card>
            <DesignedBy sx={{mt: 5}}/>
        </Container>
    )
}