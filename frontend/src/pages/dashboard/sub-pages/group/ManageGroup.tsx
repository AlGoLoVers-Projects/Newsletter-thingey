import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {isEmpty} from "../../../../util/validation";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {authorizedPaths} from "../../../../router/paths";
import {GroupDataRequest, useNewGroupMutation} from "../../../../redux/rootslices/groups.slice";
import {showFailureToast, showSuccessToast} from "../../../../util/toasts";

export default function ManageGroup(): React.ReactElement {
    const navigate = useNavigate()
    const [newGroup, {isLoading: isCreatingGroup}] = useNewGroupMutation()

    const [groupNameError, setGroupNameError] = useState<string>('')
    const [groupDescError, setGroupDescError] = useState<string>('')

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

        if (valid) {
            const data: GroupDataRequest = {
                groupName: name,
                groupDescription: description
            }

            newGroup(data)
                .unwrap()
                .then((response) => {
                    if (response.success) {
                        showSuccessToast("Group has been created successfully")
                        navigate(authorizedPaths.groups)

                        //TODO: Redirect to users management in future

                    } else {
                        showFailureToast(response.message ?? 'Group creation failed, try again later')
                    }
                })
                .catch((result) => {
                    showFailureToast(result.data.message ?? "Could not create new group")
                })

        }

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
                New Group
            </Typography>
            <Box
                maxWidth="xl"
            >
                <Card
                    sx={{
                        mt: 3,
                        p: 5,
                        maxWidth: "100%",
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{
                        fontWeight: 'bold',
                    }}>
                        Create new Newsletter Group
                    </Typography>

                </Card>
            </Box>
        </Container>
    )
}
