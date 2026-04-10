import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import PatientDashboard from '../screens/patient/PatientDashboard';
import BookAppointment from '../screens/patient/BookAppointment';
import PatientPrescriptions from '../screens/patient/PatientPrescriptions';
import VideoCallScreen from '../screens/shared/VideoCallScreen';
import MpesaPaymentScreen from '../screens/shared/MpesaPaymentScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import DoctorAppointments from '../screens/doctor/DoctorAppointments';
import WritePrescription from '../screens/doctor/WritePrescription';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Home: 'home', Book: 'calendar',
            Prescriptions: 'document-text', Profile: 'person',
          };
          return <Ionicons name={(icons[route.name] || 'ellipse') as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={PatientDashboard} />
      <Tab.Screen name="Book" component={BookAppointment} />
      <Tab.Screen name="Prescriptions" component={PatientPrescriptions} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function PatientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientTabs" component={PatientTabs} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
      <Stack.Screen name="MpesaPayment" component={MpesaPaymentScreen} />
    </Stack.Navigator>
  );
}

function DoctorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Dashboard: 'grid', Appointments: 'calendar', Profile: 'person',
          };
          return <Ionicons name={(icons[route.name] || 'ellipse') as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DoctorDashboard} />
      <Tab.Screen name="Appointments" component={DoctorAppointments} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function DoctorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorTabs" component={DoctorTabs} />
      <Stack.Screen name="WritePrescription" component={WritePrescription} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
    </Stack.Navigator>
  );
}

export function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}