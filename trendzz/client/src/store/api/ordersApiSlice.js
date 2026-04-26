import { apiSlice } from '@/store/api/apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getMyOrders: builder.query({
      query: (params) => ({
        url: '/orders/my-orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
    createPaymentIntent: builder.mutation({
      query: (orderId) => ({
        url: '/payment/create-payment-intent',
        method: 'POST',
        body: { orderId },
      }),
    }),
    getAllOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useCancelOrderMutation,
  useCreatePaymentIntentMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApiSlice;
