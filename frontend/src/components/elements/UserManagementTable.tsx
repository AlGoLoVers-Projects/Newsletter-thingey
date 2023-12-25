import React, {useRef, useState} from 'react';
import {
    styled,
} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {GroupMember} from "../../redux/rootslices/api/groups.slice";
import AlertDialog, {AlertDialogRef} from "./AlertDialog";

type UserManagementTableProps = {
    members: GroupMember[];
    onEditToggle: (user: GroupMember) => void;
    onDeleteUser: (user: GroupMember) => void;
};

const StyledTableCell = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
}));

const UserManagementTable: React.FC<UserManagementTableProps>
    = ({
           members,
           onEditToggle,
           onDeleteUser,
       }) => {
    const deleteUserRef = useRef<AlertDialogRef>(null);

    return (
        <TableContainer component={Paper}>
            <AlertDialog
                ref={deleteUserRef}
                title="Remove user?"
                message="Are you sure you want to remove this user?."
                onAcceptWithData={(data: any) => {
                    onDeleteUser(data)
                }}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>User</StyledTableCell>
                        <StyledTableCell>Email</StyledTableCell>
                        <StyledTableCell>Edit Access</StyledTableCell>
                        <StyledTableCell>Delete User</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.map((member) => (
                        <TableRow key={member.user.emailAddress}>
                            <TableCell>{member.user.displayName}</TableCell>
                            <TableCell>{member.user.emailAddress}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={false}
                                    onChange={() => onEditToggle(member)}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => {
                                        deleteUserRef.current?.openWithData(member)
                                    }}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserManagementTable;
