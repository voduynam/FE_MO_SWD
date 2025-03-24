import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductPage from '../pages/ProductPage/ProductPage';
import ProductDetail from '../pages/ProductPage/ProductDetail';

const Stack = createStackNavigator();

const ProductStack = () => {
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
        name="productList" 
        component={ProductPage} 
        options={{ 
          title: 'Danh Sách Sản Phẩm',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="productdetail" 
        component={ProductDetail} 
        options={{ 
          title: 'Chi Tiết Sản Phẩm',
          headerShown: true
        }} 
      />
    </Stack.Navigator>
  );
};

export default ProductStack;
