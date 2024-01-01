import React from 'react';
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Input,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Avatar,
    Box,
} from '@mui/material';
import { Question, QuestionType } from "../../redux/rootslices/api/questions.slice";

interface QuestionCardProps {
    question: Question;
    onAnswerChange: (id: string | undefined, value: any) => void;
}

const FormQuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswerChange }) => {
    const renderInputField = () => {
        switch (question.questionType) {
            case QuestionType.TEXT:
                return <TextField label="Answer" fullWidth />;
            case QuestionType.IMAGE:
                return (
                    <FormControl fullWidth>
                        <Input
                            type="file"
                        />
                    </FormControl>
                )
            case QuestionType.DATE:
                return <TextField type="date" fullWidth />;
            case QuestionType.TIME:
                return <TextField type="time" fullWidth />;
            case QuestionType.CHECKBOX:
                return (
                    <FormGroup>
                        {question.options && question.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={<Checkbox />}
                                label={option}
                            />
                        ))}
                    </FormGroup>
                );
            case QuestionType.DROPDOWN:
                return (
                    <Select
                        labelId={`dropdown-label-${question.id}`}
                        label="Select Option"
                        fullWidth
                        onChange={(e) => onAnswerChange(question.id, e.target.value)}
                    >
                        {question.options && question.options.map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                );
            default:
                return null;
        }
    };

    return (
        <Card sx={{ marginBottom: '16px', width: '100%' }}>
            <CardContent>
                <Box display="flex" alignItems="center" marginBottom="8px">
                    <Avatar sx={{ marginRight: '16px', backgroundColor: '#ccc' }}>
                        <Typography variant="body1" align="center">{question.questionIndex}</Typography>
                    </Avatar>
                    <Box flex="1">
                        <Typography variant="h6">{question.question}</Typography>
                        {question.hint && <Typography color="textSecondary">{question.hint}</Typography>}
                    </Box>
                </Box>
                {renderInputField()}
            </CardContent>
        </Card>
    );
};

export default FormQuestionCard;
