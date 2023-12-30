import {QuestionRequest, Questions} from "../../redux/rootslices/api/questions.slice";
import React, {createContext, ReactNode, useContext, useReducer} from "react";

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
    payload: QuestionRequest;
};

type RemoveQuestionAction = {
    type: QuestionsActionType.REMOVE_QUESTION;
    payload: string;
};

type EditQuestionAction = {
    type: QuestionsActionType.EDIT_QUESTION;
    payload: {
        id: string;
        data: Partial<QuestionRequest>;
    };
};

type ReorderQuestionsAction = {
    type: QuestionsActionType.REORDER_QUESTIONS;
    payload: {
        startIndex: number;
        endIndex: number;
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
            return [...state, { id: null, ...action.payload }];
        case QuestionsActionType.REMOVE_QUESTION:
            return state.filter((question) => question.id !== action.payload);
        case QuestionsActionType.EDIT_QUESTION:
            return state.map((question) =>
                question.id === action.payload.id
                    ? { ...question, ...action.payload.data }
                    : question
            );
        case QuestionsActionType.REORDER_QUESTIONS:
            const { startIndex, endIndex } = action.payload;
            const [reorderedQuestion] = state.splice(startIndex, 1);
            state.splice(endIndex, 0, reorderedQuestion);
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
