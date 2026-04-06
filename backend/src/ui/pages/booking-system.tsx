import React, { useState, useEffect } from 'react';

const BookingSystem: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState({ patientName: '', reason: '' });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/availability/slots', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSlots(data);
      } catch (err) {
        console.error('Failed to load slots', err);
      }
    };
    fetchSlots();
  }, []);

  const handleBooking = async () => {
    if (!selectedSlot) return alert('Please select a slot');
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slotId: selectedSlot, ...appointmentDetails }),
      });
      alert('Appointment booked!');
    } catch (err) {
      console.error('Booking failed', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Book an Appointment</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Select an Available Slot</h2>
          <ul className="space-y-3">
            {slots.map((slot: any) => (
              <li
                key={slot.id}
                className={`flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100 ${selectedSlot === slot.id ? 'bg-green-50' : ''}`}
                onClick={() => setSelectedSlot(slot.id)}
              >
                <span>{slot.startTime} - {slot.endTime}</span>
                {selectedSlot === slot.id && <span className="text-green-500 text-sm">Selected</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <input
            type="text"
            placeholder="Your name"
            value={appointmentDetails.patientName}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, patientName: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <textarea
            placeholder="Reason for appointment"
            value={appointmentDetails.reason}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleBooking}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;