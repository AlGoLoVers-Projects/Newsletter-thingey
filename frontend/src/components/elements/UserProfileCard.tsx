import React from 'react';
import UserProfileAvatar from './UserProfileAvatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {User} from "../../redux/rootslices/api/groups.slice";

interface UserProfileCardProps {
    user: User;
    useCard?: boolean;
    elevation?: number;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({user, useCard = false, elevation = 1}) => {
    const content = (
        <Box display="flex" alignItems="center">
            <UserProfileAvatar user={user}/>
            <Box marginLeft={2}>
                <Typography variant="body1">{user.displayName}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {user.emailAddress}
                </Typography>
            </Box>
        </Box>
    );

    return useCard ? (
        <Card elevation={elevation}>
            <CardContent>{content}</CardContent>
        </Card>
    ) : (
        content
    );
};

export default UserProfileCard;
