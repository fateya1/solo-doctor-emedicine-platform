import React from 'react';

const SlotBooking = ({ slots }) => {
  const handleBookSlot = (slotId) => {
    // Call backend API to book the selected slot
  };

  return (
    <div>
      <h3>Available Slots</h3>
      {slots.map((slot) => (
        <div key={slot.id}>
          <p>{slot.startTime} - {slot.endTime}</p>
          <button onClick={() => handleBookSlot(slot.id)}>Book Slot</button>
        </div>
      ))}
    </div>
  );
};

export default SlotBooking;
