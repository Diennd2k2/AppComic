import {configureStore} from '@reduxjs/toolkit';
import {userReducer} from './reducers/userReducer';
import chapterReducer from './reducers/chapterReducer';

const store = configureStore({
  reducer: {
    userReducer,
    chapterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
