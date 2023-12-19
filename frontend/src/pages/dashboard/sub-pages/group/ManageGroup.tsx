import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import {isEmpty} from "../../../../util/validation";
import {useLocation, useNavigate} from "react-router-dom";
import {GroupData, GroupDataRequest} from "../../../../redux/rootslices/api/groups.slice";

export default function ManageGroup(): React.ReactElement {
    const navigate = useNavigate()
    const { state } = useLocation();
    const groupData = (state as GroupData)

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
                Manage Newsletter Group
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
                        Manage {groupData.groupName}
                    </Typography>

                </Card>
            </Box>
        </Container>
    )
}
