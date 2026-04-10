// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) return Alert.alert('Error', 'Please fill in all fields');
    setLoading(true);
    try {
      await register({ fullName, email: email.trim().toLowerCase(), password, role });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.logo}>SoloDoc</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#94a3b8" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#94a3b8" value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>I am a:</Text>
      <View style={styles.roleRow}>
        {(['PATIENT', 'DOCTOR'] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleBtn, role === r && styles.roleBtnActive]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
              {r === 'PATIENT' ? '🤒 Patient' : '👨‍⚕️ Doctor'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF6FF' },
  content: { padding: 24, paddingTop: 60 },
  logo: { fontSize: 32, fontWeight: '800', color: '#2563EB', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 28 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 15, backgroundColor: '#fff', color: '#1e293b' },
  label: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', backgroundColor: '#fff' },
  roleBtnActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  roleBtnText: { color: '#64748b', fontWeight: '600' },
  roleBtnTextActive: { color: '#2563EB' },
  btn: { backgroundColor: '#2563EB', borderRadius: 10, padding: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 14 },
  linkBold: { color: '#2563EB', fontWeight: '700' },
});
