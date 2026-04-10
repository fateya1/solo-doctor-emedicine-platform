// src/screens/doctor/DoctorDashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { appointmentsApi } from '../../api/appointments.api';

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#2563EB', COMPLETED: '#16a34a',
  CANCELLED: '#ef4444', NO_SHOW: '#94a3b8',
};

export default function DoctorDashboard({ navigation }: any) {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await appointmentsApi.getDoctorAppointments();
      setAppointments(data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const today = appointments.filter(a => {
    const d = new Date(a.availabilitySlot?.startTime);
    return d.toDateString() === new Date().toDateString();
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dr. {user?.fullName?.split(' ').slice(-1)[0]} 👋</Text>
          <Text style={styles.sub}>You have {today.length} appointments today</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Today', value: today.length, color: '#2563EB' },
          { label: 'Pending', value: appointments.filter(a => a.status === 'PENDING').length, color: '#f59e0b' },
          { label: 'Total', value: appointments.length, color: '#16a34a' },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Today's Appointments</Text>
      {today.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={48} color="#e2e8f0" />
          <Text style={styles.emptyText}>No appointments today</Text>
        </View>
      ) : (
        today.map((appt) => (
          <TouchableOpacity
            key={appt.id}
            style={styles.apptCard}
            onPress={() => navigation.navigate('WritePrescription', { appointment: appt })}
          >
            <View style={styles.apptLeft}>
              <Text style={styles.patientName}>{appt.patientProfile?.user?.fullName || 'Patient'}</Text>
              <Text style={styles.apptTime}>
                {new Date(appt.availabilitySlot?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {appt.reason && <Text style={styles.reason} numberOfLines={1}>{appt.reason}</Text>}
            </View>
            <View style={styles.apptRight}>
              <View style={[styles.badge, { backgroundColor: STATUS_COLOR[appt.status] + '20' }]}>
                <Text style={[styles.badgeText, { color: STATUS_COLOR[appt.status] }]}>{appt.status}</Text>
              </View>
              {appt.status === 'CONFIRMED' && (
                <TouchableOpacity
                  style={styles.videoBtn}
                  onPress={() => navigation.navigate('VideoCall', { appointmentId: appt.id, role: 'doctor' })}
                >
                  <Ionicons name="videocam" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '800', color: '#fff' },
  sub: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, padding: 16, marginTop: -8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statNum: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', paddingHorizontal: 16, marginBottom: 10 },
  apptCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  apptLeft: { flex: 1 },
  patientName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  apptTime: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  reason: { fontSize: 12, color: '#64748b', marginTop: 3 },
  apptRight: { alignItems: 'flex-end', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  videoBtn: { backgroundColor: '#2563EB', padding: 8, borderRadius: 20 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#94a3b8', marginTop: 12, fontSize: 15 },
});
