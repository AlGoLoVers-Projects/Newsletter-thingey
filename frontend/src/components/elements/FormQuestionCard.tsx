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
import {Question, QuestionType} from "../../redux/rootslices/api/questions.slice";

interface QuestionCardProps {
    question: Question;
    index: number;
    onAnswerChange: (id: string | undefined, value: any) => void;
}

const FormQuestionCard: React.FC<QuestionCardProps> = ({question, index, onAnswerChange}) => {
    const renderInputField = () => {
        switch (question.questionType) {
            case QuestionType.TEXT:
                return (
                    <TextField
                        label="Answer"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 2, mt: 1 }}
                    />
                );
            case QuestionType.IMAGE:
                return (
                    <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                        <Input
                            type="file"
                            color="secondary"
                        />
                    </FormControl>
                );
            case QuestionType.DATE:
                return <TextField type="date" fullWidth sx={{ mb: 2, mt: 1 }} />;
            case QuestionType.TIME:
                return <TextField type="time" fullWidth sx={{ mb: 2, mt: 1 }} />;
            case QuestionType.CHECKBOX:
                return (
                    <FormGroup sx={{ mb: 2, mt: 1 }}>
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
                        sx={{ mb: 2, mt: 1 }}
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
        <Card sx={{ marginBottom: 2, width: '100%' }}>
            <CardContent>
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ marginRight: '16px', backgroundColor: '#ccc' }}>
                        <Typography variant="body1" align="center">{index + 1}</Typography>
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
