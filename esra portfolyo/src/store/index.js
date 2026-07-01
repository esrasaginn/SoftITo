import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './portfolioSlice';
import experienceReducer from './experienceSlice';

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    experience: experienceReducer,
  },
});

export default store;
