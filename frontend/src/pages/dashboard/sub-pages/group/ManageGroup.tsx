import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import {isEmpty} from "../../../../util/validation";
import {useLocation, useNavigate} from "react-router-dom";
import {
    GroupData, GroupEditRequest, GroupIdRequest, GroupMember, useDeleteGroupMutation,
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
import {memoizedSelectUserData} from "../../../../redux/rootslices/data/auth-data.slice";
import UserProfileCard from "../../../../components/elements/UserProfileCard";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import UserManagementTable from "../../../../components/elements/UserManagementTable";

export default function ManageGroup(): React.ReactElement {
    const {state} = useLocation();
    const groupId = state as string;

    const groupData: GroupData = useSelector(
        (state) => selectGroupByIdMemoized(state, groupId)
    ) ?? {} as GroupData;

    const userEmailAddress = useSelector(memoizedSelectUserData).emailAddress

    if (isEmpty(groupId)) {
        return (
            <Typography variant="body1">
                Failed to load data
            </Typography>
        )
    }

    const isGroupOwner = groupData.groupOwner.emailAddress === userEmailAddress
    const groupUser: GroupMember | undefined = groupData.groupMembers.find(member => member.user.emailAddress === userEmailAddress)

    if (!groupUser) {
        return <Typography variant="body1">
            You are not part of this group
        </Typography>
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
                {isGroupOwner ? `Manage` : ''} {groupData.groupName}
            </Typography>
            {isGroupOwner ? <RenderOwnerGroup groupData={groupData} groupUser={groupUser}/> :
                <RenderMemberGroup groupData={groupData} canEdit={groupUser?.hasEditAccess ?? false}/>}
        </Container>
    )
}

function RenderMemberGroup(props: { groupData: GroupData, canEdit: boolean }): React.ReactElement {
    const groupData = props.groupData;

    //TODO: Render description, list all users, add button to leave group

    return (
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
                    Group Description
                </Typography>
                <Typography variant="body1">
                    {groupData.groupDescription}
                </Typography>

                <Typography component="h1" variant="h6" sx={{
                    fontWeight: 'bold',
                    mt: 4,
                    mb: 1
                }}>
                    Group Owner
                </Typography>
                <UserProfileCard user={groupData.groupOwner}/>
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
                    Group Members
                </Typography>
                <List>
                    {groupData?.groupMembers?.map(member =>
                        <ListItem key={member.user.emailAddress}>
                            <UserProfileCard user={member.user}/>
                        </ListItem>
                    )}
                </List>
            </Card>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
            }}>
                <Box sx={{flex: 1}}/>
                {
                    props.canEdit ? <Button
                        type="button"
                        variant="outlined"
                        sx={{mt: 3, mb: 1}}
                    >
                        Manage Questions
                    </Button> : <React.Fragment/>
                }
                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    sx={{mt: 3, mb: 1}}
                >
                    Leave Group
                </Button>
            </Box>
        </Box>
    )
}

function RenderOwnerGroup(props: { groupData: GroupData, groupUser: GroupMember }): React.ReactElement {
    const groupData = props.groupData;
    const groupMembers = groupData.groupMembers.filter(member => member !== props.groupUser)
    const navigate = useNavigate()
    const dispatch = useDispatch();

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
                        dispatch(updateGroupName({groupId: groupData.id, groupName: name}));
                        dispatch(updateGroupDescription({groupId: groupData.id, groupDescription: description}));

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
            {groupMembers.length !== 0 ?
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
                        Add or remove existing users, revoke or grant editing permission and manage your group
                        invitations.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        mt: 4
                    }}>
                        <UserManagementTable
                            onDeleteUser={(member) => {
                            }}
                            onEditToggle={(member) => {
                            }}
                            members={groupMembers}
                        />
                    </Box>
                </Card>
                : <React.Fragment/>
            }
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
                    Invitations
                </Typography>
                <Typography variant="body2">
                    Invite new users or revoke existing invitations. (Invitations cannot be revoked once accepted)
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
                        disabled={false}
                        sx={{mt: 3, mb: 1}}
                        endIcon={<NavigateNext/>}
                    >
                        Invite New User
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
                    Manage Questions
                </Typography>
                <Typography variant="body2">
                    Curate, edit or remove questions for users to fill out
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
                        endIcon={<NavigateNext/>}
                        onClick={() => {
                        }}
                    >
                        Manage Questions
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
                    Generate Newsletter
                </Typography>
                <Typography variant="body2">
                    If you're ready to publish your newsletter, proceed by clicking on the publish button. This is a one time process, questions cannot be processed and new newsletters cannot be issued once generated. Proceed with caution.
                </Typography>
                <Box sx={{
                    display: "flex",
                    alignSelf: "end",
                    flexDirection: "row",
                    gap: 2,
                }}>
                    <Button
                        type="submit"
                        variant="outlined"
                        disabled={isDeleting || isLoading}
                        sx={{mt: 3, mb: 1}}
                        onClick={() => {
                        }}
                    >
                        Publish Newsletter
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
    )
}
