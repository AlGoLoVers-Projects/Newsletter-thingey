import React, {forwardRef, useImperativeHandle, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface ExternalControlledDialogProps {
    title: string;
    message: string;
    acceptLabel?: string;
    rejectLabel?: string;
    onAccept?: () => void;
    onReject?: () => void;
}

const AlertDialog = forwardRef<
    { open: () => void; close: () => void },
    ExternalControlledDialogProps
>((props, ref) => {
    const {
        title,
        message,
        acceptLabel = 'Confirm',
        rejectLabel = 'Cancel',
        onAccept,
        onReject,
    } = props;

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        open: handleClickOpen,
        close: handleClose,
    }));

    const handleAccept = () => {
        onAccept && onAccept();
        handleClose();
    };

    const handleReject = () => {
        onReject && onReject();
        handleClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReject}>{rejectLabel}</Button>
                    <Button onClick={handleAccept}>{acceptLabel}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
});

export default AlertDialog;
