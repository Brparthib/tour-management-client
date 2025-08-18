import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation({
      query: (tourTypeName) => ({
        url: "/tour/add-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
      invalidatesTags: ["TOUR"],
    }),
    getTourTypes: builder.query({
      query: () => ({
        url: "/tour/tour-type",
        method: "GET",
      }),
      providesTags: ["TOUR"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useAddTourTypeMutation, useGetTourTypesQuery } = tourApi;
