// src/screens/doctor/WritePrescription.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { prescriptionsApi } from '../../api/prescriptions.api';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function WritePrescription({ route, navigation }: any) {
  const { appointment } = route.params;
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const updateMed = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length === 1) return;
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const valid = medications.every(m => m.name && m.dosage && m.frequency && m.duration);
    if (!valid) return Alert.alert('Incomplete', 'Please fill in all medication fields');

    setLoading(true);
    try {
      await prescriptionsApi.create({
        appointmentId: appointment.id,
        medications,
        notes,
      });
      Alert.alert('Prescription Saved ✅', 'The prescription has been issued to the patient', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Could not save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Write Prescription</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Patient info */}
      <View style={styles.patientCard}>
        <Ionicons name="person-circle-outline" size={36} color="#2563EB" />
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{appointment.patientProfile?.user?.fullName || 'Patient'}</Text>
          <Text style={styles.patientSub}>
            {new Date(appointment.availabilitySlot?.startTime).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Medications</Text>

      {medications.map((med, index) => (
        <View key={index} style={styles.medCard}>
          <View style={styles.medHeader}>
            <Text style={styles.medNum}>Medication {index + 1}</Text>
            {medications.length > 1 && (
              <TouchableOpacity onPress={() => removeMedication(index)}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Drug name (e.g. Amoxicillin)"
            placeholderTextColor="#94a3b8"
            value={med.name}
            onChangeText={(v) => updateMed(index, 'name', v)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Dosage (e.g. 500mg)"
              placeholderTextColor="#94a3b8"
              value={med.dosage}
              onChangeText={(v) => updateMed(index, 'dosage', v)}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Frequency (e.g. 3x daily)"
              placeholderTextColor="#94a3b8"
              value={med.frequency}
              onChangeText={(v) => updateMed(index, 'frequency', v)}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Duration (e.g. 7 days)"
            placeholderTextColor="#94a3b8"
            value={med.duration}
            onChangeText={(v) => updateMed(index, 'duration', v)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addMedBtn} onPress={addMedication}>
        <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
        <Text style={styles.addMedText}>Add Another Medication</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Doctor's Notes</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Additional instructions, allergies noted, follow-up date..."
        placeholderTextColor="#94a3b8"
        multiline
        numberOfLines={4}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="document-text" size={20} color="#fff" />
            <Text style={styles.submitBtnText}>Issue Prescription</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  patientCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', margin: 16, borderRadius: 12, padding: 14, gap: 12 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  patientSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', paddingHorizontal: 16, marginBottom: 10, marginTop: 4 },
  medCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  medNum: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 11, fontSize: 14, color: '#1e293b', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  halfInput: { flex: 1 },
  addMedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#2563EB', borderStyle: 'dashed' },
  addMedText: { color: '#2563EB', fontWeight: '700', fontSize: 14 },
  notesInput: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, fontSize: 14, color: '#1e293b', textAlignVertical: 'top', marginBottom: 16, minHeight: 100 },
  submitBtn: { backgroundColor: '#2563EB', marginHorizontal: 16, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 40 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
