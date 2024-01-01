import {baseApiSlice} from "./base.slice";
import {Result} from "../../../types/result";
import {GroupData, GroupRequest} from "./groups.slice";
import exp from "node:constants";
import Groups from "../../../pages/dashboard/sub-pages/group/Groups";

export enum QuestionType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    DATE = 'DATE',
    TIME = 'TIME',
    CHECKBOX = 'CHECKBOX',
    DROPDOWN = 'DROPDOWN',
}

export const multiOptionType = [QuestionType.CHECKBOX, QuestionType.DROPDOWN]

export type Question = {
    id?: string;
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

export type GroupQuestionsResponse = {
    questions: Questions,
    group: GroupData
}

export const invitationsSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrUpdateQuestions: builder.mutation<Result<GroupQuestionsResponse>, GroupQuestionsRequest>({
            query: (data) => ({
                url: '/api/questions/createOrUpdateQuestions',
                method: 'POST',
                body: data,
            }),
        }),
        getQuestions: builder.mutation<Result<GroupQuestionsResponse>, GroupRequest>({
            query: (data) => ({
                url: '/api/questions/getQuestions',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {useCreateOrUpdateQuestionsMutation, useGetQuestionsMutation} = invitationsSlice;
