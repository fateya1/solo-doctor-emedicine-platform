// src/screens/doctor/DoctorSubscription.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../../api/client';

export default function DoctorSubscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const res = await client.get('/subscription/my'); setSubscription(res.data); } catch {}
    try { const res = await client.get('/subscription/plans'); const d = res.data; setPlans(Array.isArray(d) ? d : d?.data ?? []); } catch {}
  };

  useEffect(() => { load(); }, []);

  const isActive = subscription?.status === 'ACTIVE';

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.subtitle}>Manage your SoloDoc plan</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.planRow}>
          <Ionicons name={isActive ? 'shield-checkmark' : 'shield-outline'} size={40} color={isActive ? '#16a34a' : '#94a3b8'} />
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{subscription?.plan ?? 'No Active Plan'}</Text>
            <View style={[styles.badge, { backgroundColor: isActive ? '#dcfce7' : '#fee2e2' }]}>
              <Text style={[styles.badgeText, { color: isActive ? '#16a34a' : '#ef4444' }]}>{subscription?.status ?? 'INACTIVE'}</Text>
            </View>
          </View>
        </View>
        {subscription && (
          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Started</Text>
              <Text style={styles.detailValue}>{new Date(subscription.startDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Expires</Text>
              <Text style={styles.detailValue}>{new Date(subscription.endDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>KES {(subscription.amount ?? 0).toLocaleString()}</Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.manageBtn} onPress={() => Linking.openURL('https://solo-doctor-emedicine-platform.vercel.app/doctor/subscription')}>
        <Ionicons name="open-outline" size={18} color="#fff" />
        <Text style={styles.manageBtnText}>Manage Subscription Online</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 20, elevation: 3 },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  planInfo: { flex: 1, gap: 8 },
  planName: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  detail: { alignItems: 'center', flex: 1 },
  detailLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginTop: 4 },
  manageBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2563EB', margin: 16, borderRadius: 12, padding: 16 },
  manageBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
