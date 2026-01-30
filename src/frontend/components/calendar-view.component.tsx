import React from 'react';

const CalendarView = ({ availableSlots }) => {
  return (
    <div>
      <h3>Select a Date</h3>
      {/* Add a calendar library or component to view slots on the calendar */}
      {availableSlots.map((slot) => (
        <div key={slot.id}>
          <p>{slot.date}</p>
          {/* Add button or other actions to view available slots */}
        </div>
      ))}
    </div>
  );
};

export default CalendarView;
