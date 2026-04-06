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
exports.SubscriptionService = exports.PLAN_FEATURES = exports.PLAN_PRICES = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var axios_1 = require("axios");
exports.PLAN_PRICES = {
    BASIC: 2000,
    PRO: 5000,
    ENTERPRISE: 12000,
};
exports.PLAN_FEATURES = {
    BASIC: { slots: 50, patients: 100, label: "Basic" },
    PRO: { slots: 200, patients: 500, label: "Pro" },
    ENTERPRISE: { slots: 999999, patients: 999999, label: "Enterprise" },
};
var SubscriptionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SubscriptionService = _classThis = /** @class */ (function () {
        function SubscriptionService_1(prisma, emailService) {
            this.prisma = prisma;
            this.emailService = emailService;
            this.logger = new common_1.Logger(SubscriptionService.name);
        }
        SubscriptionService_1.prototype.getPlans = function () {
            return Object.entries(exports.PLAN_PRICES).map(function (_a) {
                var plan = _a[0], price = _a[1];
                return ({
                    plan: plan,
                    price: price,
                    currency: "KES",
                    features: exports.PLAN_FEATURES[plan],
                });
            });
        };
        SubscriptionService_1.prototype.getSubscription = function (tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.tenantSubscription.findUnique({
                            where: { tenantId: tenantId },
                            include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } },
                        })];
                });
            });
        };
        SubscriptionService_1.prototype.initiateMpesaPayment = function (tenantId, plan, phoneNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var amount, user, subscription, periodEnd, payment, token, timestamp, shortcode, passkey, password, stkRes, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            amount = exports.PLAN_PRICES[plan];
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: { tenantId: tenantId, role: "DOCTOR" },
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("Doctor user not found for this tenant");
                            return [4 /*yield*/, this.prisma.tenantSubscription.findUnique({ where: { tenantId: tenantId } })];
                        case 2:
                            subscription = _a.sent();
                            if (!!subscription) return [3 /*break*/, 4];
                            periodEnd = new Date();
                            periodEnd.setMonth(periodEnd.getMonth() + 1);
                            return [4 /*yield*/, this.prisma.tenantSubscription.create({
                                    data: {
                                        tenantId: tenantId,
                                        plan: plan,
                                        status: client_1.SubscriptionStatus.TRIAL,
                                        currentPeriodEnd: periodEnd,
                                    },
                                })];
                        case 3:
                            subscription = _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.prisma.subscriptionPayment.create({
                                data: {
                                    subscriptionId: subscription.id,
                                    amount: amount,
                                    currency: "KES",
                                    status: client_1.PaymentStatus.PENDING,
                                    phoneNumber: phoneNumber,
                                    plan: plan,
                                },
                            })];
                        case 5:
                            payment = _a.sent();
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 10, , 11]);
                            return [4 /*yield*/, this.getMpesaToken()];
                        case 7:
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
                                    Amount: amount,
                                    PartyA: phoneNumber,
                                    PartyB: shortcode,
                                    PhoneNumber: phoneNumber,
                                    CallBackURL: "".concat(process.env.BACKEND_URL, "/api/subscription/mpesa/callback"),
                                    AccountReference: "SOLODOC-".concat(tenantId.slice(0, 8).toUpperCase()),
                                    TransactionDesc: "SoloDoc ".concat(plan, " Plan"),
                                }, { headers: { Authorization: "Bearer ".concat(token) } })];
                        case 8:
                            stkRes = _a.sent();
                            return [4 /*yield*/, this.prisma.subscriptionPayment.update({
                                    where: { id: payment.id },
                                    data: { mpesaRef: stkRes.data.CheckoutRequestID },
                                })];
                        case 9:
                            _a.sent();
                            return [2 /*return*/, {
                                    paymentId: payment.id,
                                    checkoutRequestId: stkRes.data.CheckoutRequestID,
                                    message: "STK Push sent to your phone. Enter your M-Pesa PIN to complete payment.",
                                }];
                        case 10:
                            err_1 = _a.sent();
                            this.logger.error("M-Pesa STK Push failed: " + err_1.message);
                            // In sandbox/dev, simulate success
                            return [2 /*return*/, {
                                    paymentId: payment.id,
                                    checkoutRequestId: "SANDBOX_" + payment.id,
                                    message: "Sandbox mode: Use /subscription/mpesa/simulate to complete payment.",
                                }];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        SubscriptionService_1.prototype.handleMpesaCallback = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var result, checkoutRequestId, resultCode, payment, meta, receiptNo, periodEnd, doctorUser;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            result = (_a = body === null || body === void 0 ? void 0 : body.Body) === null || _a === void 0 ? void 0 : _a.stkCallback;
                            if (!result)
                                return [2 /*return*/];
                            checkoutRequestId = result.CheckoutRequestID;
                            resultCode = result.ResultCode;
                            return [4 /*yield*/, this.prisma.subscriptionPayment.findFirst({
                                    where: { mpesaRef: checkoutRequestId },
                                    include: { subscription: { include: { tenant: { include: { users: { where: { role: "DOCTOR" }, take: 1 } } } } } },
                                })];
                        case 1:
                            payment = _d.sent();
                            if (!payment)
                                return [2 /*return*/];
                            if (!(resultCode === 0)) return [3 /*break*/, 5];
                            meta = ((_b = result.CallbackMetadata) === null || _b === void 0 ? void 0 : _b.Item) || [];
                            receiptNo = (_c = meta.find(function (i) { return i.Name === "MpesaReceiptNumber"; })) === null || _c === void 0 ? void 0 : _c.Value;
                            periodEnd = new Date();
                            periodEnd.setMonth(periodEnd.getMonth() + 1);
                            return [4 /*yield*/, this.prisma.$transaction([
                                    this.prisma.subscriptionPayment.update({
                                        where: { id: payment.id },
                                        data: { status: client_1.PaymentStatus.COMPLETED, mpesaReceiptNo: receiptNo, paidAt: new Date() },
                                    }),
                                    this.prisma.tenantSubscription.update({
                                        where: { id: payment.subscriptionId },
                                        data: {
                                            status: client_1.SubscriptionStatus.ACTIVE,
                                            plan: payment.plan,
                                            currentPeriodStart: new Date(),
                                            currentPeriodEnd: periodEnd,
                                        },
                                    }),
                                ])];
                        case 2:
                            _d.sent();
                            doctorUser = payment.subscription.tenant.users[0];
                            if (!doctorUser) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.emailService.sendPaymentReceipt(doctorUser.email, doctorUser.fullName, Number(payment.amount), payment.plan, receiptNo || "N/A", periodEnd)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4: return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.prisma.subscriptionPayment.update({
                                where: { id: payment.id },
                                data: { status: client_1.PaymentStatus.FAILED },
                            })];
                        case 6:
                            _d.sent();
                            _d.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        SubscriptionService_1.prototype.simulatePayment = function (paymentId) {
            return __awaiter(this, void 0, void 0, function () {
                var payment, receiptNo, periodEnd, doctorUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.subscriptionPayment.findUnique({
                                where: { id: paymentId },
                                include: { subscription: { include: { tenant: { include: { users: { where: { role: "DOCTOR" }, take: 1 } } } } } },
                            })];
                        case 1:
                            payment = _a.sent();
                            if (!payment)
                                throw new common_1.NotFoundException("Payment not found");
                            receiptNo = "SIM" + Date.now();
                            periodEnd = new Date();
                            periodEnd.setMonth(periodEnd.getMonth() + 1);
                            return [4 /*yield*/, this.prisma.$transaction([
                                    this.prisma.subscriptionPayment.update({
                                        where: { id: paymentId },
                                        data: { status: client_1.PaymentStatus.COMPLETED, mpesaReceiptNo: receiptNo, paidAt: new Date() },
                                    }),
                                    this.prisma.tenantSubscription.update({
                                        where: { id: payment.subscriptionId },
                                        data: {
                                            status: client_1.SubscriptionStatus.ACTIVE,
                                            plan: payment.plan,
                                            currentPeriodStart: new Date(),
                                            currentPeriodEnd: periodEnd,
                                        },
                                    }),
                                ])];
                        case 2:
                            _a.sent();
                            doctorUser = payment.subscription.tenant.users[0];
                            if (!doctorUser) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.emailService.sendPaymentReceipt(doctorUser.email, doctorUser.fullName, Number(payment.amount), payment.plan, receiptNo, periodEnd)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, { success: true, receiptNo: receiptNo, message: "Payment simulated successfully" }];
                    }
                });
            });
        };
        SubscriptionService_1.prototype.getMpesaToken = function () {
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
        return SubscriptionService_1;
    }());
    __setFunctionName(_classThis, "SubscriptionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionService = _classThis;
}();
exports.SubscriptionService = SubscriptionService;
