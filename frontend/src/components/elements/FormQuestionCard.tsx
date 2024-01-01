import React from 'react';
import {
    Typography,
    Card,
    CardContent,
    TextField,
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
                // Implement image input field logic
                return null;
            case QuestionType.DATE:
                return <TextField type="date" fullWidth />;
            case QuestionType.TIME:
                return <TextField type="time" fullWidth />;
            case QuestionType.RADIO:
                return (
                    <FormControl fullWidth>
                        <Select
                            labelId={`radio-label-${question.id}`}
                            label="Select Option"
                            onChange={(e) => onAnswerChange(question.id, e.target.value)}
                        >
                            {question.options && question.options.map((option, index) => (
                                <MenuItem key={index} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
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
            case QuestionType.DROPDOWN_SINGLE:
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
            case QuestionType.DROPDOWN_MULTIPLE:
                return (
                    <Select
                        labelId={`dropdown-multiple-label-${question.id}`}
                        label="Select Options"
                        multiple
                        fullWidth
                        value={[]} // Ensure that value is an array
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
