import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import {useLocation} from "react-router-dom";
import {GroupData, GroupRequest as GroupIdRequest} from "../../../../redux/rootslices/api/groups.slice";
import {useSelector} from "react-redux";
import {selectGroupByIdMemoized} from "../../../../redux/rootslices/data/groups.slice";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {QuestionsActionType, QuestionsProvider, useQuestions} from "../../../../components/elements/QuestionsProvider";
import {
    GroupQuestionsRequest,
    Question, Questions,
    QuestionType,
    useCreateOrUpdateQuestionsMutation,
    useGetQuestionsMutation
} from "../../../../redux/rootslices/api/questions.slice";
import {showFailureToast, showSuccessToast} from "../../../../util/toasts";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

function ManageQuestionsComponent(): React.ReactElement {
    const {state} = useLocation();
    const groupId = state as string;

    const groupData: GroupData = useSelector(
        (state) => selectGroupByIdMemoized(state, groupId)
    ) ?? {} as GroupData;

    const {state: questionsState, dispatch: questionsDispatch} = useQuestions();
    const [getQuestions, {isLoading: loadingQuestions}] = useGetQuestionsMutation()
    const [updateQuestions, {isLoading: updatingQuestions}] = useCreateOrUpdateQuestionsMutation()

    const [originalQuestionState, setOriginalQuestionState] = useState<Questions>();

    console.log(questionsState)

    useEffect(() => {
        handleGetQuestions()
    }, []);

    const handleGetQuestions = () => {
        const request: GroupIdRequest = {
            groupId: groupId
        }

        getQuestions(request)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setOriginalQuestionState(response.data)
                    questionsDispatch({
                        type: QuestionsActionType.SET_QUESTIONS,
                        payload: response.data
                    });
                } else {
                    showFailureToast(response.message ?? 'Failed to load questions, try again later')
                }
            })
            .catch((result) => {
                console.log(result)
                showFailureToast(result.message ?? "Failed to load questions")
            })
    }

    const handleUpdateQuestions = () => {
        const request: GroupQuestionsRequest = {
            groupId: groupId,
            questions: questionsState
        }

        updateQuestions(request)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    showSuccessToast(response.message ?? 'Updated questions successfully')
                    setOriginalQuestionState(response.data)
                    questionsDispatch({
                        type: QuestionsActionType.SET_QUESTIONS,
                        payload: response.data
                    });
                } else {
                    showFailureToast(response.message ?? 'Failed to update questions, try again later')
                }
            })
            .catch((result) => {
                console.log(result)
                showFailureToast(result.message ?? "Failed to update questions")
            })
    }

    const handleReset = () => {
        if (originalQuestionState) {
            questionsDispatch({
                type: QuestionsActionType.SET_QUESTIONS,
                payload: originalQuestionState
            });
        }
    }

    const handleNewQuestion = () => {
        const newQuestion: Question = {
            questionIndex: -1,
            question: '',
            hint: '',
            questionType: QuestionType.TEXT,
            options: null
        }

        questionsDispatch({
            type: QuestionsActionType.ADD_QUESTION,
            payload: newQuestion,
        });
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
                            onClick={handleNewQuestion}
                            endIcon={<AddIcon/>}
                        >
                            New Question
                        </Button>
                    </Box>
                    <Typography variant="body2">
                        Curate, add or modify questions tailored for your group so you can stay in touch with
                        eachother.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        mt: 4
                    }}>

                        <List>
                            {
                                questionsState.map((question, index) => (
                                    <ListItem key={index}>
                                        <Card>
                                            <Typography>
                                                {question.question}
                                            </Typography>
                                            <Typography>
                                                {question.questionType}
                                            </Typography>
                                        </Card>
                                    </ListItem>
                                ))
                            }
                        </List>

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
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{mt: 3, mb: 1}}
                            onClick={handleUpdateQuestions}
                        >
                            Update Questions
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Container>
    )
}

export default function ManageQuestions(): React.ReactElement {
    return (
        <QuestionsProvider>
            <ManageQuestionsComponent/>
        </QuestionsProvider>
    )
}
