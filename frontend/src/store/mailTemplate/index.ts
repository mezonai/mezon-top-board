import { createSlice } from '@reduxjs/toolkit'
import { MailTemplateControllerGetAllMailsApiResponse, MailTemplateControllerGetMailsSearchApiResponse } from '@app/services/api/marketingMail/marketingMail.types'

export interface IMailTemplateStore {
    mailTemplateList: MailTemplateControllerGetAllMailsApiResponse
    searchMailTemplateList: MailTemplateControllerGetMailsSearchApiResponse
}

const initialState: IMailTemplateStore = {
    mailTemplateList: {} as MailTemplateControllerGetAllMailsApiResponse,
    searchMailTemplateList: {} as MailTemplateControllerGetMailsSearchApiResponse
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
