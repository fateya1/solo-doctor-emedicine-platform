// src/screens/doctor/DoctorAnalytics.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../../api/client';
import { appointmentsApi } from '../../api/appointments.api';

export default function DoctorAnalytics() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const appts = await appointmentsApi.getDoctorAppointments(); setAppointments(appts); } catch {}
    try { const res = await client.get('/doctor/analytics'); setAnalytics(res.data); } catch {}
  };

  useEffect(() => { load(); }, []);

  const total = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;
  const pending = appointments.filter(a => a.status === 'PENDING').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: 'Total', value: total, icon: 'calendar', color: '#2563EB' },
    { label: 'Confirmed', value: confirmed, icon: 'checkmark-circle', color: '#16a34a' },
    { label: 'Completed', value: completed, icon: 'checkmark-done-circle', color: '#0891b2' },
    { label: 'Pending', value: pending, icon: 'time', color: '#f59e0b' },
    { label: 'Cancelled', value: cancelled, icon: 'close-circle', color: '#ef4444' },
    { label: 'Completion %', value: completionRate + '%', icon: 'stats-chart', color: '#7c3aed' },
  ];

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Your practice performance</Text>
      </View>
      <View style={styles.grid}>
        {stats.map(s => (
          <View key={s.label} style={styles.card}>
            <Ionicons name={s.icon as any} size={28} color={s.color} />
            <Text style={[styles.value, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.label}>{s.label}</Text>
          </View>
        ))}
      </View>
      {analytics && (
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Earnings Summary</Text>
          <Text style={styles.earningsValue}>KES {(analytics.totalEarnings ?? analytics.earnings ?? 0).toLocaleString()}</Text>
          <Text style={styles.earningsHint}>Total platform earnings</Text>
          {analytics.totalPatients && <Text style={styles.earningsHint}>{analytics.totalPatients} unique patients</Text>}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', width: '46%', elevation: 2, gap: 6 },
  value: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
  earningsCard: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 24, alignItems: 'center', elevation: 3 },
  earningsTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  earningsValue: { fontSize: 32, fontWeight: '800', color: '#16a34a', marginTop: 8 },
  earningsHint: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
});
