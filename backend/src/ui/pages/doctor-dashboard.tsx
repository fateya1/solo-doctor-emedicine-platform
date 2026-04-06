import React, { useEffect, useState } from 'react';
import { fetchDoctorAppointments, fetchDoctorAvailability } from '../../api/doctorApi';

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      const appointmentsData = await fetchDoctorAppointments();
      setAppointments(appointmentsData);
    };
    const loadAvailability = async () => {
      const availabilityData = await fetchDoctorAvailability();
      setAvailability(availabilityData);
    };
    loadAppointments();
    loadAvailability();
  }, []);

  const statusColor = (status: string) => {
    if (status === 'confirmed') return 'bg-blue-500';
    if (status === 'pending') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
          <ul className="space-y-3">
            {appointments.map((appointment: any) => (
              <li key={appointment.id} className="flex items-center justify-between border-b py-2">
                <span>{appointment.patientName}</span>
                <span className={`text-sm px-2 py-1 rounded-full text-white ${statusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Your Availability</h2>
          <ul className="space-y-3">
            {availability.map((slot: any) => (
              <li key={slot.id} className="flex items-center justify-between border-b py-2">
                <span>{slot.startTime} - {slot.endTime}</span>
                <span className={`text-sm px-2 py-1 rounded-full text-white ${statusColor(slot.status)}`}>
                  {slot.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between border-b py-2">
              <span className="text-gray-700">New Appointment Request</span>
              <span className="text-sm text-yellow-500">Pending</span>
            </li>
            <li className="flex items-center justify-between border-b py-2">
              <span className="text-gray-700">Appointment Confirmed</span>
              <span className="text-sm text-blue-500">Confirmed</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;