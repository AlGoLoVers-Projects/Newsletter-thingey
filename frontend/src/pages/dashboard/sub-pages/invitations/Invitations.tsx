import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import {InvitationsActionType, InvitationsProvider, useInvitations} from "../../../../components/elements/InvitationsProvider";
import {Box, Container} from "@mui/material";
import {Invitation, useListAllInvitationsMutation} from "../../../../redux/rootslices/api/invitations.slice";
import {showFailureToast} from "../../../../util/toasts";
import InvitationCard from "../../../../components/elements/InvitationCard";

function InvitationsComponent(): React.ReactElement {

    const [listInvitations] = useListAllInvitationsMutation()
    const {state, dispatch: invitationsDispatch} = useInvitations();

    const handleInvitationList = () => {
        listInvitations(null)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    const data: Invitation[] = response.data
                    invitationsDispatch({
                        type: InvitationsActionType.SET_INVITATIONS,
                        payload: data,
                    });
                } else {
                    showFailureToast(response.message ?? 'Failed to get invitations, try again later')
                }
            })
            .catch((result) => {
                showFailureToast(result.data.message ?? "Failed to get invitations")
            })
    }

    useEffect(() => {
        handleInvitationList()
    }, []);

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
                Invitations
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} sx={{mt: 2, mb: 4}}>
                {state.invitations.length !== 0 ? state.invitations.map((invitation) => (
                    <InvitationCard
                        key={invitation.id.group.id}
                        invitation={invitation}/>
                )) :
                <Typography variant="body2" color="text.secondary" align="center">
                    No invitations found
                </Typography>
                }
            </Box>
        </Container>
    )
}

export default function Invitations(): React.ReactElement {

    return (
        <InvitationsProvider>
            <InvitationsComponent/>
        </InvitationsProvider>
    )

}