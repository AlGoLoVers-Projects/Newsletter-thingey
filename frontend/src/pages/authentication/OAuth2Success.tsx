import React, {useEffect} from "react";
import {CircularProgress, Container, CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {authorizedPaths, paths} from "../../router/paths";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setToken} from "../../redux/rootslices/auth-token-slice";

export default function OAuth2Success(): React.ReactElement {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    //TODO: get all user information here. User name and role

    useEffect(() => {
        if (!token) {
            navigate(paths.oauth2Failure + "?exception=Could not authorize user, authentication token not found")
        } else {
            dispatch(setToken(token));
            setTimeout(() => {
                // navigate(authorizedPaths.dashboard)
            }, 1000)
        }
    }, [token])

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
                OAuth 2.0 Authentication Successful
            </Typography>
            <Typography
                component="h1"
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: {
                        xs: '1rem',
                        sm: '1.5rem',
                        xl: '3rem',
                    },
                }}
            >
                Fetching user details, please wait
            </Typography>
            <CircularProgress sx={{
                mt: 2
            }}/>
            <Button
                type="submit"
                variant="contained"
                sx={{mt: 4}}
                onClick={() => {
                    navigate(paths.home)
                }}
            >
                Go back home
            </Button>

        </Container>
    )
}