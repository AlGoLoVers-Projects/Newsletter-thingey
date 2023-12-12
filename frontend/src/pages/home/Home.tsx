import React from "react";
import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import {Newspaper} from "@mui/icons-material";
import bg from "../../assets/pictures/newsletter.jpg";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {authorizedPaths, paths} from "../../router/paths";
import {useSelector} from "react-redux";
import {selectToken} from "../../redux/rootslices/auth-token-slice";

export default function Home(): React.ReactElement {
    let navigate = useNavigate();
    const token = useSelector(selectToken)

    if (token) {
        navigate(authorizedPaths.dashboard)
    }

    return (
        <Container
            component="main"
            disableGutters
            sx={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                padding: 0,
                margin: 0,
                display: "flex",
                minHeight: "100vh",
                minWidth: "100vw",
                flexDirection: "column"
            }}
        >
            <CssBaseline/>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backdropFilter: "blur(1.8px)",
                    backgroundColor: "rgba(0,0,0,0.68)", // Adjust the alpha value for darkness
                }}
            />
            <Box sx={{
                pt: 1,
                pb: 1,
                pl: 2,
                pr: 2,
                zIndex: 100,
                display: "flex",
                maxHeight: "min-content",
                alignItems: "center",
                justifyContent: "space-between"
            }}>

                <Box sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center"
                }}>
                    <Newspaper fontSize={'large'}/>
                    Newsletter
                </Box>

                <Box sx={{
                    display: {xs: "none", sm: "flex"},
                    gap: 1,
                }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigate(paths.signUp)
                        }}
                        sx={{
                            pl: 6,
                            pr: 6
                        }}>
                        Sign Up
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            navigate(paths.signIn)
                        }}
                        sx={{
                            pl: 6,
                            pr: 6
                        }}>
                        Sign In
                    </Button>
                </Box>

            </Box>
            <Box sx={{
                zIndex: 100,
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around"
            }}>

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <Typography
                        component="h1"
                        variant="h1"
                        sx={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontFamily: 'cursive',
                            fontSize: {
                                xs: '3rem',  // Adjust the font size for extra-small screens
                                sm: '4.5rem',  // Adjust the font size for small screens
                                xl: '5rem',  // Adjust the font size for extra-large screens
                            },
                        }}
                    >
                        Newsletter
                    </Typography>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontFamily: 'cursive',
                            fontSize: {
                                xs: '1rem',  // Adjust the font size for extra-small screens
                                sm: '1.5rem',  // Adjust the font size for small screens
                                xl: '3rem',  // Adjust the font size for extra-large screens
                            },
                        }}
                    >
                        "Some cheesy caption"
                    </Typography>

                    <Box sx={{
                        display: "flex",
                        gap: 1,
                        pt: 4,
                        flexDirection: {xs: "column", sm: "row"}
                    }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate(paths.signIn)
                            }}
                            sx={{
                                pl: 12,
                                pr: 12,
                                pt: 2,
                                pb: 2,
                                borderRadius: 3,
                                display: {xs: "block", sm: "none"}
                            }}>
                            Sign in
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate(paths.signUp)
                            }}
                            sx={{
                                pl: 12,
                                pr: 12,
                                pt: 2,
                                pb: 2,
                                borderRadius: 3,
                            }}>
                            Get started
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                navigate(paths.contactUs)
                            }}
                            sx={{
                                pl: 10,
                                pr: 10,
                                pt: 2,
                                pb: 2,
                                borderRadius: 3,
                            }}>
                            Reach out to us
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}