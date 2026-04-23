// src/screens/doctor/DoctorMessages.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../../api/client';

export default function DoctorMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await client.get('/messaging/conversations');
      const data = res.data;
      setConversations(Array.isArray(data) ? data : data?.data ?? data?.conversations ?? []);
    } catch (e: any) { console.log('messages error', e?.response?.data); }
  };

  useEffect(() => { load(); }, []);

  const filtered = conversations.filter(c => {
    const name = c.patient?.fullName ?? c.patientProfile?.user?.fullName ?? '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>{conversations.length} conversations</Text>
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput style={styles.searchInput} placeholder="Search patients..." placeholderTextColor="#94a3b8" value={search} onChangeText={setSearch} />
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color="#e2e8f0" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptyHint}>Patient messages will appear here</Text>
          </View>
        ) : (
          filtered.map((conv: any) => {
            const name = conv.patient?.fullName ?? conv.patientProfile?.user?.fullName ?? 'Patient';
            const lastMsg = conv.lastMessage?.content ?? 'No messages yet';
            const time = conv.lastMessage?.createdAt ?? conv.updatedAt;
            return (
              <TouchableOpacity key={conv.id} style={styles.card}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={styles.patientName}>{name}</Text>
                    {time && <Text style={styles.timeText}>{new Date(time).toLocaleDateString()}</Text>}
                  </View>
                  <Text style={styles.lastMsg} numberOfLines={1}>{lastMsg}</Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 10, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  patientName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  timeText: { fontSize: 11, color: '#94a3b8' },
  lastMsg: { fontSize: 13, color: '#64748b' },
  empty: { alignItems: 'center', padding: 60 },
  emptyText: { color: '#94a3b8', marginTop: 12, fontSize: 15 },
  emptyHint: { color: '#cbd5e1', marginTop: 6, fontSize: 13 },
});
