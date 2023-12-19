import React, {useEffect, useState} from "react";
import {
    ResetPasswordQueryRequest,
    ResetPasswordRequest, useResetPasswordMutation,
} from "../../../redux/rootslices/api/authentication.slice";
import {useLocation, useNavigate} from "react-router-dom";
import {isEmpty, isValidPassword} from "../../../util/validation";
import {showFailureToast, showSuccessToast} from "../../../util/toasts";
import {Result} from "../../../types/result";
import {paths} from "../../../router/paths";
import {Card, Container, CssBaseline} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {VerifiedOutlined} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CodeInput from "../../../components/elements/CodeInput";
import Button from "@mui/material/Button";
import {DesignedBy} from "../../../components/branding/DesignedBy";
import Alert from "@mui/material/Alert";

export default function ResetPassword(): React.ReactElement {

    const [resetPassword, {isLoading: isResetting}] = useResetPasswordMutation();

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const data = queryParams.get("data") ?? '';

    const [requestId, setRequestId] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [codeError, setCodeError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string>('');

    useEffect(() => {
        if (data) {
            const json = atob(data);
            const resetPasswordQueryRequest: ResetPasswordQueryRequest = JSON.parse(json);
            if (resetPasswordQueryRequest.id) {
                setRequestId(resetPasswordQueryRequest.id)
            } else {
                showFailureToast("Could not get user id")
                navigate(paths.forgotPassword)
            }
        } else {
            showFailureToast("Could not get user id")
            navigate(paths.forgotPassword)
        }
    }, [data, navigate])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password')?.toString() ?? '';

        let valid: boolean = true

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

        if (code.length === 8 && !isNaN(Number(code))) {
            setCodeError(false)
        } else {
            valid = false;
            setCodeError(true)
            showFailureToast('Please enter a proper code')
        }

        if (valid) {
            const resetPasswordRequest: ResetPasswordRequest = {
                id: requestId,
                password: password,
                verificationCode: Number(code)
            };

            resetPassword(resetPasswordRequest)
                .then((response) => {
                    if ('data' in response) {
                        let responseData: Result<null> = response.data
                        if (responseData.success) {
                            showSuccessToast(responseData.message ?? 'Password reset successfully')
                            navigate(paths.signIn)
                        } else {
                            showFailureToast(responseData.message ?? 'Password reset failed, please check email and code')
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Password reset failed, please check email and code')
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Password reset failed, please check email and code')
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
                    <VerifiedOutlined/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    Reset your password
                </Typography>
                <Alert severity="info" sx={{
                    mt: 2,
                    textAlign: "center"
                }}>
                    Enter new password and reset code to reset password
                </Alert>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3, width: "100%"}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        error={!isEmpty(passwordError)}
                        helperText={passwordError}
                        autoFocus
                    />
                    <CodeInput length={8} error={codeError} title={"Enter reset Code"} onChange={(code: any) => {
                        setCode(code)
                    }}/>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 1}}
                        disabled={isResetting}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Card>
            <DesignedBy sx={{mt: 5}}/>
        </Container>
    )
}