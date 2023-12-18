import Typography from "@mui/material/Typography";
import React from "react";
import {Container} from "@mui/material";

export default function NewGroup(): React.ReactElement {
    return (
        <Container
            component="main"
            disableGutters
            maxWidth="xl"
            sx={{
                padding: 2,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                position: 'relative',
            }}
        >
            <Typography
                component="h1"
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    fontSize: {
                        xs: '1rem',
                        sm: '2rem',
                        xl: '3rem',
                    },
                }}
            >
                New Group
            </Typography>
        </Container>
    )
}
