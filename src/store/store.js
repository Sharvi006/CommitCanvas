import { configureStore } from '@reduxjs/toolkit';
import gitReducer from './gitSlice';
import challengeReducer from './challengeSlice';

export const store = configureStore({
  reducer: {
    git: gitReducer,
    challenge: challengeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['git.terminalLogs'],
      },
    }),
});

export default store;
