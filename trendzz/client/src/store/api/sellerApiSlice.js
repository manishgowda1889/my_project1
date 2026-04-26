import { apiSlice } from '@/store/api/apiSlice';

export const sellerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerDashboard: builder.query({
      query: () => '/seller/dashboard',
    }),
    getSellerProducts: builder.query({
      query: () => '/seller/products',
      providesTags: ['Product'],
    }),
    getSellerOrders: builder.query({
      query: () => '/seller/orders',
      providesTags: ['Order'],
    }),
    getSellerAnalytics: builder.query({
      query: () => '/seller/analytics',
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetSellerDashboardQuery,
  useGetSellerProductsQuery,
  useGetSellerOrdersQuery,
  useGetSellerAnalyticsQuery,
  useDeleteProductMutation,
} = sellerApiSlice;
