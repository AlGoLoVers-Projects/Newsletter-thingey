import React from "react";
import Button from "@mui/material/Button";
import {GoogleLogo} from "./GoogleLogo";
import {paths} from "../../router/paths";

const GoogleAuthButton = (props: {disabled: boolean}) => {

    return (
        <Button
            variant="contained"
            fullWidth
            disabled={props.disabled}
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
