import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : null,
  paymentMethod: localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : 'Stripe',
  coupon: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id && JSON.stringify(x.variant) === JSON.stringify(item.variant));

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id && JSON.stringify(x.variant) === JSON.stringify(existItem.variant) ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const { id, variant } = action.payload;
      state.cartItems = state.cartItems.filter((x) => !(x._id === id && JSON.stringify(x.variant) === JSON.stringify(variant)));
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.coupon = null;
      localStorage.removeItem('cartItems');
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, applyCoupon } = cartSlice.actions;
export default cartSlice.reducer;
