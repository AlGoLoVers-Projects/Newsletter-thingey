import React from 'react';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import {UserData} from "../../redux/rootslices/data/auth-data.slice";

interface UserProfileAvatarProps {
    user: UserData;
}

const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({ user }) => {
    const getInitials = (name: string) => {
        const initials = name.match(/\b\w/g) || [];
        return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    };

    const getRandomColor = () => {
        const colors = [deepOrange[500]];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const avatarStyle: React.CSSProperties = {
        backgroundColor: user.profilePicture ? 'transparent' : getRandomColor(),
        color: user.profilePicture ? 'inherit' : 'white',
    };

    return (
        <Avatar style={avatarStyle}>
            {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
                getInitials(user.displayName)
            )}
        </Avatar>
    );
};

export default UserProfileAvatar;
