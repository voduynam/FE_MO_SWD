import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://phamdangtuc-001-site1.ntempurl.com/api/Product';

// Async thunk để fetch danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      const response = await axios.get(API_URL);
      
      // Kiểm tra response có đúng format không
      if (response.data && response.data.data && response.data.data.$values) {
        return response.data.data.$values;
      }
      
      return [];
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.products = [];
      });
  },
});

export default productSlice.reducer; 