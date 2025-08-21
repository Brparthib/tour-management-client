import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { ITourPackage } from "@/types/tour.type";

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
      query: (params) => ({
        url: "/tour/tour-type",
        method: "GET",
        params,
      }),
      providesTags: ["TOUR"],
      transformResponse: (response) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
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
    getAllTours: builder.query<ITourPackage[], unknown>({
      query: (params) => ({
        url: "/tour",
        method: "GET",
        params,
      }),
      providesTags: ["TOUR"],
      transformResponse: (response: IResponse<ITourPackage[]>) => response.data,
    }),
  }),
});

export const {
  useAddTourTypeMutation,
  useRemoveTourTypeMutation,
  useGetTourTypesQuery,
  useAddTourMutation,
  useGetAllToursQuery,
} = tourApi;
