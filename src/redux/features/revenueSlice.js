import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchRevenue = createAsyncThunk(
  'revenue/fetchRevenue',
  async ({ day, month, year }, { rejectWithValue }) => {
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại!');
        }

        // First fetch total revenue
        let url = 'https://phamdangtuc-001-site1.ntempurl.com/api/Orders/revenue';
        const params = [];
        if (day) params.push(`day=${day}`);
        if (month) params.push(`month=${month}`);
        if (year) params.push(`year=${year}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        console.log('Fetching total revenue with URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          if (response.status === 401) {
            throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
          }
          throw new Error(`Lỗi ${response.status}: ${errorData || 'Không thể lấy dữ liệu doanh thu'}`);
        }

        const totalData = await response.json();
        console.log('Total revenue data:', totalData);

        let result = {
          ...totalData,
          details: null
        };

        // Then fetch detailed data if needed
        if (!day) { // Only fetch details for month and year views
          try {
            // Construct detail URL based on filter type
            let detailUrl = 'https://phamdangtuc-001-site1.ntempurl.com/api/Orders/revenue';
            
            if (month) {
              // For monthly view, get weekly data
              detailUrl += `/weekly?year=${year}&month=${month}`;
            } else {
              // For yearly view, get monthly data
              detailUrl += `/monthly?year=${year}`;
            }

            console.log('Fetching details with URL:', detailUrl);
            
            const detailResponse = await fetch(detailUrl, {
              method: 'GET',
              headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`
              }
            });

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              console.log('Detail data received:', detailData);

              // Transform data into the correct format
              if (month) {
                // Weekly data should be an array of 4-5 weeks
                result.details = Array.from({ length: 4 }, (_, weekIndex) => {
                  const weekData = detailData.find(d => d.weekOfMonth === weekIndex + 1);
                  return {
                    weekOfMonth: weekIndex + 1,
                    revenue: weekData ? weekData.revenue : 0
                  };
                });
              } else {
                // Monthly data should be an array of 12 months
                result.details = Array.from({ length: 12 }, (_, monthIndex) => {
                  const monthData = detailData.find(d => d.month === monthIndex + 1);
                  return {
                    month: monthIndex + 1,
                    revenue: monthData ? monthData.revenue : 0
                  };
                });
              }
            } else {
              console.log('Failed to fetch detail data:', await detailResponse.text());
              // If detail fetch fails, create default data structure
              result.details = month
                ? Array.from({ length: 4 }, (_, i) => ({ weekOfMonth: i + 1, revenue: 0 }))
                : Array.from({ length: 12 }, (_, i) => ({ month: i + 1, revenue: 0 }));
            }
          } catch (detailError) {
            console.error('Error fetching details:', detailError);
            // Create default data structure on error
            result.details = month
              ? Array.from({ length: 4 }, (_, i) => ({ weekOfMonth: i + 1, revenue: 0 }))
              : Array.from({ length: 12 }, (_, i) => ({ month: i + 1, revenue: 0 }));
          }
        }

        return result;
      } catch (error) {
        console.error(`Attempt ${retries + 1} failed:`, error);
        
        if (error.message.includes('token') || error.message.includes('đăng nhập')) {
          return rejectWithValue(error.message);
        }
        
        if (retries === MAX_RETRIES - 1) {
          return rejectWithValue(error.message);
        }
        
        retries++;
        await delay(RETRY_DELAY * retries);
      }
    }
  }
);

const initialState = {
  data: {
    id: null,
    revenue: 0,
    details: null
  },
  loading: false,
  error: null,
  selectedDateTimestamp: new Date().getTime(), // Store as timestamp instead of Date object
  filterType: 'year', // 'day', 'month', 'year'
  lastUpdated: null
};

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      // Convert Date to timestamp before storing
      state.selectedDateTimestamp = action.payload instanceof Date 
        ? action.payload.getTime() 
        : action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Có lỗi xảy ra khi lấy dữ liệu doanh thu';
      });
  }
});

export const { setSelectedDate, setFilterType, clearError } = revenueSlice.actions;
export default revenueSlice.reducer; 