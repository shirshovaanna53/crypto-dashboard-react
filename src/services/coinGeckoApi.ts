import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3/' }),
  endpoints: (builder) => ({
    getTopCoins: builder.query<Coin[], void>({
      query: () => 'coins/markets?vs_currency=aud&order=market_cap_desc&per_page=20&page=1',
    }),
  }),
});

export const { useGetTopCoinsQuery } = coinGeckoApi;
