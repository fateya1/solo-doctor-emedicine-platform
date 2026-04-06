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
exports.RevenueService = void 0;
var axios_1 = require("axios");
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var PLATFORM_COMMISSION_RATE = 0.15; // 15% platform commission
var RevenueService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RevenueService = _classThis = /** @class */ (function () {
        function RevenueService_1(prisma) {
            this.prisma = prisma;
        }
        RevenueService_1.prototype.getPlatformRevenueSummary = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, thirtyDaysAgo, sixtyDaysAgo, _a, totalCommissions, thisMonthCommissions, lastMonthCommissions, pendingPayouts, completedPayouts, totalSubscriptionRevenue, thisMonthSubscriptionRevenue, monthlyTrend, i, start, end, _b, commissions, subscriptions, thisMonth, lastMonth, growthRate;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return __generator(this, function (_r) {
                    switch (_r.label) {
                        case 0:
                            now = new Date();
                            thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                            sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.platformCommission.aggregate({ _sum: { commissionAmount: true } }),
                                    this.prisma.platformCommission.aggregate({
                                        where: { createdAt: { gte: thirtyDaysAgo } },
                                        _sum: { commissionAmount: true },
                                    }),
                                    this.prisma.platformCommission.aggregate({
                                        where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
                                        _sum: { commissionAmount: true },
                                    }),
                                    this.prisma.doctorPayout.aggregate({
                                        where: { status: client_1.PayoutStatus.PENDING },
                                        _sum: { amount: true },
                                        _count: true,
                                    }),
                                    this.prisma.doctorPayout.aggregate({
                                        where: { status: client_1.PayoutStatus.COMPLETED },
                                        _sum: { amount: true },
                                        _count: true,
                                    }),
                                    this.prisma.subscriptionPayment.aggregate({
                                        where: { status: "COMPLETED" },
                                        _sum: { amount: true },
                                    }),
                                    this.prisma.subscriptionPayment.aggregate({
                                        where: { status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
                                        _sum: { amount: true },
                                    }),
                                ])];
                        case 1:
                            _a = _r.sent(), totalCommissions = _a[0], thisMonthCommissions = _a[1], lastMonthCommissions = _a[2], pendingPayouts = _a[3], completedPayouts = _a[4], totalSubscriptionRevenue = _a[5], thisMonthSubscriptionRevenue = _a[6];
                            monthlyTrend = [];
                            i = 5;
                            _r.label = 2;
                        case 2:
                            if (!(i >= 0)) return [3 /*break*/, 5];
                            start = new Date(now.getFullYear(), now.getMonth() - i, 1);
                            end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.platformCommission.aggregate({
                                        where: { createdAt: { gte: start, lte: end } },
                                        _sum: { commissionAmount: true },
                                    }),
                                    this.prisma.subscriptionPayment.aggregate({
                                        where: { status: "COMPLETED", createdAt: { gte: start, lte: end } },
                                        _sum: { amount: true },
                                    }),
                                ])];
                        case 3:
                            _b = _r.sent(), commissions = _b[0], subscriptions = _b[1];
                            monthlyTrend.push({
                                month: start.toLocaleString("en-KE", { month: "short" }),
                                commissions: Number((_c = commissions._sum.commissionAmount) !== null && _c !== void 0 ? _c : 0),
                                subscriptions: Number((_d = subscriptions._sum.amount) !== null && _d !== void 0 ? _d : 0),
                                total: Number((_e = commissions._sum.commissionAmount) !== null && _e !== void 0 ? _e : 0) + Number((_f = subscriptions._sum.amount) !== null && _f !== void 0 ? _f : 0),
                            });
                            _r.label = 4;
                        case 4:
                            i--;
                            return [3 /*break*/, 2];
                        case 5:
                            thisMonth = Number((_g = thisMonthCommissions._sum.commissionAmount) !== null && _g !== void 0 ? _g : 0);
                            lastMonth = Number((_h = lastMonthCommissions._sum.commissionAmount) !== null && _h !== void 0 ? _h : 0);
                            growthRate = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;
                            return [2 /*return*/, {
                                    totalCommissionRevenue: Number((_j = totalCommissions._sum.commissionAmount) !== null && _j !== void 0 ? _j : 0),
                                    thisMonthCommissions: thisMonth,
                                    lastMonthCommissions: lastMonth,
                                    growthRate: growthRate,
                                    pendingPayouts: {
                                        amount: Number((_k = pendingPayouts._sum.amount) !== null && _k !== void 0 ? _k : 0),
                                        count: pendingPayouts._count,
                                    },
                                    completedPayouts: {
                                        amount: Number((_l = completedPayouts._sum.amount) !== null && _l !== void 0 ? _l : 0),
                                        count: completedPayouts._count,
                                    },
                                    totalSubscriptionRevenue: Number((_m = totalSubscriptionRevenue._sum.amount) !== null && _m !== void 0 ? _m : 0),
                                    thisMonthSubscriptionRevenue: Number((_o = thisMonthSubscriptionRevenue._sum.amount) !== null && _o !== void 0 ? _o : 0),
                                    totalPlatformRevenue: Number((_p = totalCommissions._sum.commissionAmount) !== null && _p !== void 0 ? _p : 0) +
                                        Number((_q = totalSubscriptionRevenue._sum.amount) !== null && _q !== void 0 ? _q : 0),
                                    commissionRate: PLATFORM_COMMISSION_RATE * 100,
                                    monthlyTrend: monthlyTrend,
                                }];
                    }
                });
            });
        };
        RevenueService_1.prototype.getDoctorEarnings = function () {
            return __awaiter(this, void 0, void 0, function () {
                var doctors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findMany({
                                include: {
                                    user: { select: { fullName: true, email: true, isActive: true } },
                                    availabilitySlots: {
                                        include: {
                                            appointment: { select: { id: true, status: true } },
                                        },
                                    },
                                    commissions: {
                                        select: { doctorEarning: true, commissionAmount: true },
                                    },
                                    payouts: {
                                        orderBy: { createdAt: "desc" },
                                    },
                                },
                            })];
                        case 1:
                            doctors = _a.sent();
                            return [2 /*return*/, doctors.map(function (d) {
                                    var _a, _b, _c, _d;
                                    var fee = Number((_a = d.consultationFee) !== null && _a !== void 0 ? _a : 0);
                                    var completedCount = d.availabilitySlots.filter(function (s) { var _a; return ((_a = s.appointment) === null || _a === void 0 ? void 0 : _a.status) === "COMPLETED"; }).length;
                                    var grossRevenue = completedCount * fee;
                                    var totalCommissionsPaid = d.commissions.length > 0
                                        ? d.commissions.reduce(function (sum, c) { return sum + Number(c.commissionAmount); }, 0)
                                        : Math.round(grossRevenue * 0.15);
                                    var totalEarnings = d.commissions.length > 0
                                        ? d.commissions.reduce(function (sum, c) { return sum + Number(c.doctorEarning); }, 0)
                                        : grossRevenue - totalCommissionsPaid;
                                    var lastPayout = (_b = d.payouts[0]) !== null && _b !== void 0 ? _b : null;
                                    var pendingPayout = d.payouts.find(function (p) { return p.status === client_1.PayoutStatus.PENDING; });
                                    var totalPaidOut = d.payouts
                                        .filter(function (p) { return p.status === client_1.PayoutStatus.COMPLETED; })
                                        .reduce(function (sum, p) { return sum + Number(p.amount); }, 0);
                                    return {
                                        doctorProfileId: d.id,
                                        fullName: d.user.fullName,
                                        email: d.user.email,
                                        userId: d.userId,
                                        isActive: d.user.isActive,
                                        specialty: d.specialty,
                                        consultationFee: fee,
                                        totalAppointments: completedCount,
                                        grossRevenue: grossRevenue,
                                        totalEarnings: totalEarnings,
                                        totalCommissionsPaid: totalCommissionsPaid,
                                        totalPaidOut: totalPaidOut,
                                        pendingPayoutAmount: pendingPayout ? Number(pendingPayout.amount) : 0,
                                        lastPayoutDate: (_c = lastPayout === null || lastPayout === void 0 ? void 0 : lastPayout.processedAt) !== null && _c !== void 0 ? _c : null,
                                        lastPayoutAmount: lastPayout ? Number(lastPayout.amount) : 0,
                                        lastPayoutStatus: (_d = lastPayout === null || lastPayout === void 0 ? void 0 : lastPayout.status) !== null && _d !== void 0 ? _d : null,
                                    };
                                })];
                    }
                });
            });
        };
        RevenueService_1.prototype.getAllPayouts = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.doctorPayout.findMany({
                            include: {
                                doctorProfile: {
                                    include: { user: { select: { fullName: true, email: true } } },
                                },
                            },
                            orderBy: { createdAt: "desc" },
                        })];
                });
            });
        };
        RevenueService_1.prototype.createPayout = function (doctorProfileId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doctor, payout, token, timestamp, shortcode, passkey, password, stkRes, err_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({
                                where: { id: doctorProfileId },
                                include: { user: true },
                            })];
                        case 1:
                            doctor = _b.sent();
                            if (!doctor)
                                throw new common_1.NotFoundException("Doctor not found");
                            return [4 /*yield*/, this.prisma.doctorPayout.create({
                                    data: {
                                        doctorProfileId: doctorProfileId,
                                        amount: dto.amount,
                                        currency: "KES",
                                        status: client_1.PayoutStatus.PENDING,
                                        periodStart: new Date(dto.periodStart),
                                        periodEnd: new Date(dto.periodEnd),
                                        phoneNumber: dto.phoneNumber,
                                        notes: (_a = dto.notes) !== null && _a !== void 0 ? _a : null,
                                    },
                                    include: {
                                        doctorProfile: { include: { user: { select: { fullName: true } } } },
                                    },
                                })];
                        case 2:
                            payout = _b.sent();
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 7, , 8]);
                            return [4 /*yield*/, this.getMpesaToken()];
                        case 4:
                            token = _b.sent();
                            timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
                            shortcode = process.env.MPESA_SHORTCODE;
                            passkey = process.env.MPESA_PASSKEY;
                            password = Buffer.from("".concat(shortcode).concat(passkey).concat(timestamp)).toString("base64");
                            return [4 /*yield*/, axios_1.default.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
                                    BusinessShortCode: shortcode,
                                    Password: password,
                                    Timestamp: timestamp,
                                    TransactionType: "CustomerPayBillOnline",
                                    Amount: Math.round(dto.amount),
                                    PartyA: dto.phoneNumber,
                                    PartyB: shortcode,
                                    PhoneNumber: dto.phoneNumber,
                                    CallBackURL: "".concat(process.env.BACKEND_URL, "/api/revenue/mpesa/callback"),
                                    AccountReference: "PAYOUT-".concat(doctorProfileId.slice(0, 8).toUpperCase()),
                                    TransactionDesc: "SoloDoc Payout - ".concat(doctor.user.fullName),
                                }, { headers: { Authorization: "Bearer ".concat(token) } })];
                        case 5:
                            stkRes = _b.sent();
                            return [4 /*yield*/, this.prisma.doctorPayout.update({
                                    where: { id: payout.id },
                                    data: { mpesaReceiptNo: stkRes.data.CheckoutRequestID },
                                })];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, __assign(__assign({}, payout), { message: "STK Push sent to doctor phone. Awaiting PIN confirmation." })];
                        case 7:
                            err_1 = _b.sent();
                            // Sandbox/dev fallback
                            return [2 /*return*/, __assign(__assign({}, payout), { message: "Sandbox mode: payout recorded, STK Push simulated." })];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        RevenueService_1.prototype.resendStkPush = function (payoutId) {
            return __awaiter(this, void 0, void 0, function () {
                var payout, token, timestamp, shortcode, passkey, password, stkRes, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorPayout.findUnique({
                                where: { id: payoutId },
                                include: { doctorProfile: { include: { user: true } } },
                            })];
                        case 1:
                            payout = _a.sent();
                            if (!payout)
                                throw new common_1.NotFoundException("Payout not found");
                            if (payout.status !== client_1.PayoutStatus.PENDING) {
                                throw new common_1.NotFoundException("Only PENDING payouts can be resent");
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, , 7]);
                            return [4 /*yield*/, this.getMpesaToken()];
                        case 3:
                            token = _a.sent();
                            timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
                            shortcode = process.env.MPESA_SHORTCODE;
                            passkey = process.env.MPESA_PASSKEY;
                            password = Buffer.from("".concat(shortcode).concat(passkey).concat(timestamp)).toString("base64");
                            return [4 /*yield*/, axios_1.default.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
                                    BusinessShortCode: shortcode,
                                    Password: password,
                                    Timestamp: timestamp,
                                    TransactionType: "CustomerPayBillOnline",
                                    Amount: Math.round(Number(payout.amount)),
                                    PartyA: payout.phoneNumber,
                                    PartyB: shortcode,
                                    PhoneNumber: payout.phoneNumber,
                                    CallBackURL: "".concat(process.env.BACKEND_URL, "/api/revenue/mpesa/callback"),
                                    AccountReference: "PAYOUT-".concat(payout.doctorProfileId.slice(0, 8).toUpperCase()),
                                    TransactionDesc: "SoloDoc Payout - ".concat(payout.doctorProfile.user.fullName),
                                }, { headers: { Authorization: "Bearer ".concat(token) } })];
                        case 4:
                            stkRes = _a.sent();
                            return [4 /*yield*/, this.prisma.doctorPayout.update({
                                    where: { id: payoutId },
                                    data: { mpesaReceiptNo: stkRes.data.CheckoutRequestID },
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "STK Push resent successfully. Doctor should enter M-Pesa PIN." }];
                        case 6:
                            err_2 = _a.sent();
                            return [2 /*return*/, { success: false, message: "Sandbox mode: STK Push simulated." }];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        RevenueService_1.prototype.getMpesaToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                var auth, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            auth = Buffer.from("".concat(process.env.MPESA_CONSUMER_KEY, ":").concat(process.env.MPESA_CONSUMER_SECRET)).toString("base64");
                            return [4 /*yield*/, axios_1.default.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", { headers: { Authorization: "Basic ".concat(auth) } })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.data.access_token];
                    }
                });
            });
        };
        RevenueService_1.prototype.updatePayoutStatus = function (payoutId, status, mpesaReceiptNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.doctorPayout.update({
                            where: { id: payoutId },
                            data: {
                                status: status,
                                mpesaReceiptNo: mpesaReceiptNo !== null && mpesaReceiptNo !== void 0 ? mpesaReceiptNo : null,
                                processedAt: status === client_1.PayoutStatus.COMPLETED ? new Date() : null,
                            },
                        })];
                });
            });
        };
        RevenueService_1.prototype.recordCommission = function (appointmentId) {
            return __awaiter(this, void 0, void 0, function () {
                var appointment, existing, consultationFee, commissionAmount, doctorEarning;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.appointment.findUnique({
                                where: { id: appointmentId },
                                include: {
                                    availabilitySlot: { include: { doctor: true } },
                                    patient: true,
                                },
                            })];
                        case 1:
                            appointment = _b.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            return [4 /*yield*/, this.prisma.platformCommission.findUnique({
                                    where: { appointmentId: appointmentId },
                                })];
                        case 2:
                            existing = _b.sent();
                            if (existing)
                                return [2 /*return*/, existing];
                            consultationFee = Number((_a = appointment.availabilitySlot.doctor.consultationFee) !== null && _a !== void 0 ? _a : 0);
                            commissionAmount = consultationFee * PLATFORM_COMMISSION_RATE;
                            doctorEarning = consultationFee - commissionAmount;
                            return [2 /*return*/, this.prisma.platformCommission.create({
                                    data: {
                                        appointmentId: appointmentId,
                                        doctorProfileId: appointment.availabilitySlot.doctorId,
                                        patientProfileId: appointment.patientId,
                                        consultationFee: consultationFee,
                                        commissionRate: PLATFORM_COMMISSION_RATE * 100,
                                        commissionAmount: commissionAmount,
                                        doctorEarning: doctorEarning,
                                    },
                                })];
                    }
                });
            });
        };
        RevenueService_1.prototype.getRecentCommissions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.platformCommission.findMany({
                            take: 20,
                            orderBy: { createdAt: "desc" },
                            include: {
                                doctorProfile: { include: { user: { select: { fullName: true } } } },
                                patientProfile: { include: { user: { select: { fullName: true } } } },
                                appointment: { select: { status: true, createdAt: true } },
                            },
                        })];
                });
            });
        };
        return RevenueService_1;
    }());
    __setFunctionName(_classThis, "RevenueService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RevenueService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RevenueService = _classThis;
}();
exports.RevenueService = RevenueService;
