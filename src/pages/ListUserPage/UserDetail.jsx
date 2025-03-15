import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const UserDetail = () => {
  const route = useRoute();
  const user = route.params?.user;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy thông tin người dùng!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông Tin Người Dùng</Text>
      <Text style={styles.info}>📛 Tên: {user.name}</Text>
      <Text style={styles.info}>📧 Email: {user.email}</Text>
      <Text style={styles.info}>🆔 ID: {user.id}</Text>
    </View>
  );
};

export default UserDetail;

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
