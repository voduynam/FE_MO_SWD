import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Homepage from '../pages/Homepage/Dashboard';
import ListUserPage from '../pages/ListUserPage/ListUserPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import SettingPage from '../pages/SettingPage';
import { StyleSheet } from 'react-native';
import ScreensStack from './StackNavigator';
import ProductStack from './ProductStack';
import Dashboard from '../pages/Homepage/Dashboard';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Xác định icon từng item
            if (route.name === 'Dashboard') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'screensstack') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'products') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {/* Định nghĩa rõ ràng từng item, không bị trùng */}
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="screensstack" component={ScreensStack} />
        <Tab.Screen name="products" component={ProductStack} />
        <Tab.Screen name="Settings" component={SettingPage} />
      
        
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;
