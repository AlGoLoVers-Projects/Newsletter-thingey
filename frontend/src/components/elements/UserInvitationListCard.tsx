import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from '@mui/icons-material/Close';

interface InvitationListCardProps {
    emailAddress: string;
    onDelete: () => void;
}

const UserInvitationListCard: React.FC<InvitationListCardProps> = ({emailAddress, onDelete}) => {
    return (
        <Card
            sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#2a2a2a',
                transition: 'background-color 0.3s',
                pr: 1,
                '&:hover': {
                    backgroundColor: '#333333',
                    cursor: "pointer"
                },
            }}
        >
            <CardContent>
                <Typography variant="body1">{emailAddress}</Typography>
            </CardContent>
            <Box>
                <IconButton onClick={onDelete}>
                    <CloseIcon/>
                </IconButton>
            </Box>
        </Card>
    );
};

// Define propTypes for type checking
UserInvitationListCard.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default UserInvitationListCard;
