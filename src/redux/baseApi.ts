import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});

// fetchBaseQuery({
//     baseUrl: "https://tour-management-system-server-theta.vercel.app/api/v1",
//   }),