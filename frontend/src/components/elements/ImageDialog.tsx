import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export type ImageDialogRef = {
    open: () => void;
    close: () => void;
} | null;

export interface ImageDialogProps {
    title: string;
    message: string;
    acceptLabel?: string;
    rejectLabel?: string;
    onAccept?: (file: File) => Promise<void>;
    onReject?: () => void;
}

const ImageDialog = forwardRef<ImageDialogRef, ImageDialogProps>((props, ref) => {
    const {
        title,
        message,
        acceptLabel = 'Confirm',
        rejectLabel = 'Cancel',
        onAccept,
        onReject,
    } = props;

    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAccept = async () => {
        if (selectedImage && onAccept) {
            await onAccept(selectedImage);
            handleClose();
        }
    };

    const handleReject = () => {
        handleClose();
        onReject && onReject();
    };

    useImperativeHandle(ref, () => ({
        open: handleClickOpen,
        close: handleClose,
    }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    return (
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
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReject}>{rejectLabel}</Button>
                <Button onClick={handleAccept}>{acceptLabel}</Button>
            </DialogActions>
        </Dialog>
    );
});

export default ImageDialog;
