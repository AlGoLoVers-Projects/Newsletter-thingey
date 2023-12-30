import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {Question, Questions} from "../../redux/rootslices/api/questions.slice";

export enum QuestionsActionType {
    SET_QUESTIONS = 'SET_QUESTIONS',
    ADD_QUESTION = 'ADD_QUESTION',
    REMOVE_QUESTION = 'REMOVE_QUESTION',
    EDIT_QUESTION = 'EDIT_QUESTION',
    REORDER_QUESTIONS = 'REORDER_QUESTIONS',
}

type SetQuestionsAction = {
    type: QuestionsActionType.SET_QUESTIONS;
    payload: Questions;
};

type AddQuestionAction = {
    type: QuestionsActionType.ADD_QUESTION;
    payload: Question;
};

type RemoveQuestionAction = {
    type: QuestionsActionType.REMOVE_QUESTION;
    payload: number;
};

type EditQuestionAction = {
    type: QuestionsActionType.EDIT_QUESTION;
    payload: {
        questionIndex: number;
        data: Partial<Question>;
    };
};

type ReorderQuestionsAction = {
    type: QuestionsActionType.REORDER_QUESTIONS;
    payload: {
        oldIndex: number;
        newIndex: number;
    };
};

type QuestionsAction =
    | SetQuestionsAction
    | AddQuestionAction
    | RemoveQuestionAction
    | EditQuestionAction
    | ReorderQuestionsAction;

const questionsReducer = (state: Questions, action: QuestionsAction): Questions => {
    switch (action.type) {
        case QuestionsActionType.SET_QUESTIONS:
            return action.payload;
        case QuestionsActionType.ADD_QUESTION:
            return [...state, action.payload];
        case QuestionsActionType.REMOVE_QUESTION:
            return state.filter((_, index) => index !== action.payload);
        case QuestionsActionType.EDIT_QUESTION:
            return state.map((question, index) =>
                index === action.payload.questionIndex
                    ? { ...question, ...action.payload.data }
                    : question
            );
        case QuestionsActionType.REORDER_QUESTIONS:
            const { oldIndex, newIndex } = action.payload;
            const [reorderedQuestion] = state.splice(oldIndex, 1);
            reorderedQuestion.questionIndex = newIndex; // Update the questionIndex
            state.splice(newIndex, 0, reorderedQuestion);
            return [...state];
        default:
            return state;
    }
};

type QuestionsContextType = {
    state: Questions;
    dispatch: React.Dispatch<QuestionsAction>;
};

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

type QuestionsProviderProps = {
    children: ReactNode;
};

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(questionsReducer, []);

    return (
        <QuestionsContext.Provider value={{ state, dispatch }}>
            {children}
        </QuestionsContext.Provider>
    );
};

export const useQuestions = () => {
    const context = useContext(QuestionsContext);
    if (!context) {
        throw new Error('useQuestions must be used within a QuestionsProvider');
    }
    return context;
};
