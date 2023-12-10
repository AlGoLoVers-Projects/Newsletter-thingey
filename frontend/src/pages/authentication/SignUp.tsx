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
import {Alert, Card, Snackbar} from "@mui/material";
import OrDivider from "../../components/elements/OrDivider";
import GoogleAuthButton from "../../components/elements/GoogleAuthButton";

export default function SignUp() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

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
                        padding: 6,
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="displayName"
                                    required
                                    fullWidth
                                    id="displayName"
                                    label="Display Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 1}}
                        >
                            Sign Up
                        </Button>
                        <OrDivider/>
                        <GoogleAuthButton/>
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
                <Snackbar open={true} autoHideDuration={1000}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        This is a success message!
                    </Alert>
                </Snackbar>
                <DesignedBy sx={{mt: 5}}/>
            </Box>

        </Container>
    );
}