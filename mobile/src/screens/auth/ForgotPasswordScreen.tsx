// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '../../api/auth.api';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) return Alert.alert('Error', 'Please enter your email');
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#2563EB" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Ionicons name="lock-open-outline" size={56} color="#2563EB" style={styles.icon} />
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          {sent
            ? 'Check your email for a password reset link.'
            : "Enter your email and we'll send you a reset link."}
        </Text>

        {!sent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
            </TouchableOpacity>
          </>
        )}

        {sent && (
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Back to Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  back: { marginTop: 48, marginBottom: 32 },
  content: { flex: 1, alignItems: 'center' },
  icon: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#1e293b', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  input: { width: '100%', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 14, fontSize: 15, backgroundColor: '#fff', color: '#1e293b', marginBottom: 16 },
  btn: { width: '100%', backgroundColor: '#2563EB', borderRadius: 10, padding: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
