import React from 'react';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GroupList from "./GroupList";

const Groups = (): React.ReactElement => {
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
                position: 'relative', // Important for positioning the Fab
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
                Groups
            </Typography>
            <Box>
                <GroupList/>
            </Box>
            <Fab
                color="primary"
                variant="extended"
                style={{
                    position: 'fixed',
                    bottom: 25,
                    right: 25,
                }}
            >
                <AddIcon />
                New group
            </Fab>
        </Container>
    );
};

export default Groups;
