import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
  // tour type
  endpoints: (builder) => ({
    addTourType: builder.mutation({
      query: (tourTypeName) => ({
        url: "/tour/add-tour-type",
        method: "POST",
        data: tourTypeName,
      }),
      invalidatesTags: ["TOUR"],
    }),
    removeTourType: builder.mutation({
      query: (tourTypeId) => ({
        url: `/tour/tour-type/${tourTypeId}`,
        method: "DELETE",
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
    // tour
    addTour: builder.mutation({
      query: (tourData) => ({
        url: "/tour/add-tour",
        method: "POST",
        data: tourData,
      }),
      invalidatesTags: ["TOUR"],
    }),
  }),
});

export const {
  useAddTourTypeMutation,
  useRemoveTourTypeMutation,
  useGetTourTypesQuery,
  useAddTourMutation
} = tourApi;
