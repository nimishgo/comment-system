import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import commentsReducer from "./commentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
