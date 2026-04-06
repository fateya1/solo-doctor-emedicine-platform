"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CalendarView = function (_a) {
    var availableSlots = _a.availableSlots;
    return (<div>
      <h3>Select a Date</h3>
      {/* Add a calendar library or component to view slots on the calendar */}
      {availableSlots.map(function (slot) { return (<div key={slot.id}>
          <p>{slot.date}</p>
          {/* Add button or other actions to view available slots */}
        </div>); })}
    </div>);
};
exports.default = CalendarView;
