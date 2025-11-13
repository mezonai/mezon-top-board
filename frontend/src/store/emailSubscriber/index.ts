import { createSlice } from '@reduxjs/toolkit'
import { EmailSubscribeControllerGetAllSubscribersApiResponse, EmailSubscribeControllerSearchSubscriberApiResponse } from '@app/services/api/emailSubscribe/emailSubscribe.types'

export interface IEmailSubscriberStore {
    subscriberList: EmailSubscribeControllerGetAllSubscribersApiResponse
    searchSubscriberList: EmailSubscribeControllerSearchSubscriberApiResponse
}

const initialState: IEmailSubscriberStore = {
    subscriberList: {} as EmailSubscribeControllerGetAllSubscribersApiResponse,
    searchSubscriberList: {} as EmailSubscribeControllerSearchSubscriberApiResponse
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
