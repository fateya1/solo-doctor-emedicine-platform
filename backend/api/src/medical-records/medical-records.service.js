"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordsService = void 0;
var common_1 = require("@nestjs/common");
var MedicalRecordsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MedicalRecordsService = _classThis = /** @class */ (function () {
        function MedicalRecordsService_1(prisma) {
            this.prisma = prisma;
        }
        MedicalRecordsService_1.prototype.saveConsultationNote = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile, appointment;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _l.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: dto.appointmentId },
                                    include: { availabilitySlot: true, consultationNote: true },
                                })];
                        case 2:
                            appointment = _l.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
                                throw new common_1.ForbiddenException("Not authorized for this appointment");
                            }
                            if (!["CONFIRMED", "COMPLETED"].includes(appointment.status)) {
                                throw new common_1.BadRequestException("Notes can only be added to confirmed or completed appointments");
                            }
                            if (appointment.consultationNote) {
                                return [2 /*return*/, this.prisma.consultationNote.update({
                                        where: { appointmentId: dto.appointmentId },
                                        data: {
                                            subjective: (_a = dto.subjective) !== null && _a !== void 0 ? _a : null,
                                            objective: (_b = dto.objective) !== null && _b !== void 0 ? _b : null,
                                            assessment: (_c = dto.assessment) !== null && _c !== void 0 ? _c : null,
                                            plan: (_d = dto.plan) !== null && _d !== void 0 ? _d : null,
                                            privateNotes: (_e = dto.privateNotes) !== null && _e !== void 0 ? _e : null,
                                        },
                                    })];
                            }
                            return [2 /*return*/, this.prisma.consultationNote.create({
                                    data: {
                                        appointmentId: dto.appointmentId,
                                        doctorProfileId: doctorProfile.id,
                                        patientProfileId: appointment.patientId,
                                        subjective: (_f = dto.subjective) !== null && _f !== void 0 ? _f : null,
                                        objective: (_g = dto.objective) !== null && _g !== void 0 ? _g : null,
                                        assessment: (_h = dto.assessment) !== null && _h !== void 0 ? _h : null,
                                        plan: (_j = dto.plan) !== null && _j !== void 0 ? _j : null,
                                        privateNotes: (_k = dto.privateNotes) !== null && _k !== void 0 ? _k : null,
                                    },
                                })];
                    }
                });
            });
        };
        MedicalRecordsService_1.prototype.getConsultationNote = function (userId, appointmentId, role) {
            return __awaiter(this, void 0, void 0, function () {
                var note, doctorProfile, patientProfile, privateNotes, publicNote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.consultationNote.findUnique({
                                where: { appointmentId: appointmentId },
                                include: {
                                    doctorProfile: { include: { user: { select: { fullName: true } } } },
                                    appointment: { include: { availabilitySlot: true } },
                                },
                            })];
                        case 1:
                            note = _a.sent();
                            if (!note)
                                throw new common_1.NotFoundException("No consultation note found");
                            if (!(role === "DOCTOR")) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 2:
                            doctorProfile = _a.sent();
                            if (note.doctorProfileId !== (doctorProfile === null || doctorProfile === void 0 ? void 0 : doctorProfile.id))
                                throw new common_1.ForbiddenException("Not authorized");
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 4:
                            patientProfile = _a.sent();
                            if (note.patientProfileId !== (patientProfile === null || patientProfile === void 0 ? void 0 : patientProfile.id))
                                throw new common_1.ForbiddenException("Not authorized");
                            privateNotes = note.privateNotes, publicNote = __rest(note, ["privateNotes"]);
                            return [2 /*return*/, publicNote];
                        case 5: return [2 /*return*/, note];
                    }
                });
            });
        };
        MedicalRecordsService_1.prototype.getPatientMedicalHistory = function (userId, patientUserId, requestingRole) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile, appointments;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(requestingRole === "DOCTOR" && patientUserId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.patientProfile.findUnique({
                                    where: { userId: patientUserId },
                                    include: { user: { select: { fullName: true, email: true } } },
                                })];
                        case 1:
                            patientProfile = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.prisma.patientProfile.findUnique({
                                where: { userId: userId },
                                include: { user: { select: { fullName: true, email: true } } },
                            })];
                        case 3:
                            patientProfile = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findMany({
                                    where: { patientId: patientProfile.id },
                                    include: {
                                        availabilitySlot: { include: { doctor: { include: { user: { select: { fullName: true } } } } } },
                                        consultationNote: requestingRole === "DOCTOR" ? true : {
                                            select: {
                                                id: true, subjective: true, objective: true,
                                                assessment: true, plan: true, createdAt: true,
                                            },
                                        },
                                        prescription: {
                                            select: {
                                                id: true, diagnosis: true, medications: true,
                                                validUntil: true, createdAt: true,
                                            },
                                        },
                                        review: { select: { rating: true, comment: true } },
                                    },
                                    orderBy: { createdAt: "desc" },
                                })];
                        case 5:
                            appointments = _a.sent();
                            return [2 /*return*/, {
                                    patient: patientProfile,
                                    totalAppointments: appointments.length,
                                    completedAppointments: appointments.filter(function (a) { return a.status === "COMPLETED"; }).length,
                                    appointments: appointments,
                                }];
                    }
                });
            });
        };
        MedicalRecordsService_1.prototype.getDoctorPatientList = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile, appointments, patientMap, _i, appointments_1, appt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _a.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findMany({
                                    where: { availabilitySlot: { doctorId: doctorProfile.id } },
                                    include: {
                                        patient: { include: { user: { select: { fullName: true, email: true } } } },
                                        availabilitySlot: true,
                                    },
                                    orderBy: { createdAt: "desc" },
                                })];
                        case 2:
                            appointments = _a.sent();
                            patientMap = new Map();
                            for (_i = 0, appointments_1 = appointments; _i < appointments_1.length; _i++) {
                                appt = appointments_1[_i];
                                if (!patientMap.has(appt.patientId)) {
                                    patientMap.set(appt.patientId, {
                                        id: appt.patientId,
                                        userId: appt.patient.userId,
                                        fullName: appt.patient.user.fullName,
                                        email: appt.patient.user.email,
                                        lastVisit: appt.availabilitySlot.startTime,
                                        totalVisits: 1,
                                    });
                                }
                                else {
                                    patientMap.get(appt.patientId).totalVisits++;
                                }
                            }
                            return [2 /*return*/, Array.from(patientMap.values())];
                    }
                });
            });
        };
        return MedicalRecordsService_1;
    }());
    __setFunctionName(_classThis, "MedicalRecordsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MedicalRecordsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MedicalRecordsService = _classThis;
}();
exports.MedicalRecordsService = MedicalRecordsService;
