// src/screens/shared/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const ROLE_COLOR: Record<string, string> = {
  DOCTOR: '#2563EB',
  PATIENT: '#16a34a',
  ADMIN: '#7c3aed',
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.fullName?.[0] || '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: ROLE_COLOR[user?.role || 'PATIENT'] + '20' }]}>
          <Text style={[styles.roleText, { color: ROLE_COLOR[user?.role || 'PATIENT'] }]}>
            {user?.role}
          </Text>
        </View>
      </View>

      <View style={styles.menu}>
        {[
          { icon: 'person-outline', label: 'Edit Profile' },
          { icon: 'lock-closed-outline', label: 'Change Password' },
          { icon: 'notifications-outline', label: 'Notifications' },
          { icon: 'shield-checkmark-outline', label: 'Privacy & Security' },
          { icon: 'help-circle-outline', label: 'Help & Support' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={22} color="#2563EB" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>SoloDoc v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#fff', alignItems: 'center', padding: 28, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#2563EB' },
  name: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  email: { fontSize: 13, color: '#94a3b8', marginTop: 3 },
  roleBadge: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleText: { fontSize: 12, fontWeight: '700' },
  menu: { backgroundColor: '#fff', marginTop: 16, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f8fafc', gap: 14 },
  menuLabel: { flex: 1, fontSize: 15, color: '#1e293b' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, marginHorizontal: 16, backgroundColor: '#fef2f2', borderRadius: 12, padding: 16 },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
  version: { textAlign: 'center', color: '#cbd5e1', fontSize: 12, marginTop: 16 },
});
