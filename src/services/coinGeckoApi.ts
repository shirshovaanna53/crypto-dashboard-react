import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Coin, PriceHistory } from '../types/coin';

const LAMBDA_BASE_URL = import.meta.env.VITE_LAMBDA_API_URL;

export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: fetchBaseQuery({ baseUrl: LAMBDA_BASE_URL }),
  endpoints: (builder) => ({
    getTopCoins: builder.query<Coin[], void>({
      query: () => '/coins',
    }),
    getCoinPriceHistory: builder.query<PriceHistory, string>({
      query: (coinId) => `/coins/${coinId}/history`,
    }),
  }),
});

export const { useGetTopCoinsQuery, useGetCoinPriceHistoryQuery } = coinGeckoApi;
