import Container from "@mui/material/Container";
import React, {useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {memoizedSelectUserData, setUserData} from "../../../../redux/rootslices/data/auth-data.slice";
import {Card, Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {isEmpty, isValidName} from "../../../../util/validation";
import Button from "@mui/material/Button";
import UserProfileAvatar from "../../../../components/elements/UserProfileAvatar";
import IconButton from "@mui/material/IconButton";
import {Edit} from "@mui/icons-material";
import {showFailureToast, showSuccessToast} from "../../../../util/toasts";
import {
    ChangeUserName, UploadDisplayPicture,
    useUpdateUserDisplayNameMutation,
    useUploadUserDisplayPictureMutation
} from "../../../../redux/rootslices/api/user.slice";
import ImageDialog, {ImageDialogProps, ImageDialogRef} from "../../../../components/elements/ImageDialog";

export default function ProfilePage(): React.ReactElement {
    const user = useSelector(memoizedSelectUserData);
    const dispatch = useDispatch();

    const [uploadUserDisplayPicture, {isLoading}] = useUploadUserDisplayPictureMutation();
    const [changeUserName, {isLoading: updatingUserName}] = useUpdateUserDisplayNameMutation()

    const [displayName, setDisplayName] = useState<string>(user.displayName);
    const [displayNameError, setDisplayNameError] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!displayName) {
            setDisplayNameError('Please enter a display name');
            return;
        } else if (displayName.trim().length < 3) {
            setDisplayNameError('Display name must have a minimum of 3 characters');
            return;
        } else if (!isValidName(displayName)) {
            setDisplayNameError('Display name can only contain letters, numbers, spaces, and underscores');
            return;
        } else if (displayName === user.displayName) {
            setDisplayNameError('Cannot update same value');
            return;
        } else {
            setDisplayNameError('');
        }

        const request: ChangeUserName = {
            userName: displayName
        }

        changeUserName(request)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    showSuccessToast('Display name updated successfully')
                    dispatch(setUserData(response.data))
                } else {
                    showFailureToast(response.message ?? 'Failed to update username, try again later')
                }
            })
            .catch((result) => {
                console.log(result)
                showFailureToast(result.message ?? "Failed to update username")
            })

    }

    const imageDialogRef = useRef<ImageDialogRef>(null);

    const imageDialogProps: ImageDialogProps = {
        title: 'Select Image',
        message: 'Please select an image to upload',
        acceptLabel: 'Upload',
        rejectLabel: 'Cancel',
        onAccept: async (file) => {
            imageDialogRef.current?.setButtonsEnabled(false);
            try {
                const formData = new FormData();
                formData.append('image', file);

                const response = await uploadUserDisplayPicture(formData).unwrap();

                if (response.success) {
                    showSuccessToast('Display picture updated successfully');
                    dispatch(setUserData(response.data));
                } else {
                    showFailureToast(response.message ?? 'Failed to update display picture, try again later');
                }
            } catch (error) {
                console.error('Error updating display picture:', error);
                showFailureToast('Failed to update display picture');
            } finally {
                imageDialogRef.current?.setButtonsEnabled(true);
            }
        },
        onReject: () => {
            console.log('Image selection cancelled');
        },
    };


    return (
        <Container
            component="main"
            disableGutters
            sx={{
                padding: 2,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                position: 'relative',
                minWidth: "100%",
                flex: 1
            }}
        >
            <ImageDialog ref={imageDialogRef} {...imageDialogProps} />
            <Typography
                component="h1"
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    alignSelf: "flex-start",
                    fontSize: {
                        xs: '1rem',
                        sm: '2rem',
                        xl: '3rem',
                    },
                }}
            >
                Manage User Profile
            </Typography>
            <Card
                sx={{
                    mt: 3,
                    p: 3,
                    maxWidth: "100%",
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                    <Box>
                        <Tooltip title="Edit">
                            <div style={{display: 'inline-block', position: 'relative'}}>
                                <UserProfileAvatar user={user} big/>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        right: '4px',
                                        backgroundColor: '#ffffff',
                                        color: '#ff6e23',
                                        '&:hover': {
                                            backgroundColor: '#ffbf93',
                                        },
                                    }}
                                    onClick={() => {
                                        if (imageDialogRef.current) {
                                            imageDialogRef.current.open();
                                        }
                                    }}
                                >
                                    <Edit/>
                                </IconButton>
                            </div>
                        </Tooltip>
                    </Box>
                    <Box
                        sx={{
                            pl: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                        <Typography component="h1" variant="h6" sx={{
                            fontWeight: 'bold',
                        }}>
                            {user.displayName}
                        </Typography>
                        <Typography variant="body1" sx={{}}>
                            {user.emailAddress}
                        </Typography>
                    </Box>
                </Box>
            </Card>
            <Card
                sx={{
                    mt: 3,
                    p: 3,
                    maxWidth: "100%",
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography component="h1" variant="h6" sx={{
                    fontWeight: 'bold',
                }}>
                    Update Display Name
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mt: 3,
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        value={displayName}
                        id="group-name"
                        label="User Name"
                        name="user-name"
                        type="text"
                        autoComplete="organization"
                        autoFocus
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setDisplayName(e.target.value)
                        }}
                        error={!isEmpty(displayNameError)}
                        helperText={displayNameError}
                    />
                    <Box sx={{
                        flex: 1
                    }}>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignSelf: "end",
                        flexDirection: "row",
                        gap: 2,
                    }}>
                        <Button
                            type="button"
                            variant="outlined"
                            disabled={updatingUserName}
                            onClick={() => {
                                setDisplayName(user.displayName)

                            }}
                            sx={{mt: 3, mb: 1}}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={updatingUserName}
                            sx={{mt: 3, mb: 1}}
                        >
                            Update Display Name
                        </Button>
                    </Box>
                </Box>
            </Card>
            <Box sx={{
                display: "flex",
                alignSelf: "end",
                flexDirection: "row",
                gap: 2,
            }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    disabled={updatingUserName}
                    sx={{mt: 3, mb: 1}}
                >
                    Delete User
                </Button>
            </Box>
        </Container>
    )
}