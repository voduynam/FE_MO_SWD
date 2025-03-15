import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductPage from '../pages/ProductPage/ProductPage';
import ProductDetail from '../pages/ProductPage/ProductDetail';

const Stack = createStackNavigator();

const ProductStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="productList" component={ProductPage} options={{ title: 'Danh Sách Sản Phẩm' }} />
      <Stack.Screen name="productdetail" component={ProductDetail} options={{ title: 'Chi Tiết Sản Phẩm' }} />
    </Stack.Navigator>
  );
};

export default ProductStack;
