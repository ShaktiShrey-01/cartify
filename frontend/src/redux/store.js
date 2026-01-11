import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

// Safely load cart items from localStorage
function loadCartItems() {
  try {
    const raw = localStorage.getItem('cartItems');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Create store with preloaded cart state
const preloadedState = {
  cart: {
    items: loadCartItems(),
  },
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState,
});

// Persist cart items to localStorage on any state change
store.subscribe(() => {
  try {
    const { items } = store.getState().cart;
    localStorage.setItem('cartItems', JSON.stringify(items));
  } catch {
    // ignore write errors
  }
});

export default store;
