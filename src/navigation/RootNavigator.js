import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import LoginPage from '../pages/LoginPage/LoginPage';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        header: () => null
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginPage} />
      ) : (
        <Stack.Screen name="MainApp" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator; 