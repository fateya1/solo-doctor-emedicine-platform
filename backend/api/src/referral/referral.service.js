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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer = require("nodemailer");
// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function generateReferralCode() {
    var date = new Date();
    var datePart = "".concat(date.getFullYear()).concat(String(date.getMonth() + 1).padStart(2, "0")).concat(String(date.getDate()).padStart(2, "0"));
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var random = Array.from({ length: 5 }, function () { return chars[Math.floor(Math.random() * chars.length)]; }).join("");
    return "REF-".concat(datePart, "-").concat(random);
}
function sendReferralEmail(to, subject, html) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, e_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST,
                        port: Number((_a = process.env.SMTP_PORT) !== null && _a !== void 0 ? _a : 587),
                        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
                    });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, transporter.sendMail({
                            from: (_b = process.env.SMTP_FROM) !== null && _b !== void 0 ? _b : "no-reply@platform.com",
                            to: to,
                            subject: subject,
                            html: html,
                        })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    console.error("Referral email failed:", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// â”€â”€ Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
var ReferralService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReferralService = _classThis = /** @class */ (function () {
        function ReferralService_1(prisma) {
            this.prisma = prisma;
        }
        // Doctor creates referral for a patient
        ReferralService_1.prototype.createReferral = function (doctorUserId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor, patient, referralCode, i, collision, referral, specialist;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({
                                where: { userId: doctorUserId },
                                include: { user: true },
                            })];
                        case 1:
                            doctor = _f.sent();
                            if (!doctor)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.patientProfile.findUnique({
                                    where: { id: dto.patientId },
                                    include: { user: true },
                                })];
                        case 2:
                            patient = _f.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient not found");
                            referralCode = generateReferralCode();
                            i = 0;
                            _f.label = 3;
                        case 3:
                            if (!(i < 5)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.referral.findUnique({ where: { referralCode: referralCode } })];
                        case 4:
                            collision = _f.sent();
                            if (!collision)
                                return [3 /*break*/, 6];
                            referralCode = generateReferralCode();
                            _f.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 3];
                        case 6: return [4 /*yield*/, this.prisma.referral.create({
                                data: {
                                    referralCode: referralCode,
                                    referringDoctorId: doctor.id,
                                    patientId: dto.patientId,
                                    specialistId: (_a = dto.specialistId) !== null && _a !== void 0 ? _a : null,
                                    speciality: dto.speciality.trim(),
                                    reason: dto.reason.trim(),
                                    notes: (_c = (_b = dto.notes) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : null,
                                    urgency: (_d = dto.urgency) !== null && _d !== void 0 ? _d : "ROUTINE",
                                    status: "PENDING",
                                },
                                include: this.referralInclude(),
                            })];
                        case 7:
                            referral = _f.sent();
                            return [4 /*yield*/, this.createNotification(patient.userId, "New Referral", "Dr. ".concat(doctor.user.fullName, " referred you to a ").concat(dto.speciality, " specialist."), "REFERRAL", referral.id)];
                        case 8:
                            _f.sent();
                            if (!dto.specialistId) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.prisma.doctorProfile.findUnique({
                                    where: { id: dto.specialistId },
                                    include: { user: true },
                                })];
                        case 9:
                            specialist = _f.sent();
                            if (!specialist) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.createNotification(specialist.userId, "Incoming Referral", "Dr. ".concat(doctor.user.fullName, " referred a patient to you (").concat(dto.speciality, ")."), "REFERRAL", referral.id)];
                        case 10:
                            _f.sent();
                            return [4 /*yield*/, sendReferralEmail(specialist.user.email, "New Referral \u00E2\u20AC\u201D ".concat(referral.referralCode), "<p>Dr. <strong>".concat(doctor.user.fullName, "</strong> has referred a patient to you.</p>\n           <p><strong>Speciality:</strong> ").concat(dto.speciality, "</p>\n           <p><strong>Reason:</strong> ").concat(dto.reason, "</p>\n           <p><strong>Urgency:</strong> ").concat((_e = dto.urgency) !== null && _e !== void 0 ? _e : "ROUTINE", "</p>\n           <p><strong>Referral Code:</strong> ").concat(referralCode, "</p>"))];
                        case 11:
                            _f.sent();
                            _f.label = 12;
                        case 12: return [4 /*yield*/, sendReferralEmail(patient.user.email, "You have a new referral \u00E2\u20AC\u201D ".concat(referralCode), "<p>Dr. <strong>".concat(doctor.user.fullName, "</strong> has referred you to a <strong>").concat(dto.speciality, "</strong> specialist.</p>\n       <p><strong>Reason:</strong> ").concat(dto.reason, "</p>\n       <p><strong>Referral Code:</strong> ").concat(referralCode, "</p>\n       <p>Log in to your patient portal to view and book your referral appointment.</p>"))];
                        case 13:
                            _f.sent();
                            return [2 /*return*/, referral];
                    }
                });
            });
        };
        // Patient requests a referral (doctor must approve)
        ReferralService_1.prototype.requestReferral = function (patientUserId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, lastAppt, doctor, referralCode, i, collision, referral;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({
                                where: { userId: patientUserId },
                                include: { user: true },
                            })];
                        case 1:
                            patient = _c.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findFirst({
                                    where: { patientId: patient.id, status: { in: ["CONFIRMED", "COMPLETED"] } },
                                    orderBy: { createdAt: "desc" },
                                    include: { availabilitySlot: { include: { doctor: { include: { user: true } } } } },
                                })];
                        case 2:
                            lastAppt = _c.sent();
                            if (!lastAppt) {
                                throw new common_1.BadRequestException("No prior appointment found. You need to have seen a doctor first to request a referral.");
                            }
                            doctor = lastAppt.availabilitySlot.doctor;
                            referralCode = generateReferralCode();
                            i = 0;
                            _c.label = 3;
                        case 3:
                            if (!(i < 5)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.referral.findUnique({ where: { referralCode: referralCode } })];
                        case 4:
                            collision = _c.sent();
                            if (!collision)
                                return [3 /*break*/, 6];
                            referralCode = generateReferralCode();
                            _c.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 3];
                        case 6: return [4 /*yield*/, this.prisma.referral.create({
                                data: {
                                    referralCode: referralCode,
                                    referringDoctorId: doctor.id,
                                    patientId: patient.id,
                                    speciality: dto.speciality.trim(),
                                    reason: dto.reason.trim(),
                                    notes: (_b = (_a = dto.notes) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : null,
                                    status: "REQUESTED",
                                    requestedByPatient: true,
                                },
                                include: this.referralInclude(),
                            })];
                        case 7:
                            referral = _c.sent();
                            return [4 /*yield*/, this.createNotification(doctor.userId, "Referral Request", "".concat(patient.user.fullName, " is requesting a referral to a ").concat(dto.speciality, " specialist."), "REFERRAL", referral.id)];
                        case 8:
                            _c.sent();
                            return [2 /*return*/, referral];
                    }
                });
            });
        };
        // Doctor approves a patient-requested referral
        ReferralService_1.prototype.approveReferral = function (doctorUserId, referralId, specialistId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor, referral, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({
                                where: { userId: doctorUserId },
                                include: { user: true },
                            })];
                        case 1:
                            doctor = _a.sent();
                            if (!doctor)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.referral.findUnique({
                                    where: { id: referralId },
                                    include: { patient: { include: { user: true } } },
                                })];
                        case 2:
                            referral = _a.sent();
                            if (!referral)
                                throw new common_1.NotFoundException("Referral not found");
                            if (referral.referringDoctorId !== doctor.id)
                                throw new common_1.ForbiddenException("Not your referral");
                            if (referral.status !== "REQUESTED")
                                throw new common_1.BadRequestException("Referral is not in REQUESTED state");
                            return [4 /*yield*/, this.prisma.referral.update({
                                    where: { id: referralId },
                                    data: { status: "PENDING", specialistId: specialistId !== null && specialistId !== void 0 ? specialistId : null, approvedAt: new Date() },
                                    include: this.referralInclude(),
                                })];
                        case 3:
                            updated = _a.sent();
                            return [4 /*yield*/, this.createNotification(referral.patient.userId, "Referral Approved", "Dr. ".concat(doctor.user.fullName, " approved your referral request for ").concat(referral.speciality, "."), "REFERRAL", referral.id)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, sendReferralEmail(referral.patient.user.email, "Your referral request was approved \u00E2\u20AC\u201D ".concat(referral.referralCode), "<p>Dr. <strong>".concat(doctor.user.fullName, "</strong> has approved your referral to a <strong>").concat(referral.speciality, "</strong> specialist.</p>\n       <p><strong>Referral Code:</strong> ").concat(referral.referralCode, "</p>\n       <p>Log in to book your specialist appointment.</p>"))];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        // Doctor rejects a patient-requested referral
        ReferralService_1.prototype.rejectReferral = function (doctorUserId, referralId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor, referral;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } })];
                        case 1:
                            doctor = _a.sent();
                            if (!doctor)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.referral.findUnique({
                                    where: { id: referralId },
                                    include: { patient: { include: { user: true } } },
                                })];
                        case 2:
                            referral = _a.sent();
                            if (!referral)
                                throw new common_1.NotFoundException("Referral not found");
                            if (referral.referringDoctorId !== doctor.id)
                                throw new common_1.ForbiddenException("Not your referral");
                            return [2 /*return*/, this.prisma.referral.update({
                                    where: { id: referralId },
                                    data: { status: "REJECTED" },
                                    include: this.referralInclude(),
                                })];
                    }
                });
            });
        };
        // Doctor books appointment on patient's behalf
        ReferralService_1.prototype.bookReferralAppointment = function (doctorUserId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor, referral, slot, appointment;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({
                                where: { userId: doctorUserId },
                                include: { user: true },
                            })];
                        case 1:
                            doctor = _b.sent();
                            if (!doctor)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.referral.findUnique({
                                    where: { id: dto.referralId },
                                    include: { patient: { include: { user: true } } },
                                })];
                        case 2:
                            referral = _b.sent();
                            if (!referral)
                                throw new common_1.NotFoundException("Referral not found");
                            if (referral.referringDoctorId !== doctor.id)
                                throw new common_1.ForbiddenException("Not your referral");
                            if (!["PENDING", "ACCEPTED"].includes(referral.status)) {
                                throw new common_1.BadRequestException("Referral must be PENDING or ACCEPTED to book");
                            }
                            return [4 /*yield*/, this.prisma.availabilitySlot.findUnique({ where: { id: dto.availabilitySlotId } })];
                        case 3:
                            slot = _b.sent();
                            if (!slot)
                                throw new common_1.NotFoundException("Availability slot not found");
                            if (!slot.isAvailable)
                                throw new common_1.BadRequestException("Slot is no longer available");
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var appt;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.appointment.create({
                                                    data: {
                                                        patientId: referral.patientId,
                                                        slotId: dto.availabilitySlotId,
                                                        status: "CONFIRMED",
                                                        notes: "Referral: ".concat(referral.referralCode, " \u00E2\u20AC\u201D ").concat(referral.reason),
                                                    },
                                                })];
                                            case 1:
                                                appt = _a.sent();
                                                return [4 /*yield*/, tx.availabilitySlot.update({
                                                        where: { id: dto.availabilitySlotId },
                                                        data: { isAvailable: false },
                                                    })];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, tx.referral.update({
                                                        where: { id: dto.referralId },
                                                        data: { status: "BOOKED", appointmentId: appt.id },
                                                    })];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/, appt];
                                        }
                                    });
                                }); })];
                        case 4:
                            appointment = _b.sent();
                            return [4 /*yield*/, this.createNotification(referral.patient.userId, "Referral Appointment Booked", "Your referral appointment has been booked. Referral: ".concat(referral.referralCode), "REFERRAL", referral.id)];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, sendReferralEmail(referral.patient.user.email, "Referral appointment booked \u00E2\u20AC\u201D ".concat(referral.referralCode), "<p>Your referral appointment has been booked by Dr. <strong>".concat((_a = doctor.user) === null || _a === void 0 ? void 0 : _a.fullName, "</strong>.</p>\n       <p>Check your appointments tab for full details.</p>"))];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, appointment];
                    }
                });
            });
        };
        ReferralService_1.prototype.getPatientReferrals = function (patientUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var patient;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: patientUserId } })];
                        case 1:
                            patient = _a.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [2 /*return*/, this.prisma.referral.findMany({
                                    where: { patientId: patient.id },
                                    include: this.referralInclude(),
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        ReferralService_1.prototype.getDoctorReferrals = function (doctorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } })];
                        case 1:
                            doctor = _a.sent();
                            if (!doctor)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [2 /*return*/, this.prisma.referral.findMany({
                                    where: { referringDoctorId: doctor.id },
                                    include: this.referralInclude(),
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        ReferralService_1.prototype.getSpecialistReferrals = function (specialistUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var specialist;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: specialistUserId } })];
                        case 1:
                            specialist = _a.sent();
                            if (!specialist)
                                throw new common_1.NotFoundException("Specialist profile not found");
                            return [2 /*return*/, this.prisma.referral.findMany({
                                    where: { specialistId: specialist.id },
                                    include: this.referralInclude(),
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        ReferralService_1.prototype.getDoctors = function (speciality) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.doctorProfile.findMany({
                            where: speciality
                                ? { specialty: { contains: speciality, mode: "insensitive" } }
                                : undefined,
                            include: { user: { select: { fullName: true, email: true } } },
                            orderBy: { user: { fullName: "asc" } },
                        })];
                });
            });
        };
        ReferralService_1.prototype.referralInclude = function () {
            return {
                referringDoctor: { include: { user: { select: { fullName: true, email: true } } } },
                specialist: { include: { user: { select: { fullName: true, email: true } } } },
                patient: { include: { user: { select: { fullName: true, email: true } } } },
                appointment: true,
            };
        };
        ReferralService_1.prototype.createNotification = function (userId, title, message, type, referenceId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.notification.create({
                                    data: { userId: userId, title: title, message: message, type: type, referenceId: referenceId, isRead: false },
                                })];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ReferralService_1;
    }());
    __setFunctionName(_classThis, "ReferralService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReferralService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReferralService = _classThis;
}();
exports.ReferralService = ReferralService;
