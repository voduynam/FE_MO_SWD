import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, ActivityIndicator, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchRevenue, setSelectedDate, setFilterType, clearError } from '../../redux/features/revenueSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error, selectedDateTimestamp, filterType } = useSelector((state) => state.revenue);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Convert timestamp to Date object for DateTimePicker
  const selectedDate = new Date(selectedDateTimestamp);

  useEffect(() => {
    fetchRevenueData();
  }, [selectedDateTimestamp, filterType]);

  const isDateInFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (filterType === 'year') {
      return date.getFullYear() > today.getFullYear();
    } else if (filterType === 'month') {
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const selectedYear = date.getFullYear();
      const selectedMonth = date.getMonth();
      
      return selectedYear > todayYear || 
        (selectedYear === todayYear && selectedMonth > todayMonth);
    } else {
      return date > today;
    }
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      if (isDateInFuture(new Date(date))) {
        Alert.alert(
          'Lỗi',
          filterType === 'year' 
            ? 'Không thể chọn năm trong tương lai'
            : filterType === 'month'
            ? 'Không thể chọn tháng trong tương lai'
            : 'Không thể chọn ngày trong tương lai',
          [{ text: 'OK' }]
        );
        return;
      }
      dispatch(setSelectedDate(date.getTime()));
    }
  };

  const handleFilterTypeChange = (type) => {
    dispatch(setFilterType(type));
    setShowDatePicker(false);
  };

  const fetchRevenueData = async () => {
    try {
      const date = new Date(selectedDateTimestamp);
      
      // Validate date before fetching
      if (isDateInFuture(new Date(date))) {
        Alert.alert(
          'Lỗi',
          filterType === 'year'
            ? 'Không thể xem doanh thu của năm trong tương lai'
            : filterType === 'month'
            ? 'Không thể xem doanh thu của tháng trong tương lai'
            : 'Không thể xem doanh thu của ngày trong tương lai',
          [{ text: 'OK' }]
        );
        return;
      }

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const params = {
        year: year
      };

      if (filterType === 'month' || filterType === 'day') {
        params.month = month;
      }

      if (filterType === 'day') {
        params.day = day;
      }

      console.log('Fetching revenue with params:', params);
      await dispatch(fetchRevenue(params)).unwrap();
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching revenue:', err);
      let errorMessage = err;
      
      if (typeof err === 'string' && err.includes('{')) {
        try {
          const errorObj = JSON.parse(err.substring(err.indexOf('{')));
          errorMessage = errorObj.message || err;
        } catch (e) {
          // Keep original error message if parsing fails
        }
      }

      if (errorMessage.includes('Future dates')) {
        Alert.alert(
          'Lỗi',
          filterType === 'year'
            ? 'Không thể xem doanh thu của năm trong tương lai'
            : filterType === 'month'
            ? 'Không thể xem doanh thu của tháng trong tương lai'
            : 'Không thể xem doanh thu của ngày trong tương lai',
          [{ text: 'OK' }]
        );
      } else if (errorMessage.includes('đăng nhập') || errorMessage.includes('token')) {
        Alert.alert(
          'Lỗi xác thực',
          errorMessage,
          [
            {
              text: 'Đăng nhập lại',
              onPress: () => navigation.navigate('Auth', { screen: 'Login' })
            }
          ]
        );
      } else if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        Alert.alert(
          'Lỗi tải dữ liệu',
          'Đang thử lại...',
          [{ text: 'OK' }]
        );
        setTimeout(fetchRevenueData, 2000);
      } else {
        Alert.alert(
          'Lỗi',
          'Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn loại thống kê</Text>
          
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'day' && styles.activeFilterButton]}
            onPress={() => handleFilterTypeChange('day')}
          >
            <Text style={[styles.filterButtonText, filterType === 'day' && styles.activeFilterText]}>
              Theo ngày
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filterType === 'month' && styles.activeFilterButton]}
            onPress={() => handleFilterTypeChange('month')}
          >
            <Text style={[styles.filterButtonText, filterType === 'month' && styles.activeFilterText]}>
              Theo tháng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filterType === 'year' && styles.activeFilterButton]}
            onPress={() => handleFilterTypeChange('year')}
          >
            <Text style={[styles.filterButtonText, filterType === 'year' && styles.activeFilterText]}>
              Theo năm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>
              {filterType === 'day' 
                ? `Chọn ngày (${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()})`
                : filterType === 'month'
                ? `Chọn tháng (${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()})`
                : `Chọn năm (${selectedDate.getFullYear()})`}
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && showDatePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={selectedDate}
                mode={filterType === 'year' ? 'date' : filterType === 'month' ? 'date' : 'date'}
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            </View>
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Đóng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => {
                setFilterModalVisible(false);
                fetchRevenueData();
              }}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            dispatch(clearError());
            fetchRevenueData();
          }}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Báo Cáo Kinh Doanh</Text>
        <TouchableOpacity
          style={styles.filterMainButton}
          onPress={() => {
            dispatch(clearError());
            setFilterModalVisible(true);
          }}
        >
          <Text style={styles.filterMainButtonText}>
            {filterType === 'day' 
              ? `Ngày ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
              : filterType === 'month'
              ? `Tháng ${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
              : `Năm ${selectedDate.getFullYear()}`}
          </Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode={filterType === 'year' ? 'date' : filterType === 'month' ? 'date' : 'date'}
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {Platform.OS === 'ios' && showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={selectedDate}
            mode={filterType === 'year' ? 'date' : filterType === 'month' ? 'date' : 'date'}
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        </View>
      )}

      {renderFilterModal()}

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        <Card style={styles.kpiCard}>
          <Card.Content>
            <Text style={styles.kpiTitle}>
              {filterType === 'day' 
                ? `Doanh Thu Ngày ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
                : filterType === 'month'
                ? `Doanh Thu Tháng ${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
                : `Doanh Thu Năm ${selectedDate.getFullYear()}`
              }
            </Text>
            <Text style={styles.kpiValue}>
              {data.revenue ? data.revenue.toLocaleString() : '0'} VND
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.kpiCard}>
          <Card.Content>
            <Text style={styles.kpiTitle}>
              {filterType === 'day' 
                ? `Lợi Nhuận Ngày ${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
                : filterType === 'month'
                ? `Lợi Nhuận Tháng ${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
                : `Lợi Nhuận Năm ${selectedDate.getFullYear()}`
              }
            </Text>
            <Text style={styles.kpiValue}>
              {data.revenue ? (
                // Tính lợi nhuận: Doanh thu - Chi phí
                // Chi phí bao gồm:
                // 1. Giá vốn hàng bán (60% doanh thu)
                // 2. Chi phí vận hành (15% doanh thu)
                // 3. Chi phí marketing (5% doanh thu)
                // Lợi nhuận = Doanh thu - (60% + 15% + 5%) = 20% doanh thu
                (data.revenue * 0.2).toLocaleString()
              ) : '0'} VND
            </Text>
            <Text style={styles.kpiSubtitle}>
              {data.revenue ? `(Tỷ suất lợi nhuận: 20%)` : ''}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Info text */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {filterType === 'day' 
            ? '* Thống kê doanh thu và lợi nhuận trong ngày'
            : filterType === 'month'
            ? '* Thống kê doanh thu và lợi nhuận trong tháng'
            : '* Thống kê doanh thu và lợi nhuận trong năm'
          }
        </Text>
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
  kpiContainer: {
    padding: 10,
  },
  kpiCard: {
    marginBottom: 10,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  kpiTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  kpiSubtitle: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  infoContainer: {
    padding: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterButton: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  activeFilterText: {
    color: 'white',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    width: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterMainButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  filterMainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  datePickerButton: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#E8F2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  datePickerButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  datePickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});