import React, { useState, useEffect } from 'react';
import { fetchAvailableSlots, bookAppointment } from '../../api/appointmentApi';

const BookingSystem: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientName: '',
    reason: ''
  });

  useEffect(() => {
    const loadAvailableSlots = async () => {
      const slots = await fetchAvailableSlots();
      setAvailableSlots(slots);
    };

    loadAvailableSlots();
  }, []);

  const handleBooking = async () => {
    if (selectedSlot && appointmentDetails.patientName && appointmentDetails.reason) {
      const success = await bookAppointment(selectedSlot, appointmentDetails);
      if (success) {
        alert('Appointment booked successfully!');
      } else {
        alert('Failed to book appointment.');
      }
    } else {
      alert('Please fill in all details and select a slot.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Book an Appointment</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Select an Available Slot</h2>
          <ul className="space-y-3">
            {availableSlots.map((slot: any) => (
              <li key={slot.id} className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedSlot(slot.id)}>
                <span>{slot.startTime} - {slot.endTime}</span>
                {selectedSlot === slot.id && <span className="text-green-500">Selected</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <input type="text" placeholder="Enter your name" value={appointmentDetails.patientName} onChange={(e) => setAppointmentDetails({ ...appointmentDetails, patientName: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <textarea placeholder="Reason for the appointment" value={appointmentDetails.reason} onChange={(e) => setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4"></textarea>

          <button onClick={handleBooking} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;
import React, { useState, useEffect } from 'react';
import { fetchAvailableSlots, bookAppointment } from '../../api/appointmentApi';

const BookingSystem: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientName: '',
    reason: ''
  });

  useEffect(() => {
    const loadAvailableSlots = async () => {
      const slots = await fetchAvailableSlots();
      setAvailableSlots(slots);
    };

    loadAvailableSlots();
  }, []);

  const handleBooking = async () => {
    if (selectedSlot && appointmentDetails.patientName && appointmentDetails.reason) {
      const success = await bookAppointment(selectedSlot, appointmentDetails);
      if (success) {
        alert('Appointment booked successfully!');
      } else {
        alert('Failed to book appointment.');
      }
    } else {
      alert('Please fill in all details and select a slot.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Book an Appointment</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Select an Available Slot</h2>
          <ul className="space-y-3">
            {availableSlots.map((slot: any) => (
              <li key={slot.id} className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedSlot(slot.id)}>
                <span>{slot.startTime} - {slot.endTime}</span>
                {selectedSlot === slot.id && <span className="text-green-500">Selected</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <input type="text" placeholder="Enter your name" value={appointmentDetails.patientName} onChange={(e) => setAppointmentDetails({ ...appointmentDetails, patientName: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <textarea placeholder="Reason for the appointment" value={appointmentDetails.reason} onChange={(e) => setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4"></textarea>

          <button onClick={handleBooking} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;
import React, { useState, useEffect } from 'react';
import { fetchAvailableSlots, bookAppointment } from '../../api/appointmentApi';

const BookingSystem: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientName: '',
    reason: ''
  });

  useEffect(() => {
    const loadAvailableSlots = async () => {
      const slots = await fetchAvailableSlots();
      setAvailableSlots(slots);
    };

    loadAvailableSlots();
  }, []);

  const handleBooking = async () => {
    if (selectedSlot && appointmentDetails.patientName && appointmentDetails.reason) {
      const success = await bookAppointment(selectedSlot, appointmentDetails);
      if (success) {
        alert('Appointment booked successfully!');
      } else {
        alert('Failed to book appointment.');
      }
    } else {
      alert('Please fill in all details and select a slot.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Book an Appointment</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Select an Available Slot</h2>
          <ul className="space-y-3">
            {availableSlots.map((slot: any) => (
              <li key={slot.id} className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedSlot(slot.id)}>
                <span>{slot.startTime} - {slot.endTime}</span>
                {selectedSlot === slot.id && <span className="text-green-500">Selected</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <input type="text" placeholder="Enter your name" value={appointmentDetails.patientName} onChange={(e) => setAppointmentDetails({ ...appointmentDetails, patientName: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <textarea placeholder="Reason for the appointment" value={appointmentDetails.reason} onChange={(e) => setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4"></textarea>

          <button onClick={handleBooking} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;
