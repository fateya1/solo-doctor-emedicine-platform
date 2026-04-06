"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SlotBooking = function (_a) {
    var slots = _a.slots;
    var handleBookSlot = function (slotId) {
        // Call backend API to book the selected slot
    };
    return (<div>
      <h3>Available Slots</h3>
      {slots.map(function (slot) { return (<div key={slot.id}>
          <p>{slot.startTime} - {slot.endTime}</p>
          <button onClick={function () { return handleBookSlot(slot.id); }}>Book Slot</button>
        </div>); })}
    </div>);
};
exports.default = SlotBooking;
