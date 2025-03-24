import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../pages/Homepage/Dashboard';
import ProductStack from './ProductStack';
import ScreensStack from './StackNavigator';
// import SettingPage from '../pages/SettingPage/index';
import ProfilePage from '../pages/ProfilePage/ProfilePage';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard}
        options={{ 
          title: 'Trang Chủ',
          headerShown: true
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductStack}
        options={{ 
          title: 'Sản Phẩm',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={ScreensStack}
        options={{ 
          title: 'Người Dùng',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage}
        options={{ 
          title: 'Thông Tin Cá Nhân',
          headerShown: true
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
