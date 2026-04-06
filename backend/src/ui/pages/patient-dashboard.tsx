import React, { useEffect, useState } from 'react';

const PatientDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/appointments/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load appointments', err);
      }
    };
    fetchAppointments();
  }, []);

  const statusColor = (status: string) => {
    if (status === 'confirmed') return 'text-blue-500';
    if (status === 'pending') return 'text-yellow-500';
    if (status === 'cancelled') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Patient Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appt: any) => (
              <li key={appt.id} className="flex items-center justify-between border-b py-2">
                <div>
                  <p className="font-medium">{appt.doctorName}</p>
                  <p className="text-sm text-gray-500">{new Date(appt.scheduledAt).toLocaleString()}</p>
                </div>
                <span className={`text-sm font-semibold ${statusColor(appt.status)}`}>
                  {appt.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;