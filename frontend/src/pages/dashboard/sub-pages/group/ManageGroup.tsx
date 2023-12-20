import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import {isEmpty} from "../../../../util/validation";
import {useLocation, useNavigate} from "react-router-dom";
import {
    GroupData, GroupEditRequest, GroupIdRequest, useDeleteGroupMutation,
    useEditGroupMutation,
} from "../../../../redux/rootslices/api/groups.slice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {showFailureToast, showSuccessToast} from "../../../../util/toasts";
import {authorizedPaths} from "../../../../router/paths";
import {NavigateNext} from "@mui/icons-material";
import {
    selectGroupByIdMemoized,
    updateGroupDescription,
    updateGroupName
} from "../../../../redux/rootslices/data/groups.slice";
import {useDispatch, useSelector} from "react-redux";

export default function ManageGroup(): React.ReactElement {
    const {state} = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const groupId = state as string;

    const groupData: GroupData = useSelector(
        (state) => selectGroupByIdMemoized(state, groupId)
    ) ?? {} as GroupData;

    const [editGroup, {isLoading}] = useEditGroupMutation()
    const [deleteGroup, {isLoading: isDeleting}] = useDeleteGroupMutation()

    const [groupNameError, setGroupNameError] = useState<string>('')
    const [groupDescError, setGroupDescError] = useState<string>('')

    const [groupName, setGroupName] = useState<string>(groupData.groupName)
    const [groupDesc, setGroupDesc] = useState<string>(groupData.groupDescription)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('group-name')?.toString() ?? '';
        const description = data.get('description')?.toString() ?? '';

        let valid: boolean = true

        if (isEmpty(name)) {
            setGroupNameError("Please enter a group name")
            valid = false
        } else {
            setGroupNameError('')
        }

        if (isEmpty(description)) {
            setGroupDescError("Please enter a description")
            valid = false
        } else {
            setGroupDescError('')
        }

        if (name === groupData.groupName && description === groupData.groupDescription) {
            showFailureToast("Cannot update same values, discarding request")
            valid = false
        }

        if (valid) {
            const data: GroupEditRequest = {
                groupId: groupData.id,
                groupName: name,
                groupDescription: description
            }

            editGroup(data)
                .unwrap()
                .then((response) => {
                    if (response.success) {
                        showSuccessToast("Group data updated successfully")
                        dispatch(updateGroupName({ groupId: groupData.id, groupName: name }));
                        dispatch(updateGroupDescription({ groupId: groupData.id, groupDescription: description }));

                    } else {
                        showFailureToast(response.message ?? 'Group update failed, try again later')
                    }
                })
                .catch((result) => {
                    showFailureToast(result.data.message ?? "Could not update group information")
                })
        }
    }

    const handleDeletion = () => {
        //TODO: Ask confirmation
        const data: GroupIdRequest = {
            groupId: groupData.id
        }

        deleteGroup(data)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    showSuccessToast("Group deleted successfully")
                    navigate(authorizedPaths.groups)
                } else {
                    showFailureToast(response.message ?? 'Group deletion failed, try again later')
                }
            })
            .catch((result) => {
                showFailureToast(result.data.message ?? "Could delete group")
            })
    }

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
                Manage {groupData.groupName}
            </Typography>
            <Box
                maxWidth="xl"
            >
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
                        Update Group Information
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
                            value={groupName}
                            id="group-name"
                            label="Group Name"
                            name="group-name"
                            type="text"
                            autoComplete="organization"
                            autoFocus
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setGroupName(e.target.value)
                            }}
                            error={!isEmpty(groupNameError)}
                            helperText={groupNameError}
                        />
                        <TextField
                            rows={4}
                            multiline
                            margin="normal"
                            required
                            fullWidth
                            value={groupDesc}
                            name="description"
                            label="Description"
                            type="text"
                            id="description"
                            autoComplete="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setGroupDesc(e.target.value)
                            }}
                            error={!isEmpty(groupDescError)}
                            helperText={groupDescError}
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
                                disabled={isDeleting || isLoading}
                                onClick={() => {
                                    setGroupName(groupData.groupName)
                                    setGroupDesc(groupData.groupDescription)
                                }}
                                sx={{mt: 3, mb: 1}}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isDeleting || isLoading}
                                sx={{mt: 3, mb: 1}}
                            >
                                Update Group Information
                            </Button>
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
                        Manage Users
                    </Typography>
                    <Typography variant="body2">
                        Add or remove existing users, revoke or grant editing permission and manage your group invitations.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        alignSelf: "end",
                        flexDirection: "row",
                        gap: 2,
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{mt: 3, mb: 1}}
                            onClick={() => {
                                navigate(authorizedPaths.manageGroupUsers, {state: groupData})
                            }}
                            endIcon={<NavigateNext />}
                        >
                            Manage Users
                        </Button>
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
                        Delete Group
                    </Typography>
                    <Typography variant="body2">
                        Deleting the group will remove all information including group specific questions, users
                        associated with the groups and all responses. Proceed with caution.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        alignSelf: "end",
                        flexDirection: "row",
                        gap: 2,
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isDeleting || isLoading}
                            sx={{mt: 3, mb: 1}}
                            onClick={() => {
                                handleDeletion()
                            }}
                        >
                            Delete Group
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Container>
    )
}
