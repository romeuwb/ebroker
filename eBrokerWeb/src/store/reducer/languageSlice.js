// languageSlice.js

import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";
import { apiCallBegan } from "../actions/apiActions";
import { getLanguages } from "@/utils/api";

const initialState = {
  languages: {},
  loading: false,
  selectedLanguage: null,
};

export const languageSlice = createSlice({
  name: "Language",
  initialState,
  reducers: {
    languagesRequested: (language, action) => {
      language.loading = true;
    },
    languagesSuccess: (language, action) => {
      language.languages = action.payload.data;
      language.loading = false;
    },
    languagesFailure: (language, action) => {
      language.loading = false;
    },
    setLanguage: (language, action) => {
      language.selectedLanguage = action.payload;
    },
  },
});

export const {
  languagesRequested,
  languagesSuccess,
  languagesFailure,
  setLanguage,
} = languageSlice.actions;
export default languageSlice.reducer;

// API CALLS

export const languageLoaded = (
  language_code,
  web_language_file,
  onSuccess,
  onError,
  onStart
) => {
  store.dispatch(
    apiCallBegan({
      ...getLanguages(language_code, web_language_file),
      displayToast: false,
      onStartDispatch: languagesRequested.type,
      onSuccessDispatch: languagesSuccess.type,
      onErrorDispatch: languagesFailure.type,
      onStart,
      onSuccess,
      onError,
    })
  );
};

// Selectors

export const languageData = createSelector(
  (state) => state.Language,
  (Language) => Language.languages
);
