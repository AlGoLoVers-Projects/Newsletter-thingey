import React, {useState} from "react";
import {Card, Container, CssBaseline} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {isEmpty, isValidEmail} from "../../util/validation";
import {DesignedBy} from "../../components/branding/DesignedBy";
import CodeInput from "../../components/elements/CodeInput";
import {VerifiedOutlined} from "@mui/icons-material";
import {showFailureToast, showSuccessToast} from "../../util/toasts";
import {useVerifyMutation, VerificationRequest} from "./authentication.slice";
import {Result} from "../../types/result";
import {paths} from "../../router/paths";

export default function Verification(): React.ReactElement {

    const [verify, {isLoading: isVerifying}] = useVerifyMutation();

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email") ?? '';

    const [code, setCode] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [codeError, setCodeError] = useState<boolean>(false);

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

        if (code.length === 8 && !isNaN(Number(code))) {
            setCodeError(false)
        } else {
            valid = false;
            setCodeError(true)
            showFailureToast('Please enter a proper code')
        }

        if (valid) {
            const verificationRequest: VerificationRequest = {
                email: email,
                verificationCode: Number(code)
            };

            verify(verificationRequest)
                .then((response) => {
                    if ('data' in response) {
                        let responseData: Result<null> = response.data
                        if (responseData.success) {
                            showSuccessToast(responseData.message ?? 'Verification successfully')
                            navigate(paths.signIn)
                        } else {
                            showFailureToast(responseData.message ?? 'Verification failed, please check email and code')
                        }
                    } else {
                        let responseData: Result<null> = (response.error as any).data
                        showFailureToast(responseData.message ?? 'Verification failed, please check email and code')
                    }
                })
                .catch((error) => {
                    let responseData: Result<null> = error.error;
                    showFailureToast(responseData.message ?? 'Verification failed, please check email and code')
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
                        <VerifiedOutlined/>
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Verify your email address
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            defaultValue={email ?? null}
                            autoComplete="email"
                            error={!isEmpty(emailError)}
                            helperText={emailError}
                        />
                        <CodeInput length={8} error={codeError} onChange={(code: any) => {
                            setCode(code)
                        }}/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 1}}
                            disabled={isVerifying}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Card>
                <DesignedBy sx={{mt: 5}}/>
            </Box>
        </Container>
    )
}