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
exports.AvailabilityTemplatesService = void 0;
var common_1 = require("@nestjs/common");
var AvailabilityTemplatesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AvailabilityTemplatesService = _classThis = /** @class */ (function () {
        function AvailabilityTemplatesService_1(prisma) {
            this.prisma = prisma;
        }
        // ── Helpers ──────────────────────────────────────────────────────────────
        AvailabilityTemplatesService_1.prototype.getDoctorProfile = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            profile = _a.sent();
                            if (!profile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [2 /*return*/, profile];
                    }
                });
            });
        };
        AvailabilityTemplatesService_1.prototype.ownedTemplate = function (templateId, doctorId) {
            return __awaiter(this, void 0, void 0, function () {
                var t;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.availabilityTemplate.findFirst({
                                where: { id: templateId, doctorId: doctorId },
                                include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
                            })];
                        case 1:
                            t = _a.sent();
                            if (!t)
                                throw new common_1.NotFoundException("Template not found");
                            return [2 /*return*/, t];
                    }
                });
            });
        };
        // ── CRUD ─────────────────────────────────────────────────────────────────
        AvailabilityTemplatesService_1.prototype.getTemplates = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDoctorProfile(userId)];
                        case 1:
                            doctor = _a.sent();
                            return [2 /*return*/, this.prisma.availabilityTemplate.findMany({
                                    where: { doctorId: doctor.id },
                                    include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
                                    orderBy: { createdAt: "desc" },
                                })];
                    }
                });
            });
        };
        AvailabilityTemplatesService_1.prototype.createTemplate = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getDoctorProfile(userId)];
                        case 1:
                            doctor = _b.sent();
                            this.validateSlots(dto.slots);
                            return [2 /*return*/, this.prisma.availabilityTemplate.create({
                                    data: {
                                        doctorId: doctor.id,
                                        name: dto.name.trim(),
                                        timezone: (_a = dto.timezone) !== null && _a !== void 0 ? _a : "Africa/Nairobi",
                                        slots: {
                                            create: dto.slots.map(function (s) {
                                                var _a, _b, _c;
                                                return ({
                                                    dayOfWeek: s.dayOfWeek,
                                                    startHour: s.startHour,
                                                    startMinute: (_a = s.startMinute) !== null && _a !== void 0 ? _a : 0,
                                                    endHour: s.endHour,
                                                    endMinute: (_b = s.endMinute) !== null && _b !== void 0 ? _b : 0,
                                                    slotMinutes: s.slotMinutes,
                                                    breakMinutes: (_c = s.breakMinutes) !== null && _c !== void 0 ? _c : 0,
                                                });
                                            }),
                                        },
                                    },
                                    include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
                                })];
                    }
                });
            });
        };
        AvailabilityTemplatesService_1.prototype.updateTemplate = function (templateId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDoctorProfile(userId)];
                        case 1:
                            doctor = _a.sent();
                            return [4 /*yield*/, this.ownedTemplate(templateId, doctor.id)];
                        case 2:
                            _a.sent();
                            if (dto.slots)
                                this.validateSlots(dto.slots);
                            // Replace all slots if provided
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!dto.slots) return [3 /*break*/, 3];
                                                return [4 /*yield*/, tx.availabilityTemplateSlot.deleteMany({ where: { templateId: templateId } })];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, tx.availabilityTemplateSlot.createMany({
                                                        data: dto.slots.map(function (s) {
                                                            var _a, _b, _c;
                                                            return ({
                                                                templateId: templateId,
                                                                dayOfWeek: s.dayOfWeek,
                                                                startHour: s.startHour,
                                                                startMinute: (_a = s.startMinute) !== null && _a !== void 0 ? _a : 0,
                                                                endHour: s.endHour,
                                                                endMinute: (_b = s.endMinute) !== null && _b !== void 0 ? _b : 0,
                                                                slotMinutes: s.slotMinutes,
                                                                breakMinutes: (_c = s.breakMinutes) !== null && _c !== void 0 ? _c : 0,
                                                            });
                                                        }),
                                                    })];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3: return [2 /*return*/, tx.availabilityTemplate.update({
                                                    where: { id: templateId },
                                                    data: __assign(__assign({}, (dto.name ? { name: dto.name.trim() } : {})), (dto.timezone ? { timezone: dto.timezone } : {})),
                                                    include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
                                                })];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        AvailabilityTemplatesService_1.prototype.toggleTemplate = function (templateId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor, template;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDoctorProfile(userId)];
                        case 1:
                            doctor = _a.sent();
                            return [4 /*yield*/, this.ownedTemplate(templateId, doctor.id)];
                        case 2:
                            template = _a.sent();
                            return [2 /*return*/, this.prisma.availabilityTemplate.update({
                                    where: { id: templateId },
                                    data: { isActive: !template.isActive },
                                })];
                    }
                });
            });
        };
        AvailabilityTemplatesService_1.prototype.deleteTemplate = function (templateId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDoctorProfile(userId)];
                        case 1:
                            doctor = _a.sent();
                            return [4 /*yield*/, this.ownedTemplate(templateId, doctor.id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.availabilityTemplate.delete({ where: { id: templateId } })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { ok: true }];
                    }
                });
            });
        };
        // ── Apply ─────────────────────────────────────────────────────────────────
        AvailabilityTemplatesService_1.prototype.applyTemplate = function (templateId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor, template, from, totalDays, slotsToCreate, _loop_1, dayOffset, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (dto.weeks < 1 || dto.weeks > 12) {
                                throw new common_1.BadRequestException("Weeks must be between 1 and 12");
                            }
                            return [4 /*yield*/, this.getDoctorProfile(userId)];
                        case 1:
                            doctor = _a.sent();
                            return [4 /*yield*/, this.ownedTemplate(templateId, doctor.id)];
                        case 2:
                            template = _a.sent();
                            if (!template.slots.length) {
                                throw new common_1.BadRequestException("This template has no time slots configured");
                            }
                            from = new Date(dto.fromDate);
                            from.setHours(0, 0, 0, 0);
                            if (isNaN(from.getTime()))
                                throw new common_1.BadRequestException("Invalid fromDate");
                            totalDays = dto.weeks * 7;
                            slotsToCreate = [];
                            _loop_1 = function (dayOffset) {
                                var currentDate = new Date(from);
                                currentDate.setDate(from.getDate() + dayOffset);
                                var dayOfWeek = currentDate.getDay();
                                var matchingSlots = template.slots.filter(function (s) { return s.dayOfWeek === dayOfWeek; });
                                for (var _i = 0, matchingSlots_1 = matchingSlots; _i < matchingSlots_1.length; _i++) {
                                    var tSlot = matchingSlots_1[_i];
                                    var windowStart = new Date(currentDate);
                                    windowStart.setHours(tSlot.startHour, tSlot.startMinute, 0, 0);
                                    var windowEnd = new Date(currentDate);
                                    windowEnd.setHours(tSlot.endHour, tSlot.endMinute, 0, 0);
                                    if (windowEnd <= windowStart)
                                        continue;
                                    var slotMs = tSlot.slotMinutes * 60000;
                                    var breakMs = tSlot.breakMinutes * 60000;
                                    var cursor = new Date(windowStart);
                                    while (cursor.getTime() + slotMs <= windowEnd.getTime()) {
                                        slotsToCreate.push({
                                            doctorId: doctor.id,
                                            startTime: new Date(cursor),
                                            endTime: new Date(cursor.getTime() + slotMs),
                                        });
                                        cursor = new Date(cursor.getTime() + slotMs + breakMs);
                                    }
                                }
                            };
                            for (dayOffset = 0; dayOffset < totalDays; dayOffset++) {
                                _loop_1(dayOffset);
                            }
                            if (!slotsToCreate.length) {
                                throw new common_1.BadRequestException("No slots generated — check your template days match the date range");
                            }
                            return [4 /*yield*/, this.prisma.availabilitySlot.createMany({
                                    data: slotsToCreate,
                                    skipDuplicates: true,
                                })];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    created: result.count,
                                    skipped: slotsToCreate.length - result.count,
                                    weeks: dto.weeks,
                                    from: dto.fromDate,
                                }];
                    }
                });
            });
        };
        // ── Validation ────────────────────────────────────────────────────────────
        AvailabilityTemplatesService_1.prototype.validateSlots = function (slots) {
            var _a, _b;
            for (var _i = 0, slots_1 = slots; _i < slots_1.length; _i++) {
                var s = slots_1[_i];
                if (s.dayOfWeek < 0 || s.dayOfWeek > 6)
                    throw new common_1.BadRequestException("dayOfWeek must be 0–6");
                if (s.startHour < 0 || s.startHour > 23)
                    throw new common_1.BadRequestException("Invalid startHour");
                if (s.endHour < 0 || s.endHour > 23)
                    throw new common_1.BadRequestException("Invalid endHour");
                var startMins = s.startHour * 60 + ((_a = s.startMinute) !== null && _a !== void 0 ? _a : 0);
                var endMins = s.endHour * 60 + ((_b = s.endMinute) !== null && _b !== void 0 ? _b : 0);
                if (endMins <= startMins)
                    throw new common_1.BadRequestException("End time must be after start time");
                if (s.slotMinutes < 5 || s.slotMinutes > 480)
                    throw new common_1.BadRequestException("slotMinutes must be 5–480");
            }
        };
        return AvailabilityTemplatesService_1;
    }());
    __setFunctionName(_classThis, "AvailabilityTemplatesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AvailabilityTemplatesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AvailabilityTemplatesService = _classThis;
}();
exports.AvailabilityTemplatesService = AvailabilityTemplatesService;
