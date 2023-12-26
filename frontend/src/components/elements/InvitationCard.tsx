import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import {Invitation} from "../../redux/rootslices/api/invitations.slice";

export interface InvitationCardProp {
    invitation: Invitation
}

const InvitationCard = (prop: InvitationCardProp) => {
    const {group} = prop.invitation.id;

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
                <Button variant="contained" color="success">
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
