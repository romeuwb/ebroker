import { createSelector, createSlice, createAction } from "@reduxjs/toolkit";
import { user_signupApi } from "@/utils/api";
import { apiCallBegan } from "../actions/apiActions";
import { store } from "../store";
// initial state

const initialState = {
    data: null,
    loading: false,
};

// slice
export const authSlice = createSlice({
    name: "User_signup",
    initialState,
    reducers: {
        signupRequested: (user_signup, action) => {
            user_signup.loading = true;
        },
        signupSucess: (user_signup, action) => {
            user_signup.data = action.payload;

            user_signup.loading = true;
        },
        signupFailure: (user_signup, action) => {
            user_signup.loading = false;
        },
        updateDataSuccess: (user_signup, action) => {
            user_signup.data = action.payload;
        },
        userUpdateData: (user_signup, action) => {
            user_signup.data.data = action.payload.data;
        },
        userLogout: (user_signup) => {
            user_signup = initialState;
            return user_signup;
        },
    },
});
export const { signupRequested, signupSucess, signupFailure, updateDataSuccess, userUpdateData, userLogout } = authSlice.actions;
export default authSlice.reducer;

//  API CALLS
export const signupLoaded = (name, email, mobile, type, address, firebase_id, logintype, profile, fcm_id, onSuccess, onError, onStart) => {
    store.dispatch(
        apiCallBegan({
            ...user_signupApi(name, email, mobile, type, address, firebase_id, logintype, profile, fcm_id),
            displayToast: false,
            onStartDispatch: signupRequested.type,
            onSuccessDispatch: signupSucess.type,
            onErrorDispatch: signupFailure.type,
            onStart,
            onSuccess,
            onError,
        })
    );
};

export const loadUpdateData = (data) => {
    store.dispatch(updateDataSuccess({ data }));
};
export const loadUpdateUserData = (data) => {
    store.dispatch(userUpdateData({ data }));
};
export const logoutSuccess = (logout) => {
    store.dispatch(userLogout({ logout }));
};

// Slecttors

export const userSignUpData = createSelector(
    (state) => state.User_signup,
    (User_signup) => User_signup
);
