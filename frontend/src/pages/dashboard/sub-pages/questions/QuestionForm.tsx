import React, {useEffect} from "react";
import { GroupRequest as GroupIdRequest} from "../../../../redux/rootslices/api/groups.slice";
import {
    useGetQuestionsMutation
} from "../../../../redux/rootslices/api/questions.slice";
import {showFailureToast} from "../../../../util/toasts";
import {useNavigate, useParams} from "react-router-dom";
import {authorizedPaths} from "../../../../router/paths";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import {AppBar, Toolbar} from "@mui/material";
import {styled, useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";


const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

export default function QuestionForm(): React.ReactElement {
    const {groupId} = useParams();
    const theme = useTheme()

    const [getQuestions, {isLoading: loadingQuestions}] = useGetQuestionsMutation()

    const navigate = useNavigate()

    if (groupId === undefined) {
        navigate(authorizedPaths.groups)
    }

    useEffect(() => {
        handleGetQuestions()
    }, []);

    const handleGetQuestions = () => {
        const request: GroupIdRequest = {
            groupId: groupId ?? ''
        }

        getQuestions(request)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    //response.data
                } else {
                    showFailureToast(response.message ?? 'Failed to load questions, try again later')
                }
            })
            .catch((result) => {
                console.log(result)
                showFailureToast(result.message ?? "Failed to load questions")
            })
    }

    return (
        <Box sx={{display: 'flex', height: "100vh"}}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{backgroundColor: theme.palette.primary.main}}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                    >
                        Newsletter
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="main"
                 sx={{flexGrow: 1, p: 3, height: "maxContent", display: "flex", flexDirection: "column"}}>
                <DrawerHeader/>
                <Typography
                    component="h1"
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    Question
                </Typography>
            </Box>
        </Box>
    )
}