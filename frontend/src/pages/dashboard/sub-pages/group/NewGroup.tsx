import Typography from "@mui/material/Typography";
import React from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {isEmpty} from "../../../../util/validation";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {authorizedPaths} from "../../../../router/paths";

export default function NewGroup(): React.ReactElement {
    const navigate = useNavigate()

    return (
        <Container
            component="main"
            disableGutters
            sx={{
                padding: 2,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                position: 'relative',
                minWidth: "100%",
                flex: 1
            }}
        >
            <Typography
                component="h1"
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    alignSelf: "flex-start",
                    fontSize: {
                        xs: '1rem',
                        sm: '2rem',
                        xl: '3rem',
                    },
                }}
            >
                New Group
            </Typography>
            <Card
                sx={{
                    mt: 3,
                    p: 5,
                    maxWidth: "80%",
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography component="h1" variant="h5" sx={{
                    fontWeight: 'bold',
                }}>
                    Create new Newsletter group
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mt: 3,
                    }}
                    component="form"
                    onSubmit={() => {
                    }}
                    noValidate
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="group-name"
                        label="Group Name"
                        name="group-name"
                        type="text"
                        autoComplete="organization"
                        autoFocus
                        error={!isEmpty("")}
                        helperText={""}
                    />
                    <TextField
                        rows={4}
                        multiline
                        margin="normal"
                        required
                        fullWidth
                        name="description"
                        label="Description"
                        type="text"
                        id="description"
                        autoComplete="text"
                        error={!isEmpty("")}
                        helperText={""}
                    />
                    <Box sx={{
                        flex: 1
                    }}>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignSelf: "end",
                        flexDirection: "row",
                        gap: 2,
                    }}>
                        <Button
                            type="button"
                            variant="outlined"
                            disabled={false}
                            onClick={() => {
                                navigate(authorizedPaths.groups)
                            }}
                            sx={{mt: 3, mb: 1}}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={false}
                            sx={{mt: 3, mb: 1}}
                        >
                            Create New Group
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Container>
    )
}
