import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/features/productSlice';

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    console.log('ProductPage mounted, fetching products...');
    dispatch(fetchProducts());
  }, [dispatch]);

  // Log raw products data
  console.log('Raw products from Redux:', products);

  // Đảm bảo products luôn là array
  const safeProducts = Array.isArray(products) ? products : [];
  console.log('Safe products array:', safeProducts);

  if (loading) {
    console.log('Loading products...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    console.error('Error in ProductPage:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Có lỗi xảy ra: {error}</Text>
      </View>
    );
  }

  const renderProduct = ({ item }) => {
    if (!item) {
      console.error('Attempting to render undefined/null item');
      return null;
    }

    console.log('Rendering product:', item);
    return (
      <Card style={styles.productCard}>
        <Card.Cover 
          source={{ uri: item.image }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <Card.Content>
          <Title>{item.productName || 'Không có tên'}</Title>
          <Paragraph>Giá: {(item.price || 0).toLocaleString()} VND</Paragraph>
          <Paragraph>Số lượng: {item.stockInStorage || 0}</Paragraph>
          <Paragraph>Mô tả: {item.description || 'Không có mô tả'}</Paragraph>
          <Paragraph>Mã sản phẩm: {item.productId || 'N/A'}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const keyExtractor = (item) => {
    if (!item) return Math.random().toString();
    return (item.productId || Math.random()).toString();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={safeProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  productList: {
    padding: 10,
  },
  productCard: {
    marginBottom: 15,
    elevation: 2,
  },
  productImage: {
    height: 200,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 