import React, {forwardRef, useState, useImperativeHandle} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {isEmpty, isValidEmail} from "../../util/validation";

export interface InvitationDialogProps {
    onAccept?: (data: string) => void;
}

export interface InvitationDialogRef {
    openDialog: () => void;
}

const InvitationDialog = forwardRef<InvitationDialogRef, InvitationDialogProps>((props, ref) => {
    const {onAccept} = props;
    const [open, setOpen] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');

    const handleClose = () => {
        setOpen(false);
    };

    const handleInviteConfirmation = () => {
        let valid = true;

        if (!userEmail) {
            setEmailError('Please enter an email address');
            valid = false;
        } else if (!isValidEmail(userEmail)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (valid) {
            onAccept && onAccept(userEmail);
            setUserEmail('')
            handleClose();
        }
    };

    useImperativeHandle(ref, () => ({
        openDialog: () => {
            setOpen(true);
        },
    }));

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Invite User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To invite a new user, enter the user's email address below and click on invite. Existing users
                        cannot be invited, and users can only join the group after registering an account.
                    </DialogContentText>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={userEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setUserEmail(e.target.value);
                        }}
                        error={!isEmpty(emailError)}
                        helperText={emailError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleInviteConfirmation}>Invite</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
});

export default InvitationDialog;
