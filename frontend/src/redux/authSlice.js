import { createSlice } from '@reduxjs/toolkit';

// No localStorage: user info is fetched from backend /me endpoint on app load
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // for login/signup
  isHydrating: true, // for /me fetch (start as true!)
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    hydrationStart: (state) => {
      state.isHydrating = true;
      state.error = null;
    },
    hydrationSuccess: (state, action) => {
      state.isHydrating = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    hydrationFailure: (state) => {
      state.isHydrating = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError,
  updateUser,
  hydrationStart,
  hydrationSuccess,
  hydrationFailure
} = authSlice.actions;

export default authSlice.reducer;
