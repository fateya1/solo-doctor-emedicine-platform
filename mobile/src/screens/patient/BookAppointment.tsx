// src/screens/patient/BookAppointment.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appointmentsApi } from '../../api/appointments.api';

export default function BookAppointment({ navigation }: any) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async (spec?: string) => {
    try {
      const data = await appointmentsApi.getDoctors(spec);
      setDoctors(data);
    } catch {
      Alert.alert('Error', 'Could not load doctors');
    }
  };

  const selectDoctor = async (doctor: any) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setLoadingSlots(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await appointmentsApi.getAvailableSlots(doctor.id, today);
      setSlots(data);
    } catch {
      Alert.alert('Error', 'Could not load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return Alert.alert('Select a slot', 'Please choose an appointment slot');
    setLoading(true);
    try {
      await appointmentsApi.book(selectedSlot.id, reason);
      Alert.alert('Success! 🎉', 'Your appointment has been booked', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (err: any) {
      Alert.alert('Booking Failed', err.response?.data?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
      </View>

      {/* Search by specialty */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by specialty..."
          placeholderTextColor="#94a3b8"
          value={specialty}
          onChangeText={(t) => { setSpecialty(t); loadDoctors(t); }}
        />
      </View>

      {/* Doctors list */}
      <Text style={styles.sectionTitle}>Available Doctors</Text>
      {doctors.map((doc) => (
        <TouchableOpacity
          key={doc.id}
          style={[styles.doctorCard, selectedDoctor?.id === doc.id && styles.doctorCardActive]}
          onPress={() => selectDoctor(doc)}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{doc.user?.fullName?.[0] || 'D'}</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doc.user?.fullName}</Text>
            <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
            <Text style={styles.doctorFee}>KES {doc.consultationFee}</Text>
          </View>
          {selectedDoctor?.id === doc.id && (
            <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
          )}
        </TouchableOpacity>
      ))}

      {/* Slots */}
      {selectedDoctor && (
        <>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          {loadingSlots ? (
            <ActivityIndicator color="#2563EB" style={{ margin: 20 }} />
          ) : slots.length === 0 ? (
            <Text style={styles.noSlots}>No slots available today</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsScroll}>
              {slots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[styles.slotChip, selectedSlot?.id === slot.id && styles.slotChipActive]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text style={[styles.slotTime, selectedSlot?.id === slot.id && styles.slotTimeActive]}>
                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </>
      )}

      {/* Reason */}
      {selectedSlot && (
        <>
          <Text style={styles.sectionTitle}>Reason for Visit</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Briefly describe your symptoms..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            value={reason}
            onChangeText={setReason}
          />

          <TouchableOpacity style={styles.bookBtn} onPress={handleBook} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.bookBtnText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, padding: 12, fontSize: 14, color: '#1e293b' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', paddingHorizontal: 16, marginBottom: 10, marginTop: 4 },
  doctorCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  doctorCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#2563EB' },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  doctorSpecialty: { fontSize: 12, color: '#64748b', marginTop: 2 },
  doctorFee: { fontSize: 12, color: '#16a34a', fontWeight: '700', marginTop: 2 },
  slotsScroll: { paddingLeft: 16, marginBottom: 8 },
  slotChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#e2e8f0', marginRight: 10, backgroundColor: '#fff' },
  slotChipActive: { borderColor: '#2563EB', backgroundColor: '#2563EB' },
  slotTime: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  slotTimeActive: { color: '#fff' },
  noSlots: { color: '#94a3b8', textAlign: 'center', padding: 20 },
  reasonInput: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, fontSize: 14, color: '#1e293b', textAlignVertical: 'top', marginBottom: 16 },
  bookBtn: { backgroundColor: '#2563EB', marginHorizontal: 16, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 32 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
