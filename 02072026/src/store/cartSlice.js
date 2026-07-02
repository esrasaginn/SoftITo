import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalAmount: 0
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, restaurantId } = action.payload;
      
      // Farklı bir restorandan sipariş verip vermediğimizi kontrol et
      if (state.cartItems.length > 0 && state.cartItems[0].restaurantId !== restaurantId) {
        // Aynı anda sadece tek bir restorandan sipariş verebileceğimiz için önce sepeti temizle!
        state.cartItems = [];
      }

      const existingItem = state.cartItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          id,
          name,
          price,
          restaurantId,
          quantity: 1,
          customizations: action.payload.customizations
        });
      }
      state.totalAmount = calculateTotal(state.cartItems);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        }
      }
      state.totalAmount = calculateTotal(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
