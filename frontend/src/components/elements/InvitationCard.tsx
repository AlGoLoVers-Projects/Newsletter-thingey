import React, {useRef} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {
    Invitation,
    useAcceptInvitationMutation,
    useRejectInvitationMutation
} from "../../redux/rootslices/api/invitations.slice";
import {InvitationsActionType, useInvitations} from "./Invitations";
import {showFailureToast, showSuccessToast} from "../../util/toasts";
import {GroupIdRequest} from "../../redux/rootslices/api/groups.slice";
import AlertDialog, {AlertDialogRef} from "./AlertDialog";

export interface InvitationCardProp {
    invitation: Invitation
}

const InvitationCard = (prop: InvitationCardProp) => {
    const {group} = prop.invitation.id;
    const [acceptInvitation, {isLoading: accepting}] = useAcceptInvitationMutation()
    const [rejectInvitation, {isLoading: rejecting}] = useRejectInvitationMutation()

    const {dispatch: invitationsDispatch} = useInvitations();
    const dialogRef = useRef<AlertDialogRef>(null);

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
                    showFailureToast(response.message ?? 'Failed to accept invitation, try again later')
                }
            })
            .catch((result) => {
                console.log(result)
                showFailureToast(result.message ?? "Failed to accept invitation")
            })
    }

    const handleInvitationReject = () => {
        const request: GroupIdRequest = {
            groupId: group.id
        }

        rejectInvitation(request)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    showSuccessToast('Invitation rejected successfully')
                    invitationsDispatch({
                        type: InvitationsActionType.REMOVE_INVITATION_BY_ID,
                        payload: group.id,
                    });
                } else {
                    showFailureToast(response.message ?? 'Failed to remove invitation, try again later')
                }
            })
            .catch((result) => {
                showFailureToast(result.message ?? "Failed to remove invitation")
            })
    }

    return (
        <Card elevation={3} sx={{p: 1}}>
            <AlertDialog
                ref={dialogRef}
                title='Reject invitation?'
                message={`Are you sure you want to reject invitation for ${group.groupName}?`}
                acceptLabel='Leave'
                onAccept={handleInvitationReject}
            />
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
                    disabled={accepting || rejecting}
                    onClick={handleInvitationAccept}
                >
                    Accept
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={accepting || rejecting}
                    onClick={() => {
                        dialogRef.current?.open()
                    }}
                >
                    Reject
                </Button>
            </CardActions>
        </Card>
    );
};

export default InvitationCard;
