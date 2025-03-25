import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { useEffect } from 'react';
import { checkAuthState } from './src/redux/features/authSlice';

export default function App() {
  useEffect(() => {
    // Check auth state when app starts
    store.dispatch(checkAuthState());
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <RootNavigator />
            <StatusBar style="auto" />
          </View>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo View chiếm toàn bộ màn hình
    backgroundColor: '#fff',
  },
});
