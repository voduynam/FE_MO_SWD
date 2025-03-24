import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboardSlice';
import productReducer from './features/productSlice';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    products: productReducer,
    auth: authReducer,
    users: userReducer,
  },
});

export default store; 