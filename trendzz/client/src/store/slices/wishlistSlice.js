import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: localStorage.getItem('wishlistItems') ? JSON.parse(localStorage.getItem('wishlistItems')) : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const exists = state.wishlistItems.find((x) => x._id === item._id);
      if (exists) {
        state.wishlistItems = state.wishlistItems.filter((x) => x._id !== item._id);
      } else {
        state.wishlistItems = [...state.wishlistItems, item];
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    },
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload;
      localStorage.setItem('wishlistItems', JSON.stringify(action.payload));
    }
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
