// src/api/appointments.api.ts
import client from './client';

export const appointmentsApi = {
  // Patient: get my appointments
  getMyAppointments: async () => {
    const res = await client.get('/appointments/patient');
    return res.data;
  },

  // Doctor: get my appointments
  getDoctorAppointments: async () => {
    const res = await client.get('/appointments/doctor');
    return res.data;
  },

  // Get available slots for a doctor
  getAvailableSlots: async (doctorProfileId: string, date?: string) => {
    const res = await client.get(`/availability/slots`, {
      params: { doctorId: doctorProfileId, from: date, to: date },
    });
    return res.data;
  },

  // Book an appointment
  book: async (slotId: string, reason?: string) => {
    const res = await client.post('/appointments/book', { slotId, reason });
    return res.data;
  },

  // Cancel an appointment
  cancel: async (appointmentId: string) => {
    const res = await client.patch(`/appointments/${appointmentId}/cancel`);
    return res.data;
  },

  // Get single appointment detail
  getById: async (id: string) => {
    const res = await client.get(`/appointments/${id}`);
    return res.data;
  },

  // Doctor: update appointment status
  updateStatus: async (id: string, status: string) => {
    const res = await client.post(`/appointments/update-status/${id}`, { status });
    return res.data;
  },

  // Get all doctors (for booking)
  getDoctors: async (specialty?: string) => {
    const res = await client.get('/referral/doctors', { params: { speciality: specialty } });
    return res.data;
  },
};
