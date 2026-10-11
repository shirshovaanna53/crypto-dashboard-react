import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getUserId } from '../../utils/userId';
import type { AlertRule } from '../types/alerts';

const LAMBDA_BASE_URL = import.meta.env.VITE_LAMBDA_API_URL;

export const alertsApi = createApi({
  reducerPath: 'alertsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: LAMBDA_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('X-User-Id', getUserId());
      return headers;
    },
  }),
  // Tags let us refresh the list automatically after create/delete/restart (tomorrow)
  tagTypes: ['Alert'],
  endpoints: (builder) => ({
    getAlerts: builder.query<AlertRule[], void>({
      query: () => '/alerts',
      providesTags: ['Alert'],
    }),
  }),
});

export const { useGetAlertsQuery } = alertsApi;
