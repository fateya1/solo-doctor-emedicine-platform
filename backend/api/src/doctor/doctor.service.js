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
exports.DoctorService = void 0;
var common_1 = require("@nestjs/common");
var DoctorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DoctorService = _classThis = /** @class */ (function () {
        function DoctorService_1(prisma) {
            this.prisma = prisma;
        }
        DoctorService_1.prototype.getProfileByUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({
                                where: { userId: userId },
                            })];
                        case 1:
                            profile = _a.sent();
                            if (!profile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [2 /*return*/, profile];
                    }
                });
            });
        };
        DoctorService_1.prototype.computeRating = function (reviews) {
            if (!reviews.length)
                return { averageRating: 0, totalReviews: 0 };
            var avg = reviews.reduce(function (sum, r) { return sum + r.rating; }, 0) / reviews.length;
            return {
                averageRating: Math.round(avg * 10) / 10,
                totalReviews: reviews.length,
            };
        };
        DoctorService_1.prototype.searchDoctors = function (specialty, name) {
            return __awaiter(this, void 0, void 0, function () {
                var doctors;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findMany({
                                where: __assign(__assign({ isVerified: true, onboardingComplete: true }, (specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : {})), (name ? { user: { fullName: { contains: name, mode: "insensitive" } } } : {})),
                                include: {
                                    user: { select: { fullName: true, email: true } },
                                    availabilitySlots: {
                                        where: { isAvailable: true, startTime: { gte: new Date() } },
                                        orderBy: { startTime: "asc" },
                                        take: 3,
                                    },
                                    reviews: { select: { rating: true } },
                                },
                                orderBy: { createdAt: "desc" },
                            })];
                        case 1:
                            doctors = _a.sent();
                            return [2 /*return*/, doctors.map(function (d) {
                                    var reviews = d.reviews, rest = __rest(d, ["reviews"]);
                                    return __assign(__assign({}, rest), _this.computeRating(reviews));
                                })];
                    }
                });
            });
        };
        DoctorService_1.prototype.getDoctorPublicProfile = function (idOrSlug) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, reviews, rest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findFirst({
                                where: {
                                    OR: [
                                        { id: idOrSlug },
                                        { user: { tenant: { slug: idOrSlug } } },
                                    ],
                                    isVerified: true,
                                },
                                include: {
                                    user: { select: { fullName: true } },
                                    availabilitySlots: {
                                        where: { isAvailable: true, startTime: { gte: new Date() } },
                                        orderBy: { startTime: "asc" },
                                        take: 10,
                                    },
                                    reviews: {
                                        include: {
                                            patientProfile: { include: { user: { select: { fullName: true } } } },
                                        },
                                        orderBy: { createdAt: "desc" },
                                        take: 10,
                                    },
                                },
                            })];
                        case 1:
                            profile = _a.sent();
                            if (!profile)
                                throw new common_1.NotFoundException("Doctor not found");
                            reviews = profile.reviews, rest = __rest(profile, ["reviews"]);
                            return [2 /*return*/, __assign(__assign(__assign({}, rest), { reviews: reviews }), this.computeRating(reviews))];
                    }
                });
            });
        };
        DoctorService_1.prototype.getDoctorAnalytics = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile, now, startOfMonth, startOfLastMonth, endOfLastMonth, _a, allAppointments, thisMonthAppointments, lastMonthAppointments, payments, _b, _c, _d, _e, _f, completed, cancelled, noShow, completionRate, fee, revenueTotal, revenueThisMonth, revenueLastMonth, growthRate, slots, slotUtilization, monthlyTrend;
                var _g, _h, _j;
                var _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _l.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            now = new Date();
                            startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                            startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                            endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                            _c = (_b = Promise).all;
                            _d = [this.prisma.appointment.findMany({
                                    where: { availabilitySlot: { doctorId: doctorProfile.id } },
                                    include: { availabilitySlot: true },
                                }),
                                this.prisma.appointment.findMany({
                                    where: {
                                        availabilitySlot: { doctorId: doctorProfile.id },
                                        createdAt: { gte: startOfMonth },
                                    },
                                }),
                                this.prisma.appointment.findMany({
                                    where: {
                                        availabilitySlot: { doctorId: doctorProfile.id },
                                        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                                    },
                                })];
                            _f = (_e = this.prisma.subscriptionPayment).findMany;
                            _g = {};
                            _h = {};
                            _j = {};
                            return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: userId } })];
                        case 2: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                                    _f.apply(_e, [(_g.where = (_h.subscription = (_j.tenantId = (_l.sent()).tenantId, _j), _h),
                                            _g)])
                                ])])];
                        case 3:
                            _a = _l.sent(), allAppointments = _a[0], thisMonthAppointments = _a[1], lastMonthAppointments = _a[2], payments = _a[3];
                            completed = allAppointments.filter(function (a) { return a.status === "COMPLETED"; });
                            cancelled = allAppointments.filter(function (a) { return a.status === "CANCELLED"; });
                            noShow = allAppointments.filter(function (a) { return a.status === "NO_SHOW"; });
                            completionRate = allAppointments.length
                                ? Math.round((completed.length / allAppointments.length) * 100)
                                : 0;
                            fee = Number((_k = doctorProfile.consultationFee) !== null && _k !== void 0 ? _k : 0);
                            revenueTotal = completed.length * fee;
                            revenueThisMonth = thisMonthAppointments.filter(function (a) { return a.status === "COMPLETED"; }).length * fee;
                            revenueLastMonth = lastMonthAppointments.filter(function (a) { return a.status === "COMPLETED"; }).length * fee;
                            growthRate = revenueLastMonth > 0
                                ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
                                : 0;
                            return [4 /*yield*/, this.prisma.availabilitySlot.findMany({
                                    where: { doctorId: doctorProfile.id },
                                    include: { appointment: true },
                                })];
                        case 4:
                            slots = _l.sent();
                            slotUtilization = slots.length
                                ? Math.round((slots.filter(function (s) { return s.appointment; }).length / slots.length) * 100)
                                : 0;
                            monthlyTrend = Array.from({ length: 6 }, function (_, i) {
                                var d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
                                var end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0);
                                var monthAppts = allAppointments.filter(function (a) {
                                    var created = new Date(a.createdAt);
                                    return created >= d && created <= end;
                                });
                                var monthCompleted = monthAppts.filter(function (a) { return a.status === "COMPLETED"; });
                                return {
                                    month: d.toLocaleString("default", { month: "short" }),
                                    appointments: monthAppts.length,
                                    revenue: monthCompleted.length * fee,
                                };
                            });
                            return [2 /*return*/, {
                                    totalAppointments: allAppointments.length,
                                    appointmentsThisMonth: thisMonthAppointments.length,
                                    appointmentsLastMonth: lastMonthAppointments.length,
                                    completedAppointments: completed.length,
                                    cancelledAppointments: cancelled.length,
                                    noShowAppointments: noShow.length,
                                    completionRate: completionRate,
                                    revenueTotal: revenueTotal,
                                    revenueThisMonth: revenueThisMonth,
                                    revenueLastMonth: revenueLastMonth,
                                    growthRate: growthRate,
                                    slotUtilization: slotUtilization,
                                    consultationFee: fee,
                                    monthlyTrend: monthlyTrend,
                                }];
                    }
                });
            });
        };
        return DoctorService_1;
    }());
    __setFunctionName(_classThis, "DoctorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DoctorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DoctorService = _classThis;
}();
exports.DoctorService = DoctorService;
