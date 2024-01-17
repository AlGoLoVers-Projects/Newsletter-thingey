import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Box, Container} from "@mui/material";
import {showFailureToast} from "../../../../util/toasts";
import {GroupData, GroupForm, useGetFormsForUserMutation} from "../../../../redux/rootslices/api/groups.slice";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {KeyboardArrowRight} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export default function OpenForm(): React.ReactElement {

    const navigate = useNavigate()

    const [listForms] = useGetFormsForUserMutation()
    const [groupFormData, setGroupFormData] = useState<GroupForm[]>([])

    const handleInvitationList = () => {
        listForms(null)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setGroupFormData(response.data)
                } else {
                    showFailureToast(response.message ?? 'Failed to get invitations, try again later')
                }
            })
            .catch((result) => {
                showFailureToast(result.data.message ?? "Failed to get invitations")
            })
    }

    useEffect(() => {
        handleInvitationList()
    }, []);

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
                Open Forms
            </Typography>
            <Typography variant="body2" color="text.secondary">
                You can view open forms from groups you are part of here
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} sx={{mt: 2, mb: 4}}>
                {groupFormData.length !== 0 ? groupFormData.map((group: GroupForm) => (
                        <Card
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#2a2a2a',
                                transition: 'background-color 0.3s',
                                pr: 1,
                                '&:hover': {
                                    backgroundColor: '#333333',
                                    cursor: "pointer"
                                },
                            }}
                            onClick={() => navigate(`/form/${group.groupId}`)}
                        >
                            <CardContent>
                                <Typography variant="body1">{group.groupName}</Typography>
                                <Typography variant="body2" color="text.secondary">{group.groupDescription}</Typography>
                            </CardContent>
                            <Box>
                                <KeyboardArrowRight/>
                            </Box>
                        </Card>
                    )) :
                    <Typography variant="body2" color="text.secondary" align="center">
                        No Forms found
                    </Typography>
                }
            </Box>
        </Container>
    )
}
