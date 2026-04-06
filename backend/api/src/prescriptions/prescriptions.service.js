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
exports.PrescriptionsService = void 0;
var common_1 = require("@nestjs/common");
var PrescriptionsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PrescriptionsService = _classThis = /** @class */ (function () {
        function PrescriptionsService_1(prisma, auditService) {
            this.prisma = prisma;
            this.auditService = auditService;
        }
        PrescriptionsService_1.prototype.createPrescription = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile, appointment;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _e.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: dto.appointmentId },
                                    include: {
                                        availabilitySlot: true,
                                        prescription: true,
                                        patient: { include: { user: true } },
                                    },
                                })];
                        case 2:
                            appointment = _e.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
                                throw new common_1.ForbiddenException("Not authorized for this appointment");
                            }
                            if (!["CONFIRMED", "COMPLETED"].includes(appointment.status)) {
                                throw new common_1.BadRequestException("Prescription can only be created for confirmed or completed appointments");
                            }
                            if (appointment.prescription) {
                                // Update existing prescription
                                return [2 /*return*/, this.prisma.prescription.update({
                                        where: { appointmentId: dto.appointmentId },
                                        data: {
                                            medications: dto.medications,
                                            diagnosis: (_a = dto.diagnosis) !== null && _a !== void 0 ? _a : null,
                                            notes: (_b = dto.notes) !== null && _b !== void 0 ? _b : null,
                                            validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
                                        },
                                        include: {
                                            doctorProfile: { include: { user: { select: { fullName: true } } } },
                                            patientProfile: { include: { user: { select: { fullName: true, email: true } } } },
                                        },
                                    })];
                            }
                            return [2 /*return*/, this.prisma.prescription.create({
                                    data: {
                                        appointmentId: dto.appointmentId,
                                        doctorProfileId: doctorProfile.id,
                                        patientProfileId: appointment.patientId,
                                        medications: dto.medications,
                                        diagnosis: (_c = dto.diagnosis) !== null && _c !== void 0 ? _c : null,
                                        notes: (_d = dto.notes) !== null && _d !== void 0 ? _d : null,
                                        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
                                    },
                                    include: {
                                        doctorProfile: { include: { user: { select: { fullName: true } } } },
                                        patientProfile: { include: { user: { select: { fullName: true, email: true } } } },
                                    },
                                })];
                    }
                });
            });
        };
        PrescriptionsService_1.prototype.getPrescriptionByAppointment = function (userId, appointmentId, role) {
            return __awaiter(this, void 0, void 0, function () {
                var prescription, doctorProfile, patientProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.prescription.findUnique({
                                where: { appointmentId: appointmentId },
                                include: {
                                    doctorProfile: {
                                        include: { user: { select: { fullName: true } } },
                                    },
                                    patientProfile: {
                                        include: { user: { select: { fullName: true, email: true } } },
                                    },
                                    appointment: {
                                        include: { availabilitySlot: true },
                                    },
                                },
                            })];
                        case 1:
                            prescription = _a.sent();
                            if (!prescription)
                                throw new common_1.NotFoundException("Prescription not found");
                            if (!(role === "DOCTOR")) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 2:
                            doctorProfile = _a.sent();
                            if (prescription.doctorProfileId !== (doctorProfile === null || doctorProfile === void 0 ? void 0 : doctorProfile.id)) {
                                throw new common_1.ForbiddenException("Not authorized");
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            if (!(role === "PATIENT")) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 4:
                            patientProfile = _a.sent();
                            if (prescription.patientProfileId !== (patientProfile === null || patientProfile === void 0 ? void 0 : patientProfile.id)) {
                                throw new common_1.ForbiddenException("Not authorized");
                            }
                            _a.label = 5;
                        case 5: return [2 /*return*/, prescription];
                    }
                });
            });
        };
        PrescriptionsService_1.prototype.getPatientPrescriptions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _a.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [2 /*return*/, this.prisma.prescription.findMany({
                                    where: { patientProfileId: patientProfile.id },
                                    include: {
                                        doctorProfile: { include: { user: { select: { fullName: true } } } },
                                        appointment: { include: { availabilitySlot: true } },
                                    },
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        PrescriptionsService_1.prototype.getDoctorPrescriptions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _a.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [2 /*return*/, this.prisma.prescription.findMany({
                                    where: { doctorProfileId: doctorProfile.id },
                                    include: {
                                        patientProfile: { include: { user: { select: { fullName: true } } } },
                                        appointment: { include: { availabilitySlot: true } },
                                    },
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        return PrescriptionsService_1;
    }());
    __setFunctionName(_classThis, "PrescriptionsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrescriptionsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrescriptionsService = _classThis;
}();
exports.PrescriptionsService = PrescriptionsService;
