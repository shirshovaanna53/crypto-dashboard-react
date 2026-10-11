import { configureStore } from '@reduxjs/toolkit';
import { coinGeckoApi } from './services/coinGeckoApi';
import { chatApi } from './services/chatApi';
import { alertsApi } from './services/alertsApi';

export const store = configureStore({
  reducer: {
    [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [alertsApi.reducerPath]: alertsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      coinGeckoApi.middleware,
      chatApi.middleware,
      alertsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
