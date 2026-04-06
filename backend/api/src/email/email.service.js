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
exports.EmailService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer = require("nodemailer");
var EmailService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EmailService = _classThis = /** @class */ (function () {
        function EmailService_1() {
            this.logger = new common_1.Logger(EmailService.name);
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
        EmailService_1.prototype.send = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.transporter.sendMail({
                                    from: "\"SoloDoc Platform\" <".concat(process.env.SMTP_USER, ">"),
                                    to: payload.to,
                                    subject: payload.subject,
                                    html: payload.html,
                                })];
                        case 1:
                            _a.sent();
                            this.logger.log("Email sent to ".concat(payload.to, ": ").concat(payload.subject));
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            this.logger.error("Failed to send email to ".concat(payload.to, ": ").concat(err_1.message));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendWelcome = function (to, fullName, role) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.send({
                                to: to,
                                subject: "Welcome to SoloDoc!",
                                html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Welcome to SoloDoc, ".concat(fullName, "!</h1>\n          <p>Your account has been created successfully as a <strong>").concat(role, "</strong>.</p>\n          ").concat(role === "DOCTOR" ? "<p>Please complete your onboarding to start accepting patients.</p>\n          <a href=\"".concat(process.env.FRONTEND_URL, "/onboarding\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">Complete Onboarding</a>") :
                                    "<p>You can now browse available doctors and book appointments.</p>\n          <a href=\"".concat(process.env.FRONTEND_URL, "/dashboard/patient\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">Go to Dashboard</a>"), "\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendPasswordReset = function (to, fullName, resetUrl) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.send({
                                to: to,
                                subject: "Reset your SoloDoc password",
                                html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <div style=\"text-align:center;margin-bottom:32px;\">\n            <div style=\"display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#eff6ff;border-radius:12px;margin-bottom:16px;\">\n              <span style=\"font-size:24px;\">\uD83D\uDD12</span>\n            </div>\n            <h1 style=\"color:#0f172a;margin:0;font-size:24px;\">Reset your password</h1>\n          </div>\n          <p style=\"color:#475569;\">Hi ".concat(fullName, ",</p>\n          <p style=\"color:#475569;\">We received a request to reset the password for your SoloDoc account. Click the button below to choose a new password.</p>\n          <div style=\"text-align:center;margin:32px 0;\">\n            <a href=\"").concat(resetUrl, "\" style=\"background:#0284c7;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px;\">Reset Password</a>\n          </div>\n          <div style=\"background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;color:#64748b;font-size:13px;\">\u23F1 This link expires in <strong>1 hour</strong>.</p>\n            <p style=\"margin:8px 0 0;color:#64748b;font-size:13px;\">\uD83D\uDD10 If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>\n          </div>\n          <p style=\"color:#94a3b8;font-size:12px;margin-top:24px;\">\n            If the button doesn't work, copy and paste this link into your browser:<br/>\n            <a href=\"").concat(resetUrl, "\" style=\"color:#0284c7;word-break:break-all;\">").concat(resetUrl, "</a>\n          </p>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendAppointmentConfirmation = function (patientEmail, patientName, doctorName, startTime, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
                            return [4 /*yield*/, this.send({
                                    to: patientEmail,
                                    subject: "Appointment Confirmed - SoloDoc",
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Appointment Confirmed</h1>\n          <p>Hi ".concat(patientName, ",</p>\n          <p>Your appointment has been confirmed with <strong>Dr. ").concat(doctorName, "</strong>.</p>\n          <div style=\"background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;\"><strong>Date & Time:</strong> ").concat(dateStr, "</p>\n            ").concat(reason ? "<p style=\"margin:8px 0 0;\"><strong>Reason:</strong> ".concat(reason, "</p>") : "", "\n          </div>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/patient\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">View Appointment</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendAppointmentNotificationToDoctor = function (doctorEmail, doctorName, patientName, startTime, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
                            return [4 /*yield*/, this.send({
                                    to: doctorEmail,
                                    subject: "New Appointment Booked - SoloDoc",
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">New Appointment</h1>\n          <p>Hi Dr. ".concat(doctorName, ",</p>\n          <p><strong>").concat(patientName, "</strong> has booked an appointment with you.</p>\n          <div style=\"background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;\"><strong>Date & Time:</strong> ").concat(dateStr, "</p>\n            ").concat(reason ? "<p style=\"margin:8px 0 0;\"><strong>Reason:</strong> ".concat(reason, "</p>") : "", "\n          </div>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/doctor\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">View Dashboard</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendAppointmentCancellation = function (to, name, role, startTime) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
                            return [4 /*yield*/, this.send({
                                    to: to,
                                    subject: "Appointment Cancelled - SoloDoc",
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#dc2626;\">Appointment Cancelled</h1>\n          <p>Hi ".concat(role === "DOCTOR" ? "Dr. " : "").concat(name, ",</p>\n          <p>An appointment scheduled for <strong>").concat(dateStr, "</strong> has been cancelled.</p>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/").concat(role.toLowerCase(), "\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">View Dashboard</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendVerificationApproved = function (to, fullName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.send({
                                to: to,
                                subject: "Your Account Has Been Verified - SoloDoc",
                                html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#16a34a;\">Account Verified!</h1>\n          <p>Hi Dr. ".concat(fullName, ",</p>\n          <p>Congratulations! Your doctor account has been verified by our admin team.</p>\n          <p>You can now accept patients and manage your availability slots.</p>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/doctor\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">Go to Dashboard</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendPaymentReceipt = function (to, fullName, amount, plan, mpesaReceiptNo, periodEnd) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = periodEnd.toLocaleDateString("en-KE", { dateStyle: "full" });
                            return [4 /*yield*/, this.send({
                                    to: to,
                                    subject: "Payment Receipt - SoloDoc Subscription",
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Payment Receipt</h1>\n          <p>Hi Dr. ".concat(fullName, ",</p>\n          <p>Thank you for your payment. Your subscription has been activated.</p>\n          <div style=\"background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;\"><strong>Plan:</strong> ").concat(plan, "</p>\n            <p style=\"margin:8px 0 0;\"><strong>Amount:</strong> KES ").concat(amount.toLocaleString(), "</p>\n            <p style=\"margin:8px 0 0;\"><strong>M-Pesa Receipt:</strong> ").concat(mpesaReceiptNo, "</p>\n            <p style=\"margin:8px 0 0;\"><strong>Valid Until:</strong> ").concat(dateStr, "</p>\n          </div>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/doctor\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">Go to Dashboard</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendSubscriptionRenewalReminder = function (to, fullName, plan, expiryDate, daysLeft) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = expiryDate.toLocaleDateString("en-KE", { dateStyle: "full" });
                            return [4 /*yield*/, this.send({
                                    to: to,
                                    subject: "Your SoloDoc subscription expires in ".concat(daysLeft, " day").concat(daysLeft === 1 ? "" : "s"),
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#d97706;\">Subscription Expiring Soon</h1>\n          <p>Hi Dr. ".concat(fullName, ",</p>\n          <p>Your <strong>").concat(plan, "</strong> plan expires on <strong>").concat(dateStr, "</strong> (").concat(daysLeft, " day").concat(daysLeft === 1 ? "" : "s", " remaining).</p>\n          <p>Renew now to keep your account active and continue accepting patients without interruption.</p>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/doctor\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">Renew Subscription</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendVideoConsultationInvite = function (to, patientName, doctorName, appointmentId, startTime) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr, joinUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
                            joinUrl = "".concat(process.env.FRONTEND_URL, "/dashboard/patient?video=").concat(appointmentId);
                            return [4 /*yield*/, this.send({
                                    to: to,
                                    subject: "Your Video Consultation is Ready - SoloDoc",
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Video Consultation Ready</h1>\n          <p>Hi ".concat(patientName, ",</p>\n          <p>Dr. ").concat(doctorName, " has started your video consultation room.</p>\n          <div style=\"background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;\"><strong>Appointment:</strong> ").concat(dateStr, "</p>\n          </div>\n          <a href=\"").concat(joinUrl, "\" style=\"background:#0284c7;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;font-weight:600;\">Join Video Call</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendAppointmentReminder = function (to, patientName, doctorName, startTime, timeUntil) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
                            return [4 /*yield*/, this.send({
                                    to: to,
                                    subject: "Appointment Reminder: ".concat(timeUntil, " until your consultation - SoloDoc"),
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Appointment Reminder</h1>\n          <p>Hi ".concat(patientName, ",</p>\n          <p>This is a reminder that you have an appointment with <strong>Dr. ").concat(doctorName, "</strong> in <strong>").concat(timeUntil, "</strong>.</p>\n          <div style=\"background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;\"><strong>Date & Time:</strong> ").concat(dateStr, "</p>\n          </div>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/patient\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">View Appointment</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendAppointmentReminderToDoctor = function (to, doctorName, patientName, startTime, timeUntil) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
                            return [4 /*yield*/, this.send({
                                    to: to,
                                    subject: "Upcoming Appointment Reminder: ".concat(timeUntil, " - SoloDoc"),
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Upcoming Appointment</h1>\n          <p>Hi Dr. ".concat(doctorName, ",</p>\n          <p>You have an appointment with <strong>").concat(patientName, "</strong> in <strong>").concat(timeUntil, "</strong>.</p>\n          <div style=\"background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;\"><strong>Date & Time:</strong> ").concat(dateStr, "</p>\n          </div>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/doctor\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">View Dashboard</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendFollowUpNotification = function (to, patientName, doctorName, startTime, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var dateStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
                            return [4 /*yield*/, this.send({
                                    to: to,
                                    subject: "Follow-up Appointment Scheduled - SoloDoc",
                                    html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Follow-up Appointment Scheduled</h1>\n          <p>Hi ".concat(patientName, ",</p>\n          <p>Dr. ").concat(doctorName, " has scheduled a follow-up appointment for you.</p>\n          <div style=\"background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;\">\n            <p style=\"margin:0;\"><strong>Date & Time:</strong> ").concat(dateStr, "</p>\n            <p style=\"margin:8px 0 0;\"><strong>Reason:</strong> ").concat(reason, "</p>\n          </div>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/dashboard/patient\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">View Appointment</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">The SoloDoc Team</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendWaitlistNotification = function (to, patientName, doctorName, doctorProfileId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.send({
                                to: to,
                                subject: "A slot is now available with Dr. ".concat(doctorName, " - SoloDoc"),
                                html: "\n        <div style=\"font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;\">\n          <h1 style=\"color:#0284c7;\">Good news, ".concat(patientName, "!</h1>\n          <p>A slot has just become available with <strong>Dr. ").concat(doctorName, "</strong>.</p>\n          <p>Book now before it fills up \u2014 slots go fast!</p>\n          <a href=\"").concat(process.env.FRONTEND_URL, "/doctors/").concat(doctorProfileId, "\" style=\"background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;\">Book Now</a>\n          <p style=\"color:#64748b;margin-top:32px;font-size:14px;\">You received this because you joined the waitlist for Dr. ").concat(doctorName, ". The SoloDoc Team</p>\n        </div>\n      "),
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return EmailService_1;
    }());
    __setFunctionName(_classThis, "EmailService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailService = _classThis;
}();
exports.EmailService = EmailService;
