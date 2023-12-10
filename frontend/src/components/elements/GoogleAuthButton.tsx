import React from "react";
import Button from "@mui/material/Button";
import {GoogleLogo} from "./GoogleLogo";
import {paths} from "../../router/paths";

const GoogleAuthButton = () => {

    return (
        <Button
            variant="contained"
            fullWidth
            sx={{
                p: 0
            }}
            startIcon={
                <GoogleLogo/>
            }
            onClick={() => {
                window.location.href = paths.oauth2Authentication
            }}
        >
            Sign in with Google
        </Button>
    );
};

export default GoogleAuthButton;
