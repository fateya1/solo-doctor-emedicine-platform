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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.AppointmentsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var AppointmentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppointmentsService = _classThis = /** @class */ (function () {
        function AppointmentsService_1(prisma, emailService, auditService, smsService, revenueService) {
            this.prisma = prisma;
            this.emailService = emailService;
            this.auditService = auditService;
            this.smsService = smsService;
            this.revenueService = revenueService;
            this.logger = new common_1.Logger(AppointmentsService.name);
        }
        AppointmentsService_1.prototype.bookSlot = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var slot, patientProfile, appointment, dateStr;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, tx.availabilitySlot.findUnique({
                                            where: { id: dto.slotId },
                                            include: { appointment: true, doctor: { include: { user: true } } },
                                        })];
                                    case 1:
                                        slot = _b.sent();
                                        if (!slot)
                                            throw new common_1.NotFoundException("Availability slot not found");
                                        if (!slot.isAvailable || slot.appointment) {
                                            throw new common_1.BadRequestException("This slot is no longer available");
                                        }
                                        return [4 /*yield*/, tx.patientProfile.findUnique({
                                                where: { userId: userId },
                                                include: { user: true },
                                            })];
                                    case 2:
                                        patientProfile = _b.sent();
                                        if (!patientProfile)
                                            throw new common_1.NotFoundException("Patient profile not found");
                                        return [4 /*yield*/, tx.appointment.create({
                                                data: {
                                                    patientId: patientProfile.id,
                                                    slotId: slot.id,
                                                    reason: (_a = dto.reason) !== null && _a !== void 0 ? _a : null,
                                                    status: client_1.AppointmentStatus.CONFIRMED,
                                                },
                                            })];
                                    case 3:
                                        appointment = _b.sent();
                                        return [4 /*yield*/, tx.availabilitySlot.update({
                                                where: { id: slot.id },
                                                data: { isAvailable: false },
                                            })];
                                    case 4:
                                        _b.sent();
                                        dateStr = slot.startTime.toLocaleString("en-KE", {
                                            dateStyle: "full",
                                            timeStyle: "short",
                                        });
                                        this.emailService.sendAppointmentConfirmation(patientProfile.user.email, patientProfile.user.fullName, slot.doctor.user.fullName, slot.startTime, dto.reason).catch(function () { });
                                        this.emailService.sendAppointmentNotificationToDoctor(slot.doctor.user.email, slot.doctor.user.fullName, patientProfile.user.fullName, slot.startTime, dto.reason).catch(function () { });
                                        if (patientProfile.phone) {
                                            this.smsService.sendAppointmentConfirmationSms(patientProfile.phone, patientProfile.user.fullName, slot.doctor.user.fullName, dateStr).catch(function () { });
                                        }
                                        this.logger.log("Appointment booked: " + appointment.id);
                                        this.auditService.log({
                                            userId: userId,
                                            action: "APPOINTMENT_BOOKED",
                                            entity: "Appointment",
                                            entityId: appointment.id,
                                            metadata: { slotId: dto.slotId, reason: dto.reason },
                                        }).catch(function () { });
                                        return [2 /*return*/, appointment];
                                }
                            });
                        }); })];
                });
            });
        };
        AppointmentsService_1.prototype.getPatientAppointments = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _a.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [2 /*return*/, this.prisma.appointment.findMany({
                                    where: { patientId: patientProfile.id },
                                    include: {
                                        availabilitySlot: { include: { doctor: { include: { user: true } } } },
                                        prescription: true,
                                        review: true,
                                        intakeForm: { select: { id: true, createdAt: true, updatedAt: true } },
                                    },
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.getDoctorAppointments = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _a.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [2 /*return*/, this.prisma.appointment.findMany({
                                    where: { availabilitySlot: { doctorId: doctorProfile.id } },
                                    include: {
                                        availabilitySlot: true,
                                        prescription: true,
                                        intakeForm: true,
                                        patient: {
                                            include: {
                                                user: { select: { fullName: true, email: true } },
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.updateAppointmentStatus = function (appointmentId, userId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile, appointment, updated, patientProfile, dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _a.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: appointmentId },
                                    include: {
                                        availabilitySlot: true,
                                        patient: { include: { user: true } },
                                    },
                                })];
                        case 2:
                            appointment = _a.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
                                throw new common_1.BadRequestException("Not authorized to update this appointment");
                            }
                            return [4 /*yield*/, this.prisma.appointment.update({
                                    where: { id: appointmentId },
                                    data: __assign({ status: status }, (status === client_1.AppointmentStatus.CANCELLED ? { cancelledAt: new Date() } : {})),
                                })];
                        case 3:
                            updated = _a.sent();
                            // Auto-record commission when appointment completed
                            if (status === client_1.AppointmentStatus.COMPLETED) {
                                this.revenueService.recordCommission(appointmentId).catch(function () { });
                            }
                            if (status === client_1.AppointmentStatus.COMPLETED) {
                                this.revenueService.recordCommission(appointmentId).catch(function () { });
                            }
                            if (!(status === client_1.AppointmentStatus.CANCELLED)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.availabilitySlot.update({
                                    where: { id: appointment.slotId },
                                    data: { isAvailable: true },
                                })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.patientProfile.findUnique({
                                    where: { id: appointment.patientId },
                                    include: { user: true },
                                })];
                        case 5:
                            patientProfile = _a.sent();
                            if (patientProfile === null || patientProfile === void 0 ? void 0 : patientProfile.phone) {
                                dateStr = appointment.availabilitySlot.startTime.toLocaleString("en-KE", {
                                    dateStyle: "full", timeStyle: "short",
                                });
                                this.smsService.sendAppointmentCancellationSms(patientProfile.phone, patientProfile.user.fullName, dateStr).catch(function () { });
                            }
                            _a.label = 6;
                        case 6: return [2 /*return*/, updated];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.scheduleFollowUp = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile, original;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _b.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: dto.appointmentId },
                                    include: {
                                        availabilitySlot: true,
                                        patient: { include: { user: true } },
                                    },
                                })];
                        case 2:
                            original = _b.sent();
                            if (!original)
                                throw new common_1.NotFoundException("Original appointment not found");
                            if (original.availabilitySlot.doctorId !== doctorProfile.id) {
                                throw new common_1.BadRequestException("Not authorized to schedule follow-up for this appointment");
                            }
                            // Book the follow-up slot
                            return [2 /*return*/, this.bookSlot(original.patient.userId, {
                                    slotId: dto.slotId,
                                    reason: (_a = dto.reason) !== null && _a !== void 0 ? _a : "Follow-up appointment",
                                })];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.cancelAppointment = function (appointmentId, userId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile, appointment;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({
                                where: { userId: userId },
                                include: { user: true },
                            })];
                        case 1:
                            patientProfile = _a.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: appointmentId },
                                    include: {
                                        availabilitySlot: { include: { doctor: { include: { user: true } } } },
                                        patient: { include: { user: true } },
                                    },
                                })];
                        case 2:
                            appointment = _a.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.patientId !== patientProfile.id) {
                                throw new common_1.BadRequestException("Not authorized to cancel this appointment");
                            }
                            if (appointment.status === client_1.AppointmentStatus.CANCELLED) {
                                throw new common_1.BadRequestException("Appointment already cancelled");
                            }
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var cancelled, dateStr;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.appointment.update({
                                                    where: { id: appointmentId },
                                                    data: {
                                                        status: client_1.AppointmentStatus.CANCELLED,
                                                        cancelledAt: new Date(),
                                                        cancelReason: reason !== null && reason !== void 0 ? reason : null,
                                                    },
                                                })];
                                            case 1:
                                                cancelled = _a.sent();
                                                return [4 /*yield*/, tx.availabilitySlot.update({
                                                        where: { id: appointment.slotId },
                                                        data: { isAvailable: true },
                                                    })];
                                            case 2:
                                                _a.sent();
                                                dateStr = appointment.availabilitySlot.startTime.toLocaleString("en-KE", {
                                                    dateStyle: "full", timeStyle: "short",
                                                });
                                                this.emailService.sendAppointmentCancellation(appointment.patient.user.email, appointment.patient.user.fullName, "PATIENT", appointment.availabilitySlot.startTime).catch(function () { });
                                                this.emailService.sendAppointmentCancellation(appointment.availabilitySlot.doctor.user.email, appointment.availabilitySlot.doctor.user.fullName, "DOCTOR", appointment.availabilitySlot.startTime).catch(function () { });
                                                if (patientProfile.phone) {
                                                    this.smsService.sendAppointmentCancellationSms(patientProfile.phone, patientProfile.user.fullName, dateStr).catch(function () { });
                                                }
                                                return [2 /*return*/, cancelled];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        return AppointmentsService_1;
    }());
    __setFunctionName(_classThis, "AppointmentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppointmentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppointmentsService = _classThis;
}();
exports.AppointmentsService = AppointmentsService;
