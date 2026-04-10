// src/api/video.api.ts
import client from './client';

export const videoApi = {
  getDoctorToken: async (appointmentId: string) => {
    const res = await client.post(`/video/doctor/${appointmentId}/token`);
    return res.data; // { token, roomUrl, roomName }
  },

  getPatientToken: async (appointmentId: string) => {
    const res = await client.post(`/video/patient/${appointmentId}/token`);
    return res.data;
  },

  getRoomStatus: async (appointmentId: string) => {
    const res = await client.get(`/video/${appointmentId}/status`);
    return res.data;
  },
};

// src/api/mpesa.api.ts
export const mpesaApi = {
  initiateSubscription: async (plan: string, phoneNumber: string) => {
    const res = await client.post('/subscription/initiate', { plan, phoneNumber });
    return res.data; // { paymentId, checkoutRequestId, message }
  },

  getMySubscription: async () => {
    const res = await client.get('/subscription/my');
    return res.data;
  },

  getPlans: async () => {
    const res = await client.get('/subscription/plans');
    return res.data;
  },
};
