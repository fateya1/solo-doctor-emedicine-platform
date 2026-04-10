// src/api/prescriptions.api.ts
import client from './client';

export const prescriptionsApi = {
  getMyPrescriptions: async () => {
    const res = await client.get('/prescriptions/my');
    return res.data;
  },

  getDoctorPrescriptions: async () => {
    const res = await client.get('/prescriptions/doctor');
    return res.data;
  },

  create: async (payload: {
    appointmentId: string;
    medications: { name: string; dosage: string; frequency: string; duration: string }[];
    notes?: string;
  }) => {
    const res = await client.post('/prescriptions', payload);
    return res.data;
  },

  getByAppointment: async (appointmentId: string) => {
    const res = await client.get(`/prescriptions/appointment/${appointmentId}`);
    return res.data;
  },
};
