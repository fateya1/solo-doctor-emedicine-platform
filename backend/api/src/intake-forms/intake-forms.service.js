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
exports.IntakeFormsService = void 0;
var common_1 = require("@nestjs/common");
var IntakeFormsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IntakeFormsService = _classThis = /** @class */ (function () {
        function IntakeFormsService_1(prisma) {
            this.prisma = prisma;
        }
        IntakeFormsService_1.prototype.upsertForm = function (appointmentId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile, appointment, isUpdate, form;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _o.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({ where: { id: appointmentId } })];
                        case 2:
                            appointment = _o.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.patientId !== patientProfile.id)
                                throw new common_1.ForbiddenException("Not your appointment");
                            return [4 /*yield*/, this.prisma.intakeForm.findUnique({ where: { appointmentId: appointmentId } })];
                        case 3:
                            isUpdate = !!(_o.sent());
                            return [4 /*yield*/, this.prisma.intakeForm.upsert({
                                    where: { appointmentId: appointmentId },
                                    create: {
                                        appointmentId: appointmentId,
                                        patientId: patientProfile.id,
                                        symptoms: dto.symptoms,
                                        symptomNotes: (_a = dto.symptomNotes) !== null && _a !== void 0 ? _a : null,
                                        symptomDuration: (_b = dto.symptomDuration) !== null && _b !== void 0 ? _b : null,
                                        allergies: dto.allergies,
                                        allergyNotes: (_c = dto.allergyNotes) !== null && _c !== void 0 ? _c : null,
                                        medications: dto.medications,
                                        bloodPressure: (_d = dto.bloodPressure) !== null && _d !== void 0 ? _d : null,
                                        weight: (_e = dto.weight) !== null && _e !== void 0 ? _e : null,
                                        additionalNotes: (_f = dto.additionalNotes) !== null && _f !== void 0 ? _f : null,
                                    },
                                    update: {
                                        symptoms: dto.symptoms,
                                        symptomNotes: (_g = dto.symptomNotes) !== null && _g !== void 0 ? _g : null,
                                        symptomDuration: (_h = dto.symptomDuration) !== null && _h !== void 0 ? _h : null,
                                        allergies: dto.allergies,
                                        allergyNotes: (_j = dto.allergyNotes) !== null && _j !== void 0 ? _j : null,
                                        medications: dto.medications,
                                        bloodPressure: (_k = dto.bloodPressure) !== null && _k !== void 0 ? _k : null,
                                        weight: (_l = dto.weight) !== null && _l !== void 0 ? _l : null,
                                        additionalNotes: (_m = dto.additionalNotes) !== null && _m !== void 0 ? _m : null,
                                    },
                                })];
                        case 4:
                            form = _o.sent();
                            return [2 /*return*/, __assign(__assign({}, form), { isUpdate: isUpdate })];
                    }
                });
            });
        };
        IntakeFormsService_1.prototype.getFormByAppointment = function (appointmentId, userId, userRole) {
            return __awaiter(this, void 0, void 0, function () {
                var form, patientProfile, doctorProfile, appointment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.intakeForm.findUnique({
                                where: { appointmentId: appointmentId },
                                include: {
                                    patient: { include: { user: { select: { fullName: true } } } },
                                },
                            })];
                        case 1:
                            form = _a.sent();
                            if (!form)
                                throw new common_1.NotFoundException("Intake form not found for this appointment");
                            if (!(userRole === "PATIENT")) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 2:
                            patientProfile = _a.sent();
                            if (form.patientId !== (patientProfile === null || patientProfile === void 0 ? void 0 : patientProfile.id))
                                throw new common_1.ForbiddenException();
                            _a.label = 3;
                        case 3:
                            if (!(userRole === "DOCTOR")) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 4:
                            doctorProfile = _a.sent();
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: appointmentId },
                                    include: { availabilitySlot: true },
                                })];
                        case 5:
                            appointment = _a.sent();
                            if ((appointment === null || appointment === void 0 ? void 0 : appointment.availabilitySlot.doctorId) !== (doctorProfile === null || doctorProfile === void 0 ? void 0 : doctorProfile.id))
                                throw new common_1.ForbiddenException();
                            _a.label = 6;
                        case 6: return [2 /*return*/, form];
                    }
                });
            });
        };
        IntakeFormsService_1.prototype.getMyForms = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _a.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [2 /*return*/, this.prisma.intakeForm.findMany({
                                    where: { patientId: patientProfile.id },
                                    include: {
                                        appointment: {
                                            include: {
                                                availabilitySlot: {
                                                    include: { doctor: { include: { user: { select: { fullName: true } } } } },
                                                },
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        return IntakeFormsService_1;
    }());
    __setFunctionName(_classThis, "IntakeFormsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntakeFormsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntakeFormsService = _classThis;
}();
exports.IntakeFormsService = IntakeFormsService;
