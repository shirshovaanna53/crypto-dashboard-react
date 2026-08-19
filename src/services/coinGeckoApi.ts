import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Coin, PriceHistory } from '../types/coin';

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.coingecko.com/api/v3/',
  }),
  endpoints: (builder) => ({
    getTopCoins: builder.query<Coin[], void>({
      query: () =>
        `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&x_cg_demo_api_key=${API_KEY}`,
    }),
    getCoinPriceHistory: builder.query<PriceHistory, string>({
      query: (coinId) =>
        `coins/${coinId}/market_chart?vs_currency=usd&days=7&x_cg_demo_api_key=${API_KEY}`,
    }),
  }),
});

export const { useGetTopCoinsQuery, useGetCoinPriceHistoryQuery } = coinGeckoApi;
