import {baseApiSlice} from "./base.slice";
import {Result} from "../../../types/result";
import {GroupRequest} from "./groups.slice";

export enum QuestionType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    DATE = 'DATE',
    TIME = 'TIME',
    RADIO = 'RADIO',
    CHECKBOX = 'CHECKBOX',
    DROPDOWN_SINGLE = 'DROPDOWN_SINGLE',
    DROPDOWN_MULTIPLE = 'DROPDOWN_MULTIPLE'
}

export type Question = {
    questionIndex: number;
    question: string;
    hint: string | null;
    questionType: QuestionType,
    options: string[] | null
}

export type Questions = Question[]

export type GroupQuestionsRequest = {
    groupId: string,
    questions: Questions
}

export const invitationsSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrUpdateQuestions: builder.mutation<Result<Questions>, GroupQuestionsRequest>({
            query: (data) => ({
                url: '/api/questions/createOrUpdateQuestions',
                method: 'POST',
                body: data,
            }),
        }),
        getQuestions: builder.mutation<Result<Questions>, GroupRequest>({
            query: (data) => ({
                url: '/api/questions/getQuestions',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {useCreateOrUpdateQuestionsMutation, useGetQuestionsMutation} = invitationsSlice;
