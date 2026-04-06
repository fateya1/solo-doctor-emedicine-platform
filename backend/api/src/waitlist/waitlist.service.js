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
exports.WaitlistService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var WaitlistService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WaitlistService = _classThis = /** @class */ (function () {
        function WaitlistService_1(prisma, emailService) {
            this.prisma = prisma;
            this.emailService = emailService;
            this.logger = new common_1.Logger(WaitlistService.name);
        }
        WaitlistService_1.prototype.joinWaitlist = function (userId, doctorProfileId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile, doctorProfile, existing, availableSlot, expiresAt, entry, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _b.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.doctorProfile.findUnique({
                                    where: { id: doctorProfileId },
                                    include: { user: true },
                                })];
                        case 2:
                            doctorProfile = _b.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor not found");
                            return [4 /*yield*/, this.prisma.waitlist.findUnique({
                                    where: { patientId_doctorProfileId: { patientId: patientProfile.id, doctorProfileId: doctorProfileId } },
                                })];
                        case 3:
                            existing = _b.sent();
                            if (existing && existing.status === client_1.WaitlistStatus.WAITING) {
                                throw new common_1.BadRequestException("You are already on this doctor waitlist");
                            }
                            return [4 /*yield*/, this.prisma.availabilitySlot.findFirst({
                                    where: { doctorId: doctorProfileId, isAvailable: true, startTime: { gte: new Date() } },
                                })];
                        case 4:
                            availableSlot = _b.sent();
                            if (availableSlot) {
                                throw new common_1.BadRequestException("Doctor has available slots — you can book directly");
                            }
                            expiresAt = new Date();
                            expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry
                            if (!existing) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.waitlist.update({
                                    where: { id: existing.id },
                                    data: { status: client_1.WaitlistStatus.WAITING, notifiedAt: null, expiresAt: expiresAt },
                                })];
                        case 5:
                            _a = _b.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.prisma.waitlist.create({
                                data: {
                                    patientId: patientProfile.id,
                                    doctorProfileId: doctorProfileId,
                                    status: client_1.WaitlistStatus.WAITING,
                                    expiresAt: expiresAt,
                                },
                            })];
                        case 7:
                            _a = _b.sent();
                            _b.label = 8;
                        case 8:
                            entry = _a;
                            this.logger.log("Patient ".concat(patientProfile.id, " joined waitlist for doctor ").concat(doctorProfileId));
                            return [2 /*return*/, { message: "You have been added to the waitlist. We will notify you when a slot becomes available.", entry: entry }];
                    }
                });
            });
        };
        WaitlistService_1.prototype.leaveWaitlist = function (userId, doctorProfileId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _a.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.waitlist.findUnique({
                                    where: { patientId_doctorProfileId: { patientId: patientProfile.id, doctorProfileId: doctorProfileId } },
                                })];
                        case 2:
                            entry = _a.sent();
                            if (!entry)
                                throw new common_1.NotFoundException("Waitlist entry not found");
                            return [4 /*yield*/, this.prisma.waitlist.delete({ where: { id: entry.id } })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: "You have been removed from the waitlist" }];
                    }
                });
            });
        };
        WaitlistService_1.prototype.getWaitlistStatus = function (userId, doctorProfileId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile, entry;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _c.sent();
                            if (!patientProfile)
                                return [2 /*return*/, { onWaitlist: false }];
                            return [4 /*yield*/, this.prisma.waitlist.findUnique({
                                    where: { patientId_doctorProfileId: { patientId: patientProfile.id, doctorProfileId: doctorProfileId } },
                                })];
                        case 2:
                            entry = _c.sent();
                            return [2 /*return*/, {
                                    onWaitlist: !!entry && entry.status === client_1.WaitlistStatus.WAITING,
                                    status: (_a = entry === null || entry === void 0 ? void 0 : entry.status) !== null && _a !== void 0 ? _a : null,
                                    joinedAt: (_b = entry === null || entry === void 0 ? void 0 : entry.createdAt) !== null && _b !== void 0 ? _b : null,
                                }];
                    }
                });
            });
        };
        WaitlistService_1.prototype.getPatientWaitlist = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            patientProfile = _a.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [2 /*return*/, this.prisma.waitlist.findMany({
                                    where: { patientId: patientProfile.id, status: client_1.WaitlistStatus.WAITING },
                                    include: {
                                        doctorProfile: {
                                            include: { user: { select: { fullName: true } } },
                                        },
                                    },
                                    orderBy: { createdAt: "asc" },
                                })];
                    }
                });
            });
        };
        WaitlistService_1.prototype.getDoctorWaitlist = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _a.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [2 /*return*/, this.prisma.waitlist.findMany({
                                    where: { doctorProfileId: doctorProfile.id, status: client_1.WaitlistStatus.WAITING },
                                    include: {
                                        patient: { include: { user: { select: { fullName: true, email: true } } } },
                                    },
                                    orderBy: { createdAt: "asc" },
                                })];
                    }
                });
            });
        };
        // Called when a slot becomes available (slot added or appointment cancelled)
        WaitlistService_1.prototype.notifyWaitlist = function (doctorProfileId) {
            return __awaiter(this, void 0, void 0, function () {
                var waitingPatients, _i, waitingPatients_1, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.waitlist.findMany({
                                where: {
                                    doctorProfileId: doctorProfileId,
                                    status: client_1.WaitlistStatus.WAITING,
                                    expiresAt: { gte: new Date() },
                                },
                                include: {
                                    patient: { include: { user: true } },
                                    doctorProfile: { include: { user: true } },
                                },
                                orderBy: { createdAt: "asc" },
                                take: 5, // notify first 5 in queue
                            })];
                        case 1:
                            waitingPatients = _a.sent();
                            _i = 0, waitingPatients_1 = waitingPatients;
                            _a.label = 2;
                        case 2:
                            if (!(_i < waitingPatients_1.length)) return [3 /*break*/, 5];
                            entry = waitingPatients_1[_i];
                            return [4 /*yield*/, this.prisma.waitlist.update({
                                    where: { id: entry.id },
                                    data: { status: client_1.WaitlistStatus.NOTIFIED, notifiedAt: new Date() },
                                })];
                        case 3:
                            _a.sent();
                            this.emailService.sendWaitlistNotification(entry.patient.user.email, entry.patient.user.fullName, entry.doctorProfile.user.fullName, entry.doctorProfile.id).catch(function () { });
                            this.logger.log("Waitlist notification sent to ".concat(entry.patient.user.email));
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, { notified: waitingPatients.length }];
                    }
                });
            });
        };
        return WaitlistService_1;
    }());
    __setFunctionName(_classThis, "WaitlistService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WaitlistService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WaitlistService = _classThis;
}();
exports.WaitlistService = WaitlistService;
