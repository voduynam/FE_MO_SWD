import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListUserPage from '../pages/ListUserPage/ListUserPage';
import UserDetail from '../pages/ListUserPage/UserDetail';

const Stack = createStackNavigator();

const ScreensStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="listUser" 
        component={ListUserPage} 
        options={{ 
          title: 'Danh Sách Người Dùng',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="userdetail" 
        component={UserDetail} 
        options={{ 
          title: 'Chi Tiết Người Dùng',
          headerShown: true
        }} 
      />
    </Stack.Navigator>
  );
};

export default ScreensStack;
