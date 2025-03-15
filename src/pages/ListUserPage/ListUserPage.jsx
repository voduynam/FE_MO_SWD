import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const users = [
  { id: '1', name: 'Nguyễn Văn A', email: 'a@example.com' },
  { id: '2', name: 'Trần Thị B', email: 'b@example.com' },
  { id: '3', name: 'Lê Văn C', email: 'c@example.com' },
];

const ListUserPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Sách Người Dùng</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate('userdetail', { user: item })}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.detailButton}>
              <Text style={styles.buttonText}>Chi tiết</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ListUserPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  detailButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
