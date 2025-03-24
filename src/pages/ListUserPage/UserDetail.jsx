import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserDetail = ({ route }) => {
  const { user } = route.params;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return 'Admin';
      case 2:
        return 'Staff';
      case 3:
        return 'Member';
      default:
        return 'Unknown';
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={60} color="#007AFF" />
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user.fullName}</Text>
        <Text style={styles.userRole}>{getRoleName(user.roleId)}</Text>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem
          icon="person-outline"
          label="Tên đăng nhập"
          value={user.username}
        />
        <InfoItem
          icon="mail-outline"
          label="Email"
          value={user.email}
        />
        <InfoItem
          icon="call-outline"
          label="Số điện thoại"
          value={user.phone}
        />
        <InfoItem
          icon="location-outline"
          label="Địa chỉ"
          value={user.address}
        />
        <InfoItem
          icon="calendar-outline"
          label="Ngày sinh"
          value={formatDate(user.dateOfBirth)}
        />
        <InfoItem
          icon="male-outline"
          label="Giới tính"
          value={user.gender ? 'Nam' : 'Nữ'}
        />
        <InfoItem
          icon="time-outline"
          label="Trạng thái"
          value={user.isDeleted ? 'Đã xóa' : 'Đang hoạt động'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  infoContainer: {
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default UserDetail;
