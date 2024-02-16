import { createSelector, createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../actions/apiActions";
import { store } from "../store";
import { update_profile } from "@/utils/api";

// Initial state
const userProfileInitialState = {
  data: null,
  loading: false,
};
// Slice
export const userProfileSlice = createSlice({
  name: "UserProfile",
  initialState: userProfileInitialState, 
  reducers: {
    profileRequested: (userprofile, action) => {
      userprofile.loading = true;
    },
    profileSuccess: (userprofile, action) => {
      userprofile.data = action.payload.data;
      userprofile.loading = false;
    },
    profileFailure: (userprofile, action) => {
      userprofile.loading = false;
    },
  }
})

export const { profileRequested, profileSuccess, profileFailure } = userProfileSlice.actions;
export default userProfileSlice.reducer;

// API call function
export const loadUserProfile = (userid, name, email, mobile, type, address, firebase_id, logintype, profile, latitude, longitude, about_me, facebook_id, twiiter_id, instagram_id, pintrest_id, fcm_id,notification, onSuccess, onError) => {
  store.dispatch(apiCallBegan({
    ...update_profile(userid, name, email, mobile, type, address, firebase_id, logintype, profile, latitude, longitude, about_me, facebook_id, twiiter_id, instagram_id, pintrest_id, fcm_id, notification), // Replace with your API function
    onStartDispatch: profileRequested.type,
    onSuccessDispatch: profileSuccess.type,
    onErrorDispatch: profileFailure.type,
    onSuccess,
    onError,
  }));
};

// Slecttors

export const profileData = createSelector(
  state => state.UserProfile, 
  UserProfile => UserProfile
)
