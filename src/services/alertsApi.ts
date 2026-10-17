import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getUserId } from '../../utils/userId';
import type { AlertRule, CreateAlertInput, FeedItem } from '../types/alerts';

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

  tagTypes: ['Alert', 'Feed'],
  endpoints: (builder) => ({
    getAlerts: builder.query<AlertRule[], void>({
      query: () => '/alerts',
      providesTags: ['Alert'],
    }),
    createAlert: builder.mutation<AlertRule, CreateAlertInput>({
      query: (body) => ({ url: '/alerts', method: 'POST', body }),
      invalidatesTags: ['Alert'],
    }),

    deleteAlert: builder.mutation<void, string>({
      query: (id) => ({ url: `/alerts/${id}`, method: 'DELETE' }),
      // Also refresh on error: a 404 means our list was stale
      invalidatesTags: () => ['Alert'],
    }),

    restartAlert: builder.mutation<AlertRule, string>({
      query: (id) => ({ url: `/alerts/${id}/restart`, method: 'POST' }),
      // Also refresh on error: a 409 means the rule is no longer "triggered"
      invalidatesTags: () => ['Alert'],
    }),
    getFeed: builder.query<FeedItem[], void>({
      query: () => '/alerts/feed',
      providesTags: ['Feed'],
    }),

    checkAlerts: builder.mutation<
      { checked: boolean; rules?: number; coins?: number; triggered?: number },
      void
    >({
      query: () => ({ url: '/alerts/check', method: 'POST' }),
      // Refresh lists only if something actually triggered
      invalidatesTags: (result) => (result?.checked && result.triggered ? ['Alert', 'Feed'] : []),
    }),
  }),
});

export const {
  useGetAlertsQuery,
  useCreateAlertMutation,
  useDeleteAlertMutation,
  useRestartAlertMutation,
  useGetFeedQuery,
  useCheckAlertsMutation,
} = alertsApi;
