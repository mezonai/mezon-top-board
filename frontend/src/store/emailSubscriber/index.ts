import { createSlice } from '@reduxjs/toolkit'
import { EmailSubscribeControllerGetAllSubscriberResponse, EmailSubscriberControllerSearchEmailSubscribersApiResponse } from '@app/services/api/emailSubscriber/emailSubscriber'

export interface IEmailSubscriberStore {
    subscriberList: EmailSubscribeControllerGetAllSubscriberResponse
    searchSubscriberList: EmailSubscriberControllerSearchEmailSubscribersApiResponse
}

const initialState: IEmailSubscriberStore = {
    subscriberList: {} as EmailSubscribeControllerGetAllSubscriberResponse,
    searchSubscriberList: {} as EmailSubscriberControllerSearchEmailSubscribersApiResponse
}

const emailSubscriberSlice = createSlice({
    name: 'emailSubscriber',
    initialState,
    reducers: {
        setSearchSubscriberList: (state, action) => {
            state.searchSubscriberList = action.payload;
        },
        setSubscriberList: (state, action) => {
            state.subscriberList = action.payload;
        },
    },
})

export const emailSubscriberReducer = emailSubscriberSlice.reducer
export const { setSearchSubscriberList, setSubscriberList } = emailSubscriberSlice.actions;
