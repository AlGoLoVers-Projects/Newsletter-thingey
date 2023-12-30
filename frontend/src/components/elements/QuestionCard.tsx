import React, {useState} from 'react';
import {
    Card,
    TextField,
    MenuItem,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    Typography,
} from '@mui/material';
import {AddCircleOutline} from '@mui/icons-material';
import {multiOptionType, Question, QuestionType} from "../../redux/rootslices/api/questions.slice";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

export interface QuestionCardProps {
    question: Question;
    index: number;
    onChange: (updatedQuestion: Question) => void;
    onDelete: () => void;
}

const QuestionCard = (props: QuestionCardProps) => {
    const [questionType, setQuestionType] = useState<QuestionType>(props.question.questionType ?? QuestionType.TEXT);
    const [options, setOptions] = useState<string[]>(props.question.options ?? []);
    const [newOption, setNewOption] = useState('');

    const handleOptionAdd = () => {
        if (newOption.trim() !== '' && !options.includes(newOption)) {
            setOptions([...options, newOption]);
            setNewOption('');
            props.onChange({
                ...props.question,
                options: [...options, newOption],
            });
        }
    };

    const handleQuestionChange = (value: string | string[], field: keyof Question) => {
        const updatedQuestion = {
            ...props.question,
            [field]: value,
        };
        props.onChange(updatedQuestion);
    };

    const handleDelete = () => {
        props.onDelete();
    };

    return (
        <Card sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            borderRadius: 3,
            backgroundColor: '#2a2a2a',
            p: 2,
            position: 'relative',
            '& > *': {
                mb: 2,
            },
        }}>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Typography variant="h6" sx={{width: '100%'}}>
                    Question {props.index + 1}
                </Typography>
                <IconButton
                    onClick={handleDelete}
                    sx={{}}
                >
                    <CloseIcon/>
                </IconButton>
            </Box>
            <TextField
                fullWidth
                value={props.question.question}
                label="Question"
                variant="outlined"
                margin="dense"
                onChange={(e) => handleQuestionChange(e.target.value, 'question')}
            />
            <TextField
                fullWidth
                value={props.question.hint}
                label="Hint"
                variant="outlined"
                margin="dense"
                onChange={(e) => handleQuestionChange(e.target.value, 'hint')}
            />
            <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel htmlFor="question-type">Question Type</InputLabel>
                <Select
                    value={questionType}
                    onChange={(e) => {
                        setQuestionType(e.target.value as QuestionType);
                        handleQuestionChange(e.target.value as string, 'questionType');
                    }}
                    label="Question Type"
                >
                    {Object.values(QuestionType).map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {multiOptionType.includes(
                questionType
            ) && (
                <React.Fragment>
                    <FormControl
                        variant="outlined"
                        margin="dense"
                        fullWidth
                    >
                        <InputLabel htmlFor="options">Options</InputLabel>
                        <Select
                            multiple
                            value={options}
                            onChange={(e) => {
                                setOptions(e.target.value as string[]);
                                handleQuestionChange(e.target.value as string[], 'options');
                            }}
                            label="Options"
                            renderValue={(selected) => (selected as string[]).join(', ')}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="New Option"
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleOptionAdd} edge="end">
                                        <AddCircleOutline/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </React.Fragment>
            )}
        </Card>
    );
};

export default QuestionCard;
