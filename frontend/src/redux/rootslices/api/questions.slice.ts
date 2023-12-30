import {baseApiSlice} from "./base.slice";
import {Result} from "../../../types/result";
import {GroupRequest} from "./groups.slice";

export enum QuestionType {
    TEXT,
    IMAGE,
    DATE,
    TIME,
    RADIO_SINGLE,
    RADIO_MULTIPLE,
    DROPDOWN_SINGLE,
    DROPDOWN_MULTIPLE
}

export type QuestionRequest = {
    questionIndex: number;
    question: string;
    hint: string | null;
    questionType: QuestionType,
    options: string[] | null
}

export type Question = {
    id: string | null;
} & QuestionRequest

export type GroupQuestionsRequest = {
    groupId: string,
    questions: QuestionRequest[]
}

export type Questions = Question[]

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
