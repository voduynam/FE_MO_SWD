import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListUserPage from '../pages/ListUserPage/ListUserPage';
import UserDetail from '../pages/ListUserPage/UserDetail';

const Stack = createStackNavigator();

const ScreensStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="listUser" component={ListUserPage} options={{ title: 'Danh sách sản phẩm' }} />
      <Stack.Screen name="userdetail" component={UserDetail} options={{ title: 'Chi tiết sản phẩm' }} />
      
    </Stack.Navigator>
  );
};

export default ScreensStack;
