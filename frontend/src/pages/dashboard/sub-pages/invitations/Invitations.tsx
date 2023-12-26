import React from "react";
import Typography from "@mui/material/Typography";
import {InvitationsProvider} from "../../../../components/elements/Invitations";
import {Container} from "@mui/material";
import InvitationCard from "../../../../components/elements/InvitationCard";

export default function Invitations(): React.ReactElement {
    return (
        <InvitationsProvider>
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
                    Invitations
                </Typography>
            {/*TODO - list invitations, accept, reject buttons*/}
                <InvitationCard/>
            </Container>
        </InvitationsProvider>
    )
}