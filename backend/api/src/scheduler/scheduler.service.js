"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
var common_1 = require("@nestjs/common");
var schedule_1 = require("@nestjs/schedule");
var SchedulerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _sendSubscriptionRenewalReminders_decorators;
    var _sendAppointmentReminders_decorators;
    var SchedulerService = _classThis = /** @class */ (function () {
        function SchedulerService_1(prisma, emailService, smsService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.emailService = emailService;
            this.smsService = smsService;
            this.logger = new common_1.Logger(SchedulerService.name);
        }
        // Runs every day at 8am — subscription renewal reminders
        SchedulerService_1.prototype.sendSubscriptionRenewalReminders = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, in7Days, in1Day, expiringSoon, _i, expiringSoon_1, sub, doctor, daysLeft;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Running subscription renewal reminder job...");
                            now = new Date();
                            in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                            in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, this.prisma.tenantSubscription.findMany({
                                    where: {
                                        status: "ACTIVE",
                                        currentPeriodEnd: { gte: in1Day, lte: in7Days },
                                    },
                                    include: {
                                        tenant: {
                                            include: {
                                                users: { where: { role: "DOCTOR", isActive: true }, take: 1 },
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            expiringSoon = _a.sent();
                            _i = 0, expiringSoon_1 = expiringSoon;
                            _a.label = 2;
                        case 2:
                            if (!(_i < expiringSoon_1.length)) return [3 /*break*/, 5];
                            sub = expiringSoon_1[_i];
                            doctor = sub.tenant.users[0];
                            if (!doctor)
                                return [3 /*break*/, 4];
                            daysLeft = Math.ceil((sub.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                            return [4 /*yield*/, this.emailService.sendSubscriptionRenewalReminder(doctor.email, doctor.fullName, sub.plan, sub.currentPeriodEnd, daysLeft).catch(function () { })];
                        case 3:
                            _a.sent();
                            this.logger.log("Renewal reminder sent to ".concat(doctor.email, " (").concat(daysLeft, " days left)"));
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, this.prisma.tenantSubscription.updateMany({
                                where: { status: "ACTIVE", currentPeriodEnd: { lt: now } },
                                data: { status: "EXPIRED" },
                            })];
                        case 6:
                            _a.sent();
                            this.logger.log("Subscription renewal reminder job complete.");
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Runs every hour — appointment reminders at 24hrs and 1hr before
        SchedulerService_1.prototype.sendAppointmentReminders = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, in24hrStart, in24hrEnd, in1hrStart, in1hrEnd, appointments, _i, appointments_1, appt, startTime, patientUser, patientPhone, doctorName, doctorEmail, dateStr, is24hr, is1hr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Running appointment reminder job...");
                            now = new Date();
                            in24hrStart = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);
                            in24hrEnd = new Date(now.getTime() + 24.5 * 60 * 60 * 1000);
                            in1hrStart = new Date(now.getTime() + 0.5 * 60 * 60 * 1000);
                            in1hrEnd = new Date(now.getTime() + 1.5 * 60 * 60 * 1000);
                            return [4 /*yield*/, this.prisma.appointment.findMany({
                                    where: {
                                        status: "CONFIRMED",
                                        availabilitySlot: {
                                            startTime: {
                                                gte: in1hrStart,
                                                lte: in24hrEnd,
                                            },
                                        },
                                    },
                                    include: {
                                        availabilitySlot: { include: { doctor: { include: { user: true } } } },
                                        patient: { include: { user: true } },
                                    },
                                })];
                        case 1:
                            appointments = _a.sent();
                            _i = 0, appointments_1 = appointments;
                            _a.label = 2;
                        case 2:
                            if (!(_i < appointments_1.length)) return [3 /*break*/, 10];
                            appt = appointments_1[_i];
                            startTime = appt.availabilitySlot.startTime;
                            patientUser = appt.patient.user;
                            patientPhone = appt.patient.phone;
                            doctorName = appt.availabilitySlot.doctor.user.fullName;
                            doctorEmail = appt.availabilitySlot.doctor.user.email;
                            dateStr = startTime.toLocaleString("en-KE", {
                                dateStyle: "full",
                                timeStyle: "short",
                            });
                            is24hr = startTime >= in24hrStart && startTime <= in24hrEnd;
                            is1hr = startTime >= in1hrStart && startTime <= in1hrEnd;
                            if (!is24hr) return [3 /*break*/, 6];
                            this.logger.log("Sending 24hr reminder for appointment ".concat(appt.id));
                            // Email to patient
                            return [4 /*yield*/, this.emailService.sendAppointmentReminder(patientUser.email, patientUser.fullName, doctorName, startTime, "24 hours").catch(function () { })];
                        case 3:
                            // Email to patient
                            _a.sent();
                            // Email to doctor
                            return [4 /*yield*/, this.emailService.sendAppointmentReminderToDoctor(doctorEmail, doctorName, patientUser.fullName, startTime, "24 hours").catch(function () { })];
                        case 4:
                            // Email to doctor
                            _a.sent();
                            if (!patientPhone) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.smsService.sendAppointmentReminder(patientPhone, patientUser.fullName, doctorName, dateStr).catch(function () { })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!is1hr) return [3 /*break*/, 9];
                            this.logger.log("Sending 1hr reminder for appointment ".concat(appt.id));
                            // Email to patient
                            return [4 /*yield*/, this.emailService.sendAppointmentReminder(patientUser.email, patientUser.fullName, doctorName, startTime, "1 hour").catch(function () { })];
                        case 7:
                            // Email to patient
                            _a.sent();
                            if (!patientPhone) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.smsService.sendAppointmentReminder(patientPhone, patientUser.fullName, doctorName, "in 1 hour (".concat(dateStr, ")")).catch(function () { })];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 2];
                        case 10:
                            this.logger.log("Appointment reminder job complete. Processed ".concat(appointments.length, " appointments."));
                            return [2 /*return*/];
                    }
                });
            });
        };
        return SchedulerService_1;
    }());
    __setFunctionName(_classThis, "SchedulerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _sendSubscriptionRenewalReminders_decorators = [(0, schedule_1.Cron)("0 8 * * *")];
        _sendAppointmentReminders_decorators = [(0, schedule_1.Cron)("0 * * * *")];
        __esDecorate(_classThis, null, _sendSubscriptionRenewalReminders_decorators, { kind: "method", name: "sendSubscriptionRenewalReminders", static: false, private: false, access: { has: function (obj) { return "sendSubscriptionRenewalReminders" in obj; }, get: function (obj) { return obj.sendSubscriptionRenewalReminders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendAppointmentReminders_decorators, { kind: "method", name: "sendAppointmentReminders", static: false, private: false, access: { has: function (obj) { return "sendAppointmentReminders" in obj; }, get: function (obj) { return obj.sendAppointmentReminders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SchedulerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SchedulerService = _classThis;
}();
exports.SchedulerService = SchedulerService;
