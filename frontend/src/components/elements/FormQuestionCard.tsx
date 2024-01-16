import React, {ChangeEvent, useState} from 'react';
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Input,
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
    index: number;
    onAnswerChange: (response: FormQuestionResponse) => void;
}

export type TextResponse = string;
export type ImageResponse = File | string | null;
export type SingleOptionResponse = string | null;
export type MultipleOptionsResponse = string[];

export type FormQuestionResponse =
    | { type: QuestionType.TEXT; response: TextResponse; id: string }
    | { type: QuestionType.IMAGE; response: ImageResponse; id: string }
    | { type: QuestionType.DATE | QuestionType.TIME | QuestionType.DROPDOWN; response: SingleOptionResponse; id: string }
    | { type: QuestionType.CHECKBOX; response: MultipleOptionsResponse; id: string }
    | undefined;

const FormQuestionCard: React.FC<QuestionCardProps> = ({ question, index, onAnswerChange }) => {
    const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<string[]>([]);
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleAnswerChange = (value: any, type: QuestionType) => {
        let response: FormQuestionResponse;

        switch (type) {
            case QuestionType.TEXT:
                response = { type: QuestionType.TEXT, response: value as TextResponse, id: question.id ?? '' };
                break;
            case QuestionType.IMAGE:
                response = { type: QuestionType.IMAGE, response: value as ImageResponse, id: question.id ?? '' };
                break;
            case QuestionType.DATE:
            case QuestionType.TIME:
            case QuestionType.DROPDOWN:
                setSelectedValue(value)
                response = { type, response: value as SingleOptionResponse, id: question.id ?? '' };
                break;
            case QuestionType.CHECKBOX:
                const checkboxOptions = Array.isArray(value)
                    ? value.map((v) => v.toString())
                    : [value.toString()];

                response = { type: QuestionType.CHECKBOX, response: checkboxOptions, id: question.id ?? '' };
                break;
            default:
                response = { type: QuestionType.TEXT, response: '', id: '' };

        }

        onAnswerChange(response);
    };

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
                        onChange={(event) => handleAnswerChange(event.target.value, QuestionType.TEXT)}
                    />
                );
            case QuestionType.IMAGE:
                return (
                    <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                        <Input
                            type="file"
                            color="secondary"
                            onChange={(event) => handleAnswerChange((event.target as HTMLInputElement).files?.[0] || null, QuestionType.IMAGE)}
                        />
                    </FormControl>
                );
            case QuestionType.DATE:
                return (
                    <TextField
                        type="date"
                        fullWidth
                        sx={{ mb: 2, mt: 1 }}
                        onChange={(event) => handleAnswerChange(event.target.value, QuestionType.DATE)}
                    />
                );
            case QuestionType.TIME:
                return (
                    <TextField
                        type="time"
                        fullWidth
                        sx={{ mb: 2, mt: 1 }}
                        onChange={(event) => handleAnswerChange(event.target.value, QuestionType.TIME)}
                    />
                );
            case QuestionType.CHECKBOX:
                return (
                    <FormGroup sx={{ mb: 2, mt: 1 }}>
                        {question.options &&
                            question.options.map((option, optionIndex) => (
                                <FormControlLabel
                                    key={optionIndex}
                                    control={
                                        <Checkbox
                                            checked={selectedCheckboxOptions.includes(option)}
                                            onChange={(event) => {
                                                const updatedOptions = event.target.checked
                                                    ? [...selectedCheckboxOptions, option]
                                                    : selectedCheckboxOptions.filter((item) => item !== option);

                                                setSelectedCheckboxOptions(updatedOptions);
                                                handleAnswerChange(updatedOptions, QuestionType.CHECKBOX);
                                            }}
                                        />
                                    }
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
                        sx={{ mb: 2, mt: 1 }}
                        value={selectedValue}
                        onChange={(event) => handleAnswerChange(event.target.value, question.questionType)}
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
