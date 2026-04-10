import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import PatientNavigator, { DoctorNavigator, AdminNavigator } from './Navigators';

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF6FF' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) return <AuthNavigator />;
  if (user.role === 'DOCTOR') return <DoctorNavigator />;
  if (user.role === 'ADMIN') return <AdminNavigator />;
  return <PatientNavigator />;
}