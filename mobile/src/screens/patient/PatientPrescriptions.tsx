// src/screens/patient/PatientPrescriptions.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { prescriptionsApi } from '../../api/prescriptions.api';

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await prescriptionsApi.getMyPrescriptions();
      setPrescriptions(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2563EB" />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Prescriptions</Text>
      </View>

      {prescriptions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={56} color="#e2e8f0" />
          <Text style={styles.emptyText}>No prescriptions yet</Text>
        </View>
      ) : (
        prescriptions.map((rx) => (
          <View key={rx.id} style={styles.rxCard}>
            <View style={styles.rxHeader}>
              <Text style={styles.rxDoctor}>Dr. {rx.doctorProfile?.user?.fullName}</Text>
              <Text style={styles.rxDate}>{new Date(rx.createdAt).toLocaleDateString()}</Text>
            </View>
            {rx.medications?.map((med: any, i: number) => (
              <View key={i} style={styles.medRow}>
                <Ionicons name="medical-outline" size={14} color="#2563EB" />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.medName}>{med.name} — {med.dosage}</Text>
                  <Text style={styles.medDetail}>{med.frequency} · {med.duration}</Text>
                </View>
              </View>
            ))}
            {rx.notes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesLabel}>Doctor's Notes:</Text>
                <Text style={styles.notesText}>{rx.notes}</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  empty: { alignItems: 'center', padding: 60 },
  emptyText: { color: '#94a3b8', marginTop: 12, fontSize: 15 },
  rxCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  rxHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rxDoctor: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  rxDate: { fontSize: 12, color: '#94a3b8' },
  medRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  medName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  medDetail: { fontSize: 12, color: '#64748b', marginTop: 1 },
  notesBox: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 10, marginTop: 8 },
  notesLabel: { fontSize: 11, fontWeight: '700', color: '#64748b', marginBottom: 2 },
  notesText: { fontSize: 13, color: '#1e293b' },
});
