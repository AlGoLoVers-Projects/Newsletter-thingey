import Typography from "@mui/material/Typography";
import React from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import {useLocation} from "react-router-dom";
import {GroupData} from "../../../../redux/rootslices/api/groups.slice";
import {useSelector} from "react-redux";
import {selectGroupByIdMemoized} from "../../../../redux/rootslices/data/groups.slice";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export default function ManageQuestions(): React.ReactElement {
    const {state} = useLocation();
    const groupId = state as string;

    const groupData: GroupData = useSelector(
        (state) => selectGroupByIdMemoized(state, groupId)
    ) ?? {} as GroupData;

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
                {groupData.groupName}
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
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: "row",
                    }}>
                        <Typography component="h1" variant="h6" sx={{
                            fontWeight: 'bold',
                        }}>
                            Manage Questions
                        </Typography>
                        <Button
                            variant="contained"
                            color="success"
                            endIcon={<AddIcon/>}
                        >
                            New Question
                        </Button>
                    </Box>
                    <Typography variant="body2">
                        Curate, add or modify questions tailored for your group so you can stay in touch with eachother.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        mt: 4
                    }}>

                        {/*TODO: Render existing questions here*/}
                        {/*TODO: Create slice to maintain questions*/}
                        {/*TODO: Create provider for questions. ADD, UPDATE, REORDER INDEX, DELETE*/}

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
                            sx={{mt: 3, mb: 1}}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 3, mb: 1}}
                        >
                            Update Questions
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Container>
    )
}
