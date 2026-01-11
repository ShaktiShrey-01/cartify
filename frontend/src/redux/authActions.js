// src/redux/authActions.js
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, logout, hydrationStart, hydrationSuccess, hydrationFailure } from './authSlice';
import { API_BASE, unwrapApiResponse } from '../utils/api';

// Fetch user from backend (e.g., /me endpoint)
export const fetchCurrentUser = () => async (dispatch) => {
  console.log('[fetchCurrentUser] hydrationStart');
  dispatch(hydrationStart());
  try {
    const response = await axios.get(`${API_BASE}/api/v1/users/me`, { withCredentials: true });
    const user = unwrapApiResponse(response.data);
    console.log('[fetchCurrentUser] /me response:', user);
    dispatch(hydrationSuccess(user));
    console.log('[fetchCurrentUser] hydrationSuccess dispatched');
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      console.log('[fetchCurrentUser] hydrationFailure dispatched');
      dispatch(hydrationFailure());
    } else {
      console.log('[fetchCurrentUser] loginFailure dispatched:', error.response?.data?.message || error.message);
      dispatch(loginFailure(error.response?.data?.message || error.message));
    }
  }
};

// Logout user (calls backend to clear cookie)
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(`${API_BASE}/api/v1/users/logout`, {}, { withCredentials: true });
  } catch (error) {
    // Ignore error, just clear state
  }
  dispatch(logout());
};
