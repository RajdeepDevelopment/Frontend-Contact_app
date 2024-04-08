import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../Redux_Thunk/ReduxThunk';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
