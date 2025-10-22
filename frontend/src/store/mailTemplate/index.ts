import { createSlice } from '@reduxjs/toolkit'
import { MailTemplateControllerGetAllMailTemplatesApiResponse, MailTemplateControllerSearchMailTemplatesApiResponse } from '@app/services/api/mailTemplate/mailTemplate'

export interface IMailTemplateStore {
    mailTemplateList: MailTemplateControllerGetAllMailTemplatesApiResponse
    searchMailTemplateList: MailTemplateControllerSearchMailTemplatesApiResponse
}

const initialState: IMailTemplateStore = {
    mailTemplateList: {} as MailTemplateControllerGetAllMailTemplatesApiResponse,
    searchMailTemplateList: {} as MailTemplateControllerSearchMailTemplatesApiResponse
}

const mailTemplateSlice = createSlice({
    name: 'mailTemplate',
    initialState,
    reducers: {
        setSearchMailTemplateList: (state, action) => {
            state.searchMailTemplateList = action.payload;
        },
        setMailTemplateList: (state, action) => {
            state.mailTemplateList = action.payload;
        },
    },
})

export const mailTemplateReducer = mailTemplateSlice.reducer
export const { setSearchMailTemplateList, setMailTemplateList } = mailTemplateSlice.actions
