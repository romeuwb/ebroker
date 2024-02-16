import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { store } from "../store";
import { apiCallBegan } from "../actions/apiActions";
import { getSliderApi, getCategorieApi } from "@/utils/api";

let initialState = {
    loading: false,
    lastFetch: null,
    slider: [],
    categories: [],
    newUserChatData: null,
    filterData: []
};

const momentSlice = createSlice({
    name: "cachedata",
    initialState,
    reducers: {
        sliderRequested: (state, action) => {
            state.loading = true;
        },
        sliderSuccess: (state, action) => {
            state.loading = false;
            state.slider = action.payload.data;
            state.lastFetch = Date.now();
        },
        sliderFailed: (state, action) => {
            state.loading = false;
        },
        categoriesRequested: (state, action) => {
            state.loading = true;
        },
        categoriesSuccess: (state, action) => {
            state.loading = false;
            state.categories = action.payload.data;
            state.lastFetch = Date.now();
        },
        categoriesFailed: (state, action) => {
            state.loading = false;
        },
        newUserChatData: (state, action) => {
            state.loading = false;
            state.newUserChatData = action.payload.data;
        },
        newUserRemoveChat: (state) => {
            state.newUserChatData = null;
            // return state;
        },
        filterData: (state, action) => {
            state.loading = false;
            state.filterData = action.payload.data;
        },
    },
});

export const { sliderRequested, sliderSuccess, sliderFailed, categoriesRequested, categoriesSuccess, categoriesFailed, newUserChatData, newUserRemoveChat, filterData } = momentSlice.actions;
export default momentSlice.reducer;

// API Calls
export const loadSlider = (onSuccess, onError, onStart) => {
    const { lastFetch } = store.getState().cachedata;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    // If API data is fetched within last 10 minutes then don't call the API again
    if (diffInMinutes < 10) return false;
    store.dispatch(
        apiCallBegan({
            ...getSliderApi(),
            displayToast: false,
            onStartDispatch: sliderRequested.type,
            onSuccessDispatch: sliderSuccess.type,
            onErrorDispatch: sliderFailed.type,
            onStart,
            onSuccess,
            onError,
        })
    );
};
export const loadCategories = (onSuccess, onError, onStart) => {
    const { lastFetch } = store.getState().cachedata;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    // If API data is fetched within last 10 minutes then don't call the API again
    if (diffInMinutes < 10) return false;
    store.dispatch(
        apiCallBegan({
            ...getCategorieApi(),
            displayToast: false,
            onStartDispatch: categoriesRequested.type,
            onSuccessDispatch: categoriesSuccess.type,
            onErrorDispatch: categoriesFailed.type,
            onStart,
            onSuccess,
            onError,
        })
    );
};

//  store new user chat data 
export const getChatData = (data) => {
    store.dispatch(newUserChatData({ data }))
}
export const getfilterData = (data) => {
    store.dispatch(filterData({ data }))
}
export const removeChat = (remove) => {
    store.dispatch(newUserRemoveChat({ remove }));
};

// Selector Functions
export const silderCacheData = createSelector(
    (state) => state.cachedata,
    (cachedata) => cachedata.slider
);
export const categoriesCacheData = createSelector(
    (state) => state.cachedata,
    (cachedata) => cachedata.categories
);
export const newchatData = createSelector(
    (state) => state.cachedata,
    (cachedata) => cachedata.newUserChatData
);
export const filterDataaa = createSelector(
    (state) => state.cachedata,
    (cachedata) => cachedata.filterData
);
