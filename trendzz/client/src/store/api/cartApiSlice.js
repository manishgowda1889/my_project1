import { apiSlice } from '@/store/api/apiSlice';

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCartApi: builder.mutation({
      query: (item) => ({
        url: '/cart/add',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartApi: builder.mutation({
      query: (data) => ({
        url: '/cart/update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCartApi: builder.mutation({
      query: (itemId) => ({
        url: `/cart/remove/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCartApi: builder.mutation({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    applyCouponApi: builder.mutation({
      query: (code) => ({
        url: '/cart/apply-coupon',
        method: 'POST',
        body: { code },
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartApiMutation,
  useUpdateCartApiMutation,
  useRemoveFromCartApiMutation,
  useClearCartApiMutation,
  useApplyCouponApiMutation,
} = cartApiSlice;
