import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GroupList from "./GroupList";
import {GroupListData, useGetGroupsMutation} from "../../../../redux/rootslices/api/groups.slice";
import {Result} from "../../../../types/result";
import {showFailureToast} from "../../../../util/toasts";
import {useNavigate} from "react-router-dom";
import {authorizedPaths} from "../../../../router/paths";
import {useDispatch} from "react-redux";
import {setGroupData} from "../../../../redux/rootslices/data/groups.slice";
import {CircularProgress} from "@mui/material";

const Groups = (): React.ReactElement => {

    const [groupList, {isLoading}] = useGetGroupsMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        groupList(null)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    const sortedData = response.data
                        .slice()
                        .sort((a, b) => {
                            const dateA = a.updatedAt || '';
                            const dateB = b.updatedAt || '';

                            return dateB.localeCompare(dateA);
                        }) ?? 0;
                    dispatch(setGroupData(sortedData))
                } else {
                    showFailureToast(response.message ?? 'Token validation failed, signing out')
                }
            })
            .catch((error) => {
                console.log(error)
                let responseData: Result<null> = error.error;
                showFailureToast(responseData.message ?? 'Token validation failed, signing out')
            })

    }, [])

    return (
        <Container
            component="main"
            disableGutters
            maxWidth="xl"
            sx={{
                padding: 2,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                position: 'relative',
            }}
        >
            <Typography
                component="h1"
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    fontSize: {
                        xs: '1rem',
                        sm: '2rem',
                        xl: '3rem',
                    },
                }}
            >
                Groups
            </Typography>
            <Box>
                {isLoading ? <CircularProgress/> : <GroupList/>}
            </Box>
            <Fab
                color="primary"
                variant="extended"
                style={{
                    position: 'fixed',
                    bottom: 25,
                    right: 25,
                }}
                onClick={() => {
                    navigate(authorizedPaths.newGroup)
                }}
            >
                <AddIcon/>
                New group
            </Fab>
        </Container>
    );
};

export default Groups;
