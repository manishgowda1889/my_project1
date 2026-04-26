import { apiSlice } from './apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: '/payment/razorpay/order',
        method: 'POST',
        body: data,
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: '/payment/razorpay/verify',
        method: 'POST',
        body: data,
      }),
    }),
    createStripePaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/payment/create-payment-intent',
        method: 'POST',
        body: data,
      }),
    }),
    confirmCOD: builder.mutation({
      query: (data) => ({
        url: '/payment/confirm-cod',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCreateStripePaymentIntentMutation,
  useConfirmCODMutation,
} = paymentApiSlice;
