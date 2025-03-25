import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://phamdangtuc-001-site1.ntempurl.com/api/users';

// Thunk to check and load token from AsyncStorage
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Checking auth state, token from AsyncStorage:', token);
      
      if (token) {
        // If token exists, set authenticated state
        return { token, isAuthenticated: true };
      }
      
      return { token: null, isAuthenticated: false };
    } catch (error) {
      console.error('Error checking auth state:', error);
      return { token: null, isAuthenticated: false };
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });
      console.log('Login response:', response.data);
      
      // Store token in AsyncStorage
      if (response.data) {
        await AsyncStorage.setItem('token', response.data);
        console.log('Token stored in AsyncStorage:', response.data);
      }
      
      return {
        token: response.data,
        isAuthenticated: true
      };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear token from AsyncStorage
      AsyncStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 