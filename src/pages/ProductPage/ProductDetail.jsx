import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ProductDetail = () => {
  const route = useRoute();
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>
      <Text style={styles.info}>📦 Tên: {product.name}</Text>
      <Text style={styles.info}>💰 Giá: {product.price}</Text>
      <Text style={styles.info}>🆔 Mã sản phẩm: {product.id}</Text>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
