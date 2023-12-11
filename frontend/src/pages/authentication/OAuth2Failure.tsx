import React from "react";
import {Container, CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {paths} from "../../router/paths";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";
import Alert from "@mui/material/Alert";

export default function OAuth2Failure(): React.ReactElement {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const exception = queryParams.get("exception");

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
                flexDirection: "column"
            }}
        >
            <CssBaseline/>
            <Typography
                component="h1"
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: {
                        xs: '2rem',
                        sm: '3rem',
                        xl: '5rem',
                    },
                }}
            >
                OAuth 2.0 Authentication Failure 😵
            </Typography>
            <Alert severity="error" sx={{
                mt: 1,
                mb: 4,
            }}>
                {exception}
            </Alert>
            <Button
                type="submit"
                variant="contained"
                onClick={() => {
                    navigate(paths.home)
                }}
            >
                Go back home
            </Button>

        </Container>
    )
}