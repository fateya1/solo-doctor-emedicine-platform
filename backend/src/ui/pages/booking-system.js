"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var appointmentApi_1 = require("../../api/appointmentApi");
var BookingSystem = function () {
    var _a = (0, react_1.useState)([]), availableSlots = _a[0], setAvailableSlots = _a[1];
    var _b = (0, react_1.useState)(null), selectedSlot = _b[0], setSelectedSlot = _b[1];
    var _c = (0, react_1.useState)({
        patientName: '',
        reason: ''
    }), appointmentDetails = _c[0], setAppointmentDetails = _c[1];
    (0, react_1.useEffect)(function () {
        var loadAvailableSlots = function () { return __awaiter(void 0, void 0, void 0, function () {
            var slots;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, appointmentApi_1.fetchAvailableSlots)()];
                    case 1:
                        slots = _a.sent();
                        setAvailableSlots(slots);
                        return [2 /*return*/];
                }
            });
        }); };
        loadAvailableSlots();
    }, []);
    var handleBooking = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(selectedSlot && appointmentDetails.patientName && appointmentDetails.reason)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, appointmentApi_1.bookAppointment)(selectedSlot, appointmentDetails)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        alert('Appointment booked successfully!');
                    }
                    else {
                        alert('Failed to book appointment.');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    alert('Please fill in all details and select a slot.');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Book an Appointment</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Select an Available Slot</h2>
          <ul className="space-y-3">
            {availableSlots.map(function (slot) { return (<li key={slot.id} className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100" onClick={function () { return setSelectedSlot(slot.id); }}>
                <span>{slot.startTime} - {slot.endTime}</span>
                {selectedSlot === slot.id && <span className="text-green-500">Selected</span>}
              </li>); })}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <input type="text" placeholder="Enter your name" value={appointmentDetails.patientName} onChange={function (e) { return setAppointmentDetails(__assign(__assign({}, appointmentDetails), { patientName: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded mb-4"/>
          <textarea placeholder="Reason for the appointment" value={appointmentDetails.reason} onChange={function (e) { return setAppointmentDetails(__assign(__assign({}, appointmentDetails), { reason: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded mb-4"></textarea>

          <button onClick={handleBooking} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Book Appointment
          </button>
        </div>
      </div>
    </div>);
};
exports.default = BookingSystem;
var BookingSystem = function () {
    var _a = (0, react_1.useState)([]), availableSlots = _a[0], setAvailableSlots = _a[1];
    var _b = (0, react_1.useState)(null), selectedSlot = _b[0], setSelectedSlot = _b[1];
    var _c = (0, react_1.useState)({
        patientName: '',
        reason: ''
    }), appointmentDetails = _c[0], setAppointmentDetails = _c[1];
    (0, react_1.useEffect)(function () {
        var loadAvailableSlots = function () { return __awaiter(void 0, void 0, void 0, function () {
            var slots;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, appointmentApi_1.fetchAvailableSlots)()];
                    case 1:
                        slots = _a.sent();
                        setAvailableSlots(slots);
                        return [2 /*return*/];
                }
            });
        }); };
        loadAvailableSlots();
    }, []);
    var handleBooking = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(selectedSlot && appointmentDetails.patientName && appointmentDetails.reason)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, appointmentApi_1.bookAppointment)(selectedSlot, appointmentDetails)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        alert('Appointment booked successfully!');
                    }
                    else {
                        alert('Failed to book appointment.');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    alert('Please fill in all details and select a slot.');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Book an Appointment</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Select an Available Slot</h2>
          <ul className="space-y-3">
            {availableSlots.map(function (slot) { return (<li key={slot.id} className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100" onClick={function () { return setSelectedSlot(slot.id); }}>
                <span>{slot.startTime} - {slot.endTime}</span>
                {selectedSlot === slot.id && <span className="text-green-500">Selected</span>}
              </li>); })}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <input type="text" placeholder="Enter your name" value={appointmentDetails.patientName} onChange={function (e) { return setAppointmentDetails(__assign(__assign({}, appointmentDetails), { patientName: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded mb-4"/>
          <textarea placeholder="Reason for the appointment" value={appointmentDetails.reason} onChange={function (e) { return setAppointmentDetails(__assign(__assign({}, appointmentDetails), { reason: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded mb-4"></textarea>

          <button onClick={handleBooking} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Book Appointment
          </button>
        </div>
      </div>
    </div>);
};
exports.default = BookingSystem;
var BookingSystem = function () {
    var _a = (0, react_1.useState)([]), availableSlots = _a[0], setAvailableSlots = _a[1];
    var _b = (0, react_1.useState)(null), selectedSlot = _b[0], setSelectedSlot = _b[1];
    var _c = (0, react_1.useState)({
        patientName: '',
        reason: ''
    }), appointmentDetails = _c[0], setAppointmentDetails = _c[1];
    (0, react_1.useEffect)(function () {
        var loadAvailableSlots = function () { return __awaiter(void 0, void 0, void 0, function () {
            var slots;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, appointmentApi_1.fetchAvailableSlots)()];
                    case 1:
                        slots = _a.sent();
                        setAvailableSlots(slots);
                        return [2 /*return*/];
                }
            });
        }); };
        loadAvailableSlots();
    }, []);
    var handleBooking = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(selectedSlot && appointmentDetails.patientName && appointmentDetails.reason)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, appointmentApi_1.bookAppointment)(selectedSlot, appointmentDetails)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        alert('Appointment booked successfully!');
                    }
                    else {
                        alert('Failed to book appointment.');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    alert('Please fill in all details and select a slot.');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Book an Appointment</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Select an Available Slot</h2>
          <ul className="space-y-3">
            {availableSlots.map(function (slot) { return (<li key={slot.id} className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100" onClick={function () { return setSelectedSlot(slot.id); }}>
                <span>{slot.startTime} - {slot.endTime}</span>
                {selectedSlot === slot.id && <span className="text-green-500">Selected</span>}
              </li>); })}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <input type="text" placeholder="Enter your name" value={appointmentDetails.patientName} onChange={function (e) { return setAppointmentDetails(__assign(__assign({}, appointmentDetails), { patientName: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded mb-4"/>
          <textarea placeholder="Reason for the appointment" value={appointmentDetails.reason} onChange={function (e) { return setAppointmentDetails(__assign(__assign({}, appointmentDetails), { reason: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded mb-4"></textarea>

          <button onClick={handleBooking} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Book Appointment
          </button>
        </div>
      </div>
    </div>);
};
exports.default = BookingSystem;
