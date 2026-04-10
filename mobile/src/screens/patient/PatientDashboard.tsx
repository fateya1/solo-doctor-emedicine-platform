// src/screens/patient/PatientDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { appointmentsApi } from '../../api/appointments.api';

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#2563EB',
  COMPLETED: '#16a34a',
  CANCELLED: '#ef4444',
  NO_SHOW: '#94a3b8',
};

export default function PatientDashboard({ navigation }: any) {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await appointmentsApi.getMyAppointments();
      setAppointments(data);
    } catch {
      // silently fail on dashboard
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const upcomingCount = appointments.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status)).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.fullName?.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>How are you feeling today?</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{upcomingCount}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{appointments.filter(a => a.status === 'COMPLETED').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{appointments.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Book')}>
          <Ionicons name="calendar-outline" size={28} color="#2563EB" />
          <Text style={styles.actionText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Prescriptions')}>
          <Ionicons name="document-text-outline" size={28} color="#2563EB" />
          <Text style={styles.actionText}>Prescriptions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MpesaPayment')}>
          <Ionicons name="phone-portrait-outline" size={28} color="#2563EB" />
          <Text style={styles.actionText}>M-Pesa</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Appointments */}
      <Text style={styles.sectionTitle}>Recent Appointments</Text>
      {appointments.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={48} color="#e2e8f0" />
          <Text style={styles.emptyText}>No appointments yet</Text>
          <TouchableOpacity style={styles.bookNowBtn} onPress={() => navigation.navigate('Book')}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        appointments.slice(0, 5).map((appt) => (
          <TouchableOpacity
            key={appt.id}
            style={styles.apptCard}
            onPress={() => {
              if (appt.status === 'CONFIRMED' && appt.videoRoomUrl) {
                navigation.navigate('VideoCall', { appointmentId: appt.id, role: 'patient' });
              }
            }}
          >
            <View style={styles.apptLeft}>
              <Text style={styles.apptDoctor}>{appt.availabilitySlot?.doctor?.fullName || 'Doctor'}</Text>
              <Text style={styles.apptDate}>
                {new Date(appt.scheduledAt || appt.availabilitySlot?.startTime).toLocaleString()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[appt.status] + '20' }]}>
              <Text style={[styles.statusText, { color: STATUS_COLOR[appt.status] }]}>{appt.status}</Text>
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
  subGreeting: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, padding: 16, marginTop: -8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statNum: { fontSize: 28, fontWeight: '800', color: '#2563EB' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', paddingHorizontal: 16, marginTop: 8, marginBottom: 10 },
  actionsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 8 },
  actionBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  actionText: { fontSize: 12, color: '#1e293b', marginTop: 6, fontWeight: '600' },
  apptCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  apptLeft: { flex: 1 },
  apptDoctor: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  apptDate: { fontSize: 12, color: '#94a3b8', marginTop: 3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#94a3b8', marginTop: 12, fontSize: 15 },
  bookNowBtn: { marginTop: 16, backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  bookNowText: { color: '#fff', fontWeight: '700' },
});
