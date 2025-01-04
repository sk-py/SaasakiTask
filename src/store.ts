import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import repoSlice from "./repoSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    repos: repoSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
