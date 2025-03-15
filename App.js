import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <TabNavigator />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo View chiếm toàn bộ màn hình
    backgroundColor: '#fff',
  },
});
