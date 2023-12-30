import React, {useState} from 'react';
import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {AddCircleOutline} from '@mui/icons-material';
import {QuestionType} from "../../redux/rootslices/api/questions.slice"; // Import makeStyles


const QuestionCard = () => {
    const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.TEXT);
    const [options, setOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState('');

    const handleOptionAdd = () => {
        if (newOption.trim() !== '' && !options.includes(newOption)) {
            setOptions([...options, newOption]);
            setNewOption('');
        }
    };

    return (
        <Card sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: '#2a2a2a',
        }}>
            <CardContent>
                <TextField
                    fullWidth
                    label="Hint"
                    variant="outlined"
                    margin="dense"
                    sx={{
                        marginBottom: 2
                    }}
                    // Add your hint state and change the value accordingly
                    // value={hint}
                    // onChange={(e) => setHint(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Question"
                    variant="outlined"
                    margin="dense"
                    sx={{
                        marginBottom: 2
                    }}
                    // Add your question state and change the value accordingly
                    // value={question}
                    // onChange={(e) => setQuestion(e.target.value)}
                />
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel htmlFor="question-type">Question Type</InputLabel>
                    <Select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                        label="Question Type"
                    >
                        {Object.values(QuestionType).map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {['RADIO', 'CHECKBOX', 'DROPDOWN_SINGLE', 'DROPDOWN_MULTIPLE'].includes(
                    questionType
                ) && (
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel htmlFor="options">Options</InputLabel>
                        <Select
                            multiple
                            value={options}
                            onChange={(e) => setOptions(e.target.value as string[])}
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
                )}
                {['RADIO_SINGLE', 'RADIO_MULTIPLE', 'DROPDOWN_SINGLE', 'DROPDOWN_MULTIPLE'].includes(
                    questionType
                ) && (
                    <TextField
                        fullWidth
                        label="New Option"
                        variant="outlined"
                        margin="dense"
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
                )}
            </CardContent>
        </Card>
    );
};

export default QuestionCard;
