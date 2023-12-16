import {createTheme, Theme} from "@mui/material";

export const buildTheme = (): Theme => {
    return createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        padding: '8px 18px',
                    },
                    containedPrimary: {
                        color: '#fff',
                    },
                    outlined: {
                        borderWidth: 2,
                        "&:hover": {
                            borderWidth: 2, // Adjust the thickness on hover
                        },
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        borderRadius: 20,
                        padding: '10px',
                    },
                },
            },
        },
        palette: {
            common: {
                black: "#000",
                white: "#fff",
            },
            mode: "dark",
            contrastThreshold: 3,
            tonalOffset: 0.2,
            primary: {
                main: "#ff6e23",
            },
            secondary: {
                main: "#fff",
            },
            background: {
                paper: "#161718",
                default: "#161718",
            },
            error: {
                main: "#ff5656",
            },
            text: {
                primary: "#fff2ea",
                secondary: "#757575",
            },
            action: {
                hover: "rgba(255,87,0,0.8)",
                selected: "#ff6e23",
            },
        },
    });
};
