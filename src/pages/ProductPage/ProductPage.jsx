import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/features/productSlice';
import { Ionicons } from '@expo/vector-icons';

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('ProductPage mounted, fetching products...');
    dispatch(fetchProducts());
  }, [dispatch]);

  // Log raw products data
  console.log('Raw products from Redux:', products);

  // Đảm bảo products luôn là array
  const safeProducts = Array.isArray(products) ? products : [];
  console.log('Safe products array:', safeProducts);

  // Lọc sản phẩm theo tên
  const filteredProducts = safeProducts.filter(product => 
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Paragraph>Loại sản phẩm: {item.isDeleted ?  "❌Ngừng hoạt động" : " ✅Đang hoạt động"} </Paragraph>
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
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.productCount}>
          <Text style={styles.productCountText}>
            Tổng số sản phẩm: {filteredProducts.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  productCount: {
    backgroundColor: '#e8f4ff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  productCountText: {
    color: '#00cc00',
    fontSize: 14,
    fontWeight: '500',
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

export default ProductPage; 