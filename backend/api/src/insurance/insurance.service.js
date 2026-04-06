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
exports.InsuranceService = void 0;
var common_1 = require("@nestjs/common");
function generateClaimCode() {
    var date = new Date();
    var datePart = "".concat(date.getFullYear()).concat(String(date.getMonth() + 1).padStart(2, "0")).concat(String(date.getDate()).padStart(2, "0"));
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var random = Array.from({ length: 5 }, function () { return chars[Math.floor(Math.random() * chars.length)]; }).join("");
    return "CLM-".concat(datePart, "-").concat(random);
}
var InsuranceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InsuranceService = _classThis = /** @class */ (function () {
        function InsuranceService_1(prisma) {
            this.prisma = prisma;
        }
        // ── Cards ─────────────────────────────────────────────────────────────────
        InsuranceService_1.prototype.addCard = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var patient;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patient = _g.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient profile not found");
                            if (!((_a = dto.provider) === null || _a === void 0 ? void 0 : _a.trim()))
                                throw new common_1.BadRequestException("Provider name is required");
                            if (!((_b = dto.memberNumber) === null || _b === void 0 ? void 0 : _b.trim()))
                                throw new common_1.BadRequestException("Member number is required");
                            if (!((_c = dto.holderName) === null || _c === void 0 ? void 0 : _c.trim()))
                                throw new common_1.BadRequestException("Card holder name is required");
                            return [2 /*return*/, this.prisma.insuranceCard.create({
                                    data: {
                                        patientId: patient.id,
                                        provider: dto.provider.trim(),
                                        memberNumber: dto.memberNumber.trim(),
                                        groupNumber: (_e = (_d = dto.groupNumber) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : null,
                                        holderName: dto.holderName.trim(),
                                        validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
                                        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
                                        cardImageBase64: (_f = dto.cardImageBase64) !== null && _f !== void 0 ? _f : null,
                                    },
                                })];
                    }
                });
            });
        };
        InsuranceService_1.prototype.getCards = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var patient;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patient = _a.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [2 /*return*/, this.prisma.insuranceCard.findMany({
                                    where: { patientId: patient.id, isActive: true },
                                    include: { claims: { select: { id: true, claimCode: true, status: true, createdAt: true } } },
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        InsuranceService_1.prototype.deactivateCard = function (userId, cardId) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, card;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patient = _a.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.insuranceCard.findFirst({
                                    where: { id: cardId, patientId: patient.id },
                                })];
                        case 2:
                            card = _a.sent();
                            if (!card)
                                throw new common_1.NotFoundException("Insurance card not found");
                            return [4 /*yield*/, this.prisma.insuranceCard.update({
                                    where: { id: cardId },
                                    data: { isActive: false },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        // ── Claims ────────────────────────────────────────────────────────────────
        InsuranceService_1.prototype.submitClaim = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, appointment, card, existing, claimCode, attempts, collision, consultationFee;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patient = _e.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: dto.appointmentId },
                                    include: {
                                        availabilitySlot: { include: { doctor: true } },
                                        prescription: true,
                                    },
                                })];
                        case 2:
                            appointment = _e.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.patientId !== patient.id)
                                throw new common_1.ForbiddenException("Not your appointment");
                            if (!["CONFIRMED", "COMPLETED"].includes(appointment.status)) {
                                throw new common_1.BadRequestException("Claims can only be submitted for confirmed or completed appointments");
                            }
                            return [4 /*yield*/, this.prisma.insuranceCard.findFirst({
                                    where: { id: dto.insuranceCardId, patientId: patient.id, isActive: true },
                                })];
                        case 3:
                            card = _e.sent();
                            if (!card)
                                throw new common_1.NotFoundException("Insurance card not found");
                            return [4 /*yield*/, this.prisma.insuranceClaim.findUnique({
                                    where: { appointmentId: dto.appointmentId },
                                })];
                        case 4:
                            existing = _e.sent();
                            if (existing)
                                throw new common_1.BadRequestException("A claim already exists for this appointment");
                            claimCode = generateClaimCode();
                            attempts = 0;
                            _e.label = 5;
                        case 5:
                            if (!(attempts < 5)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.prisma.insuranceClaim.findUnique({ where: { claimCode: claimCode } })];
                        case 6:
                            collision = _e.sent();
                            if (!collision)
                                return [3 /*break*/, 7];
                            claimCode = generateClaimCode();
                            attempts++;
                            return [3 /*break*/, 5];
                        case 7:
                            consultationFee = appointment.availabilitySlot.doctor.consultationFee;
                            return [2 /*return*/, this.prisma.insuranceClaim.create({
                                    data: {
                                        claimCode: claimCode,
                                        appointmentId: dto.appointmentId,
                                        patientId: patient.id,
                                        insuranceCardId: dto.insuranceCardId,
                                        diagnosisCode: (_b = (_a = dto.diagnosisCode) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : null,
                                        claimAmount: dto.claimAmount
                                            ? dto.claimAmount
                                            : consultationFee
                                                ? Number(consultationFee)
                                                : null,
                                        notes: (_d = (_c = dto.notes) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : null,
                                        status: "SUBMITTED",
                                        submittedAt: new Date(),
                                    },
                                    include: {
                                        insuranceCard: { select: { provider: true, memberNumber: true, holderName: true } },
                                        appointment: {
                                            include: {
                                                availabilitySlot: {
                                                    include: { doctor: { include: { user: { select: { fullName: true } } } } },
                                                },
                                            },
                                        },
                                    },
                                })];
                    }
                });
            });
        };
        InsuranceService_1.prototype.getClaims = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var patient;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patient = _a.sent();
                            if (!patient)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [2 /*return*/, this.prisma.insuranceClaim.findMany({
                                    where: { patientId: patient.id },
                                    include: {
                                        insuranceCard: { select: { provider: true, memberNumber: true } },
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
        InsuranceService_1.prototype.getClaimByCode = function (claimCode) {
            return __awaiter(this, void 0, void 0, function () {
                var claim;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.insuranceClaim.findUnique({
                                where: { claimCode: claimCode },
                                include: {
                                    insuranceCard: { select: { provider: true, memberNumber: true, groupNumber: true, holderName: true } },
                                    patient: { include: { user: { select: { fullName: true, email: true } } } },
                                    appointment: {
                                        include: {
                                            availabilitySlot: {
                                                include: { doctor: { include: { user: { select: { fullName: true } } } } },
                                            },
                                            prescription: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            claim = _a.sent();
                            if (!claim)
                                throw new common_1.NotFoundException("Claim ".concat(claimCode, " not found"));
                            return [2 /*return*/, claim];
                    }
                });
            });
        };
        return InsuranceService_1;
    }());
    __setFunctionName(_classThis, "InsuranceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InsuranceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InsuranceService = _classThis;
}();
exports.InsuranceService = InsuranceService;
