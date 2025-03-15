import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Card } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('day');
  
  // Dữ liệu doanh thu
  const revenueData = {
    day: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: [5000, 6000, 5500, 7000, 8000, 7500, 9000],
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

  // Dữ liệu lợi nhuận (giả định lợi nhuận là 25% doanh thu)
  const profitData = {
    day: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: revenueData.day.data.map(value => value * 0.25),
    },
    week: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      data: revenueData.week.data.map(value => value * 0.25),
    },
    month: {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
      data: revenueData.month.data.map(value => value * 0.25),
    },
    year: {
      labels: ['2021', '2022', '2023', '2024'],
      data: revenueData.year.data.map(value => value * 0.25),
    },
  };

  // Tính tổng doanh thu và lợi nhuận theo filter
  const totalRevenue = revenueData[selectedFilter].data.reduce((a, b) => a + b, 0);
  const totalProfit = profitData[selectedFilter].data.reduce((a, b) => a + b, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Báo Cáo Kinh Doanh</Text>
        <View style={styles.buttonContainer}>
          {['day', 'week', 'month', 'year'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.button, selectedFilter === item && styles.activeButton]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text style={[styles.buttonText, selectedFilter === item && styles.activeText]}>
                {item === 'day' ? 'NGÀY' : item === 'week' ? 'TUẦN' : item === 'month' ? 'THÁNG' : 'NĂM'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* KPI Cards - chỉ hiển thị doanh thu và lợi nhuận */}
      <View style={styles.kpiContainer}>
        <Card style={styles.kpiCardWide}>
          <Card.Content>
            <Text style={styles.kpiTitle}>Tổng Doanh Thu</Text>
            <Text style={styles.kpiValue}>{totalRevenue.toLocaleString()} VND</Text>
          </Card.Content>
        </Card>
        <Card style={styles.kpiCardWide}>
          <Card.Content>
            <Text style={styles.kpiTitle}>Tổng Lợi Nhuận</Text>
            <Text style={styles.kpiValue}>{totalProfit.toLocaleString()} VND</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Biểu đồ Doanh Thu */}
      <Card style={styles.chartCard}>
        <Card.Title title="Doanh Thu" />
        <Card.Content>
          <BarChart
            data={{
              labels: revenueData[selectedFilter].labels,
              datasets: [{ data: revenueData[selectedFilter].data }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="VND "
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Biểu đồ Lợi Nhuận */}
      <Card style={styles.chartCard}>
        <Card.Title title="Lợi Nhuận" />
        <Card.Content>
          <LineChart
            data={{
              labels: profitData[selectedFilter].labels,
              datasets: [{ data: profitData[selectedFilter].data }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="VND "
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#4BC0C0"
              }
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Biểu đồ So sánh Doanh thu và Lợi nhuận */}
      <Card style={styles.chartCard}>
        <Card.Title title="So sánh Doanh thu và Lợi nhuận" />
        <Card.Content>
          <BarChart
            data={{
              labels: revenueData[selectedFilter].labels,
              datasets: [
                { data: revenueData[selectedFilter].data, color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})` },
                { data: profitData[selectedFilter].data, color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})` }
              ],
              legend: ['Doanh thu', 'Lợi nhuận']
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="VND "
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            verticalLabelRotation={30}
            fromZero={true}
            showBarTops={false}
            style={styles.chart}
          />
        </Card.Content>
      </Card>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  kpiCardWide: {
    width: '48%',
    marginBottom: 10,
    elevation: 2,
  },
  kpiTitle: {
    fontSize: 14,
    color: '#666',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  chartCard: {
    margin: 10,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10,
  },
});