import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import settingsReducer from "./reducer/settingsSlice";
import authReducer from "./reducer/authSlice";
import languageSlice from "./reducer/languageSlice";
import api from "./middleware/api";
import storage from "redux-persist/lib/storage";
import momentSlice from "./reducer/momentSlice";

const persistConfig = {
    key: "root",
    storage,
};
const rootReducer = combineReducers({
    Settings: settingsReducer,
    User_signup: authReducer,
    Language: languageSlice,
    cachedata: momentSlice,
});

export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: [api],
});

export const persistor = persistStore(store);
