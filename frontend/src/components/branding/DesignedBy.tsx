import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";

export function DesignedBy(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {'Designed by © '}
    <Link color="inherit" href="/">
        Algolovers
        </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
    </Typography>
);
}