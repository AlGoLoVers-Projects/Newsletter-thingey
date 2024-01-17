import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {Card, Container} from "@mui/material";
import Box from "@mui/material/Box";
import {useLocation} from "react-router-dom";
import {GroupData, GroupRequest as GroupIdRequest} from "../../../../redux/rootslices/api/groups.slice";
import {useDispatch, useSelector} from "react-redux";
import {selectGroupByIdMemoized, updateSingleGroupData} from "../../../../redux/rootslices/data/groups.slice";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
    EditQuestion,
    QuestionsActionType,
    QuestionsProvider,
    useQuestions
} from "../../../../components/elements/QuestionsProvider";
import {
    GroupQuestionsRequest, multiOptionType,
    Question, Questions,
    QuestionType,
    useCreateOrUpdateQuestionsMutation,
    useGetQuestionsMutation
} from "../../../../redux/rootslices/api/questions.slice";
import {showFailureToast, showSuccessToast} from "../../../../util/toasts";
import QuestionCard from "../../../../components/elements/QuestionCard";
import Alert from "@mui/material/Alert";

type QuestionError = {
    question?: string;
    options?: string
}

function ManageQuestionsComponent(): React.ReactElement {
    const {state} = useLocation();
    const groupId = state as string;

    const groupData: GroupData = useSelector(
        (state) => selectGroupByIdMemoized(state, groupId)
    ) ?? {} as GroupData;

    const dispatch = useDispatch();

    const {state: questionsState, dispatch: questionsDispatch} = useQuestions();
    const [getQuestions, {isLoading: loadingQuestions}] = useGetQuestionsMutation()
    const [updateQuestions, {isLoading: updatingQuestions}] = useCreateOrUpdateQuestionsMutation()

    const [originalQuestionState, setOriginalQuestionState] = useState<Questions>();
    const [errors, setErrors] = useState<QuestionError[] | null>();

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
                    setOriginalQuestionState(response.data.questions)
                    questionsDispatch({
                        type: QuestionsActionType.SET_QUESTIONS,
                        payload: response.data.questions
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

    const validateQuestions = (questions: Questions): QuestionError[] => {
        const errors: QuestionError[] = [];

        questions.forEach((question, index) => {
            const questionError: QuestionError = {};

            if (!question.question || question.question.trim() === '') {
                questionError.question = 'Question is required for question number ' + (index + 1);
            }

            if (
                multiOptionType.includes(question.questionType) &&
                (!question.options || question.options.length === 0)
            ) {
                questionError.options = 'Options are required for question ' + (index + 1);
            }

            errors[index] = questionError;
        });

        return errors;
    };

    const handleUpdateQuestions = () => {
        const validationErrors: QuestionError[] = validateQuestions(questionsState);

        if (validationErrors.some((error) => Object.keys(error).length > 0)) {
            console.log('Validation errors:', validationErrors);
            setErrors(validationErrors)
            showFailureToast('There are errors in your questions, please handle them')
            return;
        } else {
            setErrors(null)
        }

        const request: GroupQuestionsRequest = {
            groupId: groupId,
            questions: questionsState
        }

        updateQuestions(request)
            .unwrap()
            .then((response) => {
                if (response.success) {
                    showSuccessToast(response.message ?? 'Updated questions successfully')
                    setOriginalQuestionState(response.data.questions)
                    questionsDispatch({
                        type: QuestionsActionType.SET_QUESTIONS,
                        payload: response.data.questions
                    });
                    dispatch(updateSingleGroupData({updatedData: response.data.group}))
                } else {
                    showFailureToast(response.message ?? 'Failed to update questions, try again later')
                }
            })
            .catch((result) => {
                console.log(result)
                showFailureToast(result.data.message ?? "Failed to update questions")
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
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 1
                        }}
                    >
                        Curate, add or modify questions tailored for your group so you can stay in touch with
                        each other.
                    </Typography>
                    {errors && (
                        <Alert severity="error" sx={{mt: 2}}>
                            <Typography variant="body1">Validation Errors:</Typography>
                            <ul>
                                {errors.map((errorList, index) => (
                                    <React.Fragment key={index}>
                                        {errorList.question && (
                                            <li>{errorList.question}</li>
                                        )}
                                        {errorList.options && (
                                            <li>{errorList.options}</li>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ul>
                        </Alert>
                    )}
                    <Box sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        gap: 1,
                        mt: 4
                    }}>
                        {
                            questionsState.map((question, index) => (
                                <QuestionCard
                                    question={question}
                                    index={index}
                                    key={index}
                                    onChange={(question) => {
                                        const payload: EditQuestion = {
                                            questionIndex: index,
                                            data: question
                                        }

                                        questionsDispatch({
                                            type: QuestionsActionType.EDIT_QUESTION,
                                            payload: payload
                                        });

                                        setOriginalQuestionState(questionsState)
                                    }}
                                    onDelete={() => {
                                        questionsDispatch({
                                            type: QuestionsActionType.REMOVE_QUESTION,
                                            payload: index
                                        });
                                    }}/>
                            ))
                        }
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
