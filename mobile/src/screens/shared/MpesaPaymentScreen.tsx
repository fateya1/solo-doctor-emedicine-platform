// src/screens/shared/MpesaPaymentScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mpesaApi } from '../../api/video-mpesa.api';

const PLAN_INFO: Record<string, { label: string; price: string; features: string[] }> = {
  BASIC: {
    label: 'Basic',
    price: 'KES 1,500/mo',
    features: ['5 consultations/month', 'Basic prescriptions', 'Email support'],
  },
  PRO: {
    label: 'Pro',
    price: 'KES 3,500/mo',
    features: ['Unlimited consultations', 'Full prescriptions', 'Priority support', 'Video calls'],
  },
  ENTERPRISE: {
    label: 'Enterprise',
    price: 'KES 8,000/mo',
    features: ['Everything in Pro', 'Multi-doctor support', 'Analytics', 'Dedicated support'],
  },
};

export default function MpesaPaymentScreen({ navigation }: any) {
  const [selectedPlan, setSelectedPlan] = useState<string>('PRO');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    mpesaApi.getMySubscription().then(setSubscription).catch(() => {});
  }, []);

  const handlePay = async () => {
    if (!phone || phone.length < 9) return Alert.alert('Error', 'Enter a valid Safaricom number (e.g. 0712345678)');
    const formatted = phone.startsWith('0') ? '254' + phone.slice(1) : phone;
    setLoading(true);
    try {
      const data = await mpesaApi.initiateSubscription(selectedPlan, formatted);
      Alert.alert(
        'STK Push Sent! 📱',
        `Check your phone (${phone}) for the M-Pesa prompt and enter your PIN.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Payment Failed', err.response?.data?.message || 'Could not initiate payment');
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
        <Text style={styles.title}>Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Current subscription */}
      {subscription && (
        <View style={styles.currentSub}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.currentSubText}>
            Current Plan: <Text style={styles.currentSubBold}>{subscription.plan}</Text> — {subscription.status}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Choose a Plan</Text>
      {Object.entries(PLAN_INFO).map(([key, plan]) => (
        <TouchableOpacity
          key={key}
          style={[styles.planCard, selectedPlan === key && styles.planCardActive]}
          onPress={() => setSelectedPlan(key)}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{plan.label}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
          </View>
          {plan.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Ionicons name="checkmark" size={14} color={selectedPlan === key ? '#2563EB' : '#94a3b8'} />
              <Text style={[styles.featureText, selectedPlan === key && styles.featureTextActive]}>{f}</Text>
            </View>
          ))}
          {selectedPlan === key && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>Selected</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>M-Pesa Phone Number</Text>
      <View style={styles.phoneRow}>
        <Text style={styles.phonePrefix}>🇰🇪 +254</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="0712 345 678"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="phone-portrait-outline" size={20} color="#fff" />
            <Text style={styles.payBtnText}>Pay with M-Pesa</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        You will receive an STK push notification on your Safaricom line. Enter your M-Pesa PIN to complete payment.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingTop: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  currentSub: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', margin: 16, borderRadius: 10, padding: 12, gap: 8 },
  currentSubText: { fontSize: 13, color: '#166534' },
  currentSubBold: { fontWeight: '800' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', paddingHorizontal: 16, marginBottom: 10, marginTop: 8 },
  planCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1.5, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  planCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  planName: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  planPrice: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  featureText: { fontSize: 13, color: '#94a3b8' },
  featureTextActive: { color: '#1e293b' },
  selectedBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#2563EB', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  selectedBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', marginBottom: 16 },
  phonePrefix: { paddingHorizontal: 14, fontSize: 14, color: '#1e293b', borderRightWidth: 1, borderRightColor: '#e2e8f0', paddingVertical: 14 },
  phoneInput: { flex: 1, padding: 14, fontSize: 15, color: '#1e293b' },
  payBtn: { backgroundColor: '#16a34a', marginHorizontal: 16, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disclaimer: { textAlign: 'center', color: '#94a3b8', fontSize: 12, paddingHorizontal: 24, marginBottom: 32 },
});
