import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {Invitation, useAcceptInvitationMutation} from "../../redux/rootslices/api/invitations.slice";
import {InvitationsActionType, useInvitations} from "./Invitations";
import {showFailureToast, showSuccessToast} from "../../util/toasts";
import {GroupIdRequest} from "../../redux/rootslices/api/groups.slice";

export interface InvitationCardProp {
    invitation: Invitation
}

const InvitationCard = (prop: InvitationCardProp) => {
    const {group} = prop.invitation.id;
    const [acceptInvitation, {isLoading: accepting}] = useAcceptInvitationMutation()

    const {state, dispatch: invitationsDispatch} = useInvitations();

    const handleInvitationAccept = () => {
        const request: GroupIdRequest = {
            groupId: group.id
        }

        acceptInvitation(request)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    showSuccessToast(`Invitation accepted successfully, you are now part of ${group.groupName}`)
                    invitationsDispatch({
                        type: InvitationsActionType.REMOVE_INVITATION_BY_ID,
                        payload: group.id,
                    });
                } else {
                    showFailureToast(response.message ?? 'Failed to get invitations, try again later')
                }
            })
            .catch((result) => {
                showFailureToast(result.data.message ?? "Failed to get invitations")
            })
    }

    return (
        <Card elevation={3} sx={{p: 1}}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {group.groupName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    {group.groupDescription}
                </Typography>
                <Box sx={{mt: 1}}>
                    <Typography variant="body2" color="textSecondary">
                        Owner: {group.groupOwner.displayName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Email: {group.groupOwner.emailAddress}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleInvitationAccept}
                >
                    Accept
                </Button>
                <Button variant="contained" color="error">
                    Reject
                </Button>
            </CardActions>
        </Card>
    );
};

export default InvitationCard;
