import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ChatResponse {
  reply: string;
}

interface ChatRequest {
  message: string;
}

const LAMBDA_BASE_URL = import.meta.env.VITE_LAMBDA_API_URL;

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: LAMBDA_BASE_URL }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (body) => ({
        url: '/ai/chat',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;
