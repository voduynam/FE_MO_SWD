import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

const SettingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('Tiếng Việt');

  return (
    <View style={[styles.container, isDarkMode && styles.darkMode]}>
      <Text style={styles.title}>⚙️ Cấu Hình</Text>

      {/* Chọn Ngôn Ngữ */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>🌍 Ngôn Ngữ</Text>
        <TouchableOpacity onPress={() => setLanguage(language === 'Tiếng Việt' ? 'English' : 'Tiếng Việt')}>
          <Text style={styles.optionText}>{language} ⏬</Text>
        </TouchableOpacity>
      </View>

      {/* Chế Độ Tối */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>🌙 Chế Độ Tối</Text>
        <Switch value={isDarkMode} onValueChange={(value) => setIsDarkMode(value)} />
      </View>

      {/* Đăng Xuất */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>🚪 Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    justifyContent: 'center',
  },
  darkMode: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
  optionText: {
    fontSize: 16,
    color: 'blue',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
