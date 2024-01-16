import React, {useEffect, useState} from "react";
import {GroupData, GroupRequest as GroupIdRequest} from "../../../../redux/rootslices/api/groups.slice";
import {
    Questions,
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
import FormQuestionCard, {FormQuestionResponse} from "../../../../components/elements/FormQuestionCard";
import Button from "@mui/material/Button";


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

    const [groupData, setGroupData] = useState<GroupData>()
    const [questions, setQuestions] = useState<Questions>()
    const [questionsAlreadyTaken, setQuestionsAlreadyTaken] = useState<boolean>()
    const [formResponses, setFormResponses] = useState<FormQuestionResponse[]>([]);

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
                    setGroupData(response.data.group)
                    setQuestions(response.data.questions)
                    setQuestionsAlreadyTaken(response.data.questionsAlreadyTaken)
                } else {
                    showFailureToast(response.message ?? 'Failed to load questions, try again later')
                }
            })
            .catch((result) => {
                console.log(result)
                showFailureToast(result.message ?? "Failed to load questions")
            })
    }

    const handleAnswerChange = (response: FormQuestionResponse, index: number) => {
        setFormResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            updatedResponses[index] = response;
            return updatedResponses;
        });
    };


    const handleSubmit = () => {
        console.log("Form Responses:", formResponses);
    };

    return (
        <Box sx={{display: 'flex', height: "100%"}}>
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
            <Box
                component="main"
                sx={{
                    p: 2,
                    gap: 2,
                    width: "100%",
                }}
            >
                <DrawerHeader/>
                <Typography
                    component="h1"
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    {groupData?.groupName ?? 'Questions'}
                </Typography>
                <Typography
                    component="h1"
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        textAlign: 'center',
                        mb: 5
                    }}
                >
                    Fill out this form for this month's newsletter edition.
                </Typography>
                {
                    groupData?.acceptQuestionResponse ?
                        <React.Fragment>
                            {
                                questions?.map((question, index) => (
                                    <FormQuestionCard
                                        onAnswerChange={(response) => {
                                            handleAnswerChange(response, index)
                                        }}
                                        key={index}
                                        question={question}
                                        index={index}/>
                                ))
                            }
                            <Box sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                            }}>
                                <Box sx={{flex: 1}}/>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loadingQuestions}
                                    onClick={handleSubmit}
                                    sx={{
                                        mt: 2,
                                        mb: 3,
                                        pl: 5,
                                        pr: 5,
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </React.Fragment> :
                        <React.Fragment>
                            <Typography
                                component="h1"
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                }}
                            >
                                {
                                    questionsAlreadyTaken ?
                                        'You have already submitted this form, check back later.' :
                                        'Sorry, this form is closed now. Please check back later or reach out to your group owner/editor for a form.'
                                }

                            </Typography>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="text.secondary"
                                sx={{
                                    textAlign: 'center',
                                    mb: 5
                                }}
                            >
                                Contact <a
                                href={`mailto:${groupData?.groupOwner.emailAddress}`}>{groupData?.groupOwner.emailAddress}</a> for
                                more information
                            </Typography>
                        </React.Fragment>
                }
            </Box>
        </Box>
    )
}