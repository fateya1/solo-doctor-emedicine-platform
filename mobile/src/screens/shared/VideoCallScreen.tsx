// src/screens/shared/VideoCallScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { videoApi } from '../../api/video-mpesa.api';

export default function VideoCallScreen({ route, navigation }: any) {
  const { appointmentId, role } = route.params;
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        const data = role === 'doctor'
          ? await videoApi.getDoctorToken(appointmentId)
          : await videoApi.getPatientToken(appointmentId);
        setRoomUrl(data.roomUrl);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Could not join call');
      } finally {
        setLoading(false);
      }
    };
    getToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Joining consultation room...</Text>
      </View>
    );
  }

  if (error || !roomUrl) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={56} color="#ef4444" />
        <Text style={styles.errorText}>{error || 'Room unavailable'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {
          Alert.alert('Leave Call', 'Are you sure you want to leave?', [
            { text: 'Cancel' },
            { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
          ]);
        }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Video Consultation</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <WebView
        source={{ uri: roomUrl }}
        style={styles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: 24 },
  loadingText: { marginTop: 16, color: '#64748b', fontSize: 15 },
  errorText: { color: '#ef4444', fontSize: 16, marginTop: 12, textAlign: 'center' },
  backBtn: { marginTop: 20, backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  backBtnText: { color: '#fff', fontWeight: '700' },
  topBar: { backgroundColor: '#1e293b', paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topBarTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 4 },
  liveText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  webview: { flex: 1 },
});
