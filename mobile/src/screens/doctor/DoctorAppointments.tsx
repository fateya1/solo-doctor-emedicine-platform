// src/screens/doctor/DoctorAppointments.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appointmentsApi } from '../../api/appointments.api';

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#2563EB',
  COMPLETED: '#16a34a', CANCELLED: '#ef4444', NO_SHOW: '#94a3b8',
};

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function DoctorAppointments({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await appointmentsApi.getDoctorAppointments();
      setAppointments(data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>{filtered.length} records</Text>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color="#e2e8f0" />
            <Text style={styles.emptyText}>No appointments</Text>
          </View>
        ) : (
          filtered.map(appt => (
            <TouchableOpacity
              key={appt.id}
              style={styles.card}
              onPress={() => navigation.navigate('WritePrescription', { appointment: appt })}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.patientName}>
                  {appt.patientProfile?.user?.fullName || 'Patient'}
                </Text>
                <Text style={styles.dateText}>
                  {new Date(appt.availabilitySlot?.startTime).toLocaleString([], {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
                {appt.reason && (
                  <Text style={styles.reason} numberOfLines={1}>{appt.reason}</Text>
                )}
              </View>
              <View style={styles.cardRight}>
                <View style={[styles.badge, { backgroundColor: STATUS_COLOR[appt.status] + '20' }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLOR[appt.status] }]}>
                    {appt.status}
                  </Text>
                </View>
                {appt.status === 'CONFIRMED' && (
                  <TouchableOpacity
                    style={styles.videoBtn}
                    onPress={() => navigation.navigate('VideoCall', { appointmentId: appt.id, role: 'doctor' })}
                  >
                    <Ionicons name="videocam" size={14} color="#fff" />
                    <Text style={styles.videoBtnText}>Join</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  filterScroll: { maxHeight: 56 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  filterChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  filterTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardLeft: { flex: 1, marginRight: 10 },
  patientName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  dateText: { fontSize: 12, color: '#94a3b8', marginTop: 3 },
  reason: { fontSize: 12, color: '#64748b', marginTop: 3 },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  videoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2563EB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  videoBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 60 },
  emptyText: { color: '#94a3b8', marginTop: 12, fontSize: 15 },
});
