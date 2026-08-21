import { configureStore } from '@reduxjs/toolkit';
import { coinGeckoApi } from './services/coinGeckoApi';
import { chatApi } from './services/chatApi';

export const store = configureStore({
  reducer: {
    [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(coinGeckoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
