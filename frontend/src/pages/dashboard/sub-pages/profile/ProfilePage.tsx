import Container from "@mui/material/Container";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import {useSelector} from "react-redux";
import {memoizedSelectUserData} from "../../../../redux/rootslices/data/auth-data.slice";
import {Card} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {isEmpty, isValidName} from "../../../../util/validation";
import Button from "@mui/material/Button";

export default function ProfilePage(): React.ReactElement {
    const user = useSelector(memoizedSelectUserData);

    const [displayName, setDisplayName] = useState<string>(user.displayName);
    const [displayNameError, setDisplayNameError] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!displayName) {
            setDisplayNameError('Please enter a display name');
            return
        } else if (displayName.trim().length < 3) {
            setDisplayNameError('Display name must have a minimum of 3 characters');
            return
        } else if (!isValidName(displayName)) {
            setDisplayNameError('Display name can only contain letters, numbers, spaces, and underscores');
            return
        } else {
            setDisplayNameError('');
        }

        //TODO: Update name

    }

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
                Manage User Profile
            </Typography>
            <Card
                sx={{
                    mt: 3,
                    p: 3,
                    maxWidth: "100%",
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography component="h1" variant="h6" sx={{
                    fontWeight: 'bold',
                }}>
                    Update Display Name
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mt: 3,
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        value={displayName}
                        id="group-name"
                        label="User Name"
                        name="user-name"
                        type="text"
                        autoComplete="organization"
                        autoFocus
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setDisplayName(e.target.value)
                        }}
                        error={!isEmpty(displayNameError)}
                        helperText={displayNameError}
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
                                setDisplayName(user.displayName)

                            }}
                            sx={{mt: 3, mb: 1}}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={false}
                            sx={{mt: 3, mb: 1}}
                        >
                            Update Display Name
                        </Button>
                    </Box>
                </Box>
            </Card>

        </Container>
    )
}