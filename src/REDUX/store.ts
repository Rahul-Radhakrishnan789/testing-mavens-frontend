import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import notesReducer from "./reducers/noteSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
