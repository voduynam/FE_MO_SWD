import { createSlice } from '@reduxjs/toolkit';

// Dữ liệu mẫu
const mockData = {
  day: {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    data: [5000, 6000, 5500, 7000, 8000, 7500, 1000],
  },
  week: {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    data: [30000, 35000, 32000, 40000],
  },
  month: {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
    data: [120000, 150000, 140000, 160000],
  },
  year: {
    labels: ['2021', '2022', '2023', '2024'],
    data: [1500000, 1700000, 1600000, 1800000],
  },
};

const initialState = {
  revenueData: mockData,
  selectedFilter: 'day',
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
  },
});

export const { setSelectedFilter } = dashboardSlice.actions;
export default dashboardSlice.reducer; 