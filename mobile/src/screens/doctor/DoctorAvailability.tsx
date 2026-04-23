// src/screens/doctor/DoctorAvailability.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../../api/client';

export default function DoctorAvailability() {
  const [slots, setSlots] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await client.get('/availability/my-slots');
      const data = res.data;
      setSlots(Array.isArray(data) ? data : data?.data ?? data?.slots ?? []);
    } catch (e: any) {
      console.log('availability error', e?.response?.data);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteSlot = async (id: string) => {
    Alert.alert('Delete Slot', 'Remove this availability slot?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await client.delete('/availability/slots/' + id); load(); } catch {}
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Availability</Text>
        <Text style={styles.subtitle}>{slots.length} slots scheduled</Text>
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        {slots.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={48} color="#e2e8f0" />
            <Text style={styles.emptyText}>No availability slots yet</Text>
            <Text style={styles.emptyHint}>Add slots via the web dashboard</Text>
          </View>
        ) : (
          slots.map((slot: any) => (
            <View key={slot.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.dateText}>
                  {new Date(slot.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
                <Text style={styles.timeText}>
                  {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={styles.cardRight}>
                <View style={[styles.badge, { backgroundColor: slot.isBooked ? '#fef3c7' : '#dcfce7' }]}>
                  <Text style={[styles.badgeText, { color: slot.isBooked ? '#d97706' : '#16a34a' }]}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </Text>
                </View>
                {!slot.isBooked && (
                  <TouchableOpacity onPress={() => deleteSlot(slot.id)}>
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, marginTop: 10, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  cardLeft: { flex: 1 },
  dateText: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  timeText: { fontSize: 13, color: '#64748b', marginTop: 3 },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 60 },
  emptyText: { color: '#94a3b8', marginTop: 12, fontSize: 15 },
  emptyHint: { color: '#cbd5e1', marginTop: 6, fontSize: 13 },
});
