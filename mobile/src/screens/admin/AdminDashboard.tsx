// src/screens/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await client.get('/admin/stats');
      setStats(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const statCards = stats ? [
    { label: 'Tenants', value: stats.totalTenants, icon: 'business', color: '#2563EB' },
    { label: 'Doctors', value: stats.pendingVerifications, icon: 'medical', color: '#f59e0b' },
    { label: 'Active Subs', value: stats.activeSubscriptions, icon: 'checkmark-circle', color: '#16a34a' },
  ] : [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Panel</Text>
          <Text style={styles.sub}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {statCards.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon as any} size={28} color={s.color} />
            <Text style={[styles.statNum, { color: s.color }]}>{s.value ?? '—'}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={22} color="#2563EB" />
        <Text style={styles.infoText}>
          Full admin features are available on the web dashboard. This mobile view provides a quick overview.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e293b', padding: 24, paddingTop: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '800', color: '#fff' },
  sub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statNum: { fontSize: 28, fontWeight: '800', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#EFF6FF', margin: 16, borderRadius: 12, padding: 16, gap: 10 },
  infoText: { flex: 1, fontSize: 13, color: '#1e40af', lineHeight: 20 },
});


// src/screens/shared/ProfileScreen.tsx — export at bottom
