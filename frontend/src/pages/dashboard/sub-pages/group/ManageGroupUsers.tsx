import Typography from "@mui/material/Typography";
import React from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import {useLocation, useNavigate} from "react-router-dom";
import {GroupData} from "../../../../redux/rootslices/api/groups.slice";
import Button from "@mui/material/Button";
import {NavigateNext} from "@mui/icons-material";

export default function ManageGroupUsers(): React.ReactElement {
    const {state} = useLocation();
    const navigate = useNavigate()
    const groupData = state as GroupData;

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
                Manage {groupData.groupName}
            </Typography>
            <Box
                maxWidth="xl"
            >
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
                        Invitations
                    </Typography>
                    <Typography variant="body2">
                        Invite new users or revoke existing invitations. (Invitations cannot be revoked once accepted)
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        alignSelf: "end",
                        flexDirection: "row",
                        gap: 2,
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={false}
                            sx={{mt: 3, mb: 1}}
                            endIcon={<NavigateNext/>}
                        >
                            Invite New User
                        </Button>
                    </Box>
                </Card>
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
                        Add or remove existing users, revoke or grant editing permission and invite new users to your
                        group.
                    </Typography>
                    <Typography variant="body2">
                        Deleting the group will remove all information including group specific questions, users
                        associated with the groups and all responses. Proceed with caution.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        alignSelf: "end",
                        flexDirection: "row",
                        gap: 2,
                    }}>

                    </Box>
                </Card>
            </Box>
        </Container>
    )
}
