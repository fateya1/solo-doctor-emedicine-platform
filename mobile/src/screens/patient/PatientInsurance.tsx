// src/screens/patient/PatientInsurance.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../../api/client';

export default function PatientInsurance() {
  const [cards, setCards] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const r = await client.get('/insurance/cards'); setCards(Array.isArray(r.data) ? r.data : r.data?.data ?? []); } catch {}
    try { const r = await client.get('/insurance/claims'); setClaims(Array.isArray(r.data) ? r.data : r.data?.data ?? []); } catch {}
  };

  useEffect(() => { load(); }, []);

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Insurance</Text>
        <Text style={styles.subtitle}>Your insurance cards and claims</Text>
      </View>

      <Text style={styles.sectionTitle}>Insurance Cards</Text>
      {cards.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="card-outline" size={48} color="#e2e8f0" />
          <Text style={styles.emptyText}>No insurance cards linked</Text>
          <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL('https://solo-doctor-emedicine-platform.vercel.app/patient/insurance')}>
            <Text style={styles.linkBtnText}>Add Insurance Online</Text>
          </TouchableOpacity>
        </View>
      ) : (
        cards.map((card: any) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="shield-checkmark" size={28} color="#2563EB" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardProvider}>{card.provider}</Text>
              <Text style={styles.cardNumber}>Card No: {card.cardNumber}</Text>
              <Text style={styles.cardExpiry}>Expires: {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : 'N/A'}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: card.isActive ? '#dcfce7' : '#fee2e2' }]}>
              <Text style={[styles.badgeText, { color: card.isActive ? '#16a34a' : '#ef4444' }]}>{card.isActive ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
        ))
      )}

      {claims.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Claims</Text>
          {claims.slice(0, 5).map((claim: any) => (
            <View key={claim.id} style={styles.claimCard}>
              <View style={styles.claimLeft}>
                <Text style={styles.claimAmount}>KES {(claim.amount ?? 0).toLocaleString()}</Text>
                <Text style={styles.claimDate}>{new Date(claim.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: claim.status === 'APPROVED' ? '#dcfce7' : claim.status === 'REJECTED' ? '#fee2e2' : '#fef3c7' }]}>
                <Text style={[styles.badgeText, { color: claim.status === 'APPROVED' ? '#16a34a' : claim.status === 'REJECTED' ? '#ef4444' : '#d97706' }]}>{claim.status}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardProvider: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  cardNumber: { fontSize: 12, color: '#64748b', marginTop: 2 },
  cardExpiry: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  claimCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  claimLeft: { flex: 1 },
  claimAmount: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  claimDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#94a3b8', marginTop: 12, fontSize: 15 },
  linkBtn: { marginTop: 16, backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  linkBtnText: { color: '#fff', fontWeight: '700' },
});
