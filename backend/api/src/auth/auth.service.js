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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var client_1 = require("@prisma/client");
var DEFAULT_TENANT_ID = (_a = process.env.DEFAULT_TENANT_ID) !== null && _a !== void 0 ? _a : "default-tenant";
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService, emailService, auditService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.emailService = emailService;
            this.auditService = auditService;
        }
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var tenantId, email, passwordHash, existing, user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            tenantId = (_a = dto.tenantId) !== null && _a !== void 0 ? _a : DEFAULT_TENANT_ID;
                            email = dto.email.toLowerCase().trim();
                            return [4 /*yield*/, bcrypt.hash(dto.password, 12)];
                        case 1:
                            passwordHash = _b.sent();
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { tenantId_email: { tenantId: tenantId, email: email } },
                                })];
                        case 2:
                            existing = _b.sent();
                            if (existing)
                                throw new Error("Email already registered");
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        tenantId: tenantId,
                                        email: email,
                                        passwordHash: passwordHash,
                                        fullName: dto.fullName.trim(),
                                        role: dto.role,
                                        doctorProfile: dto.role === client_1.UserRole.DOCTOR ? { create: {} } : undefined,
                                        patientProfile: dto.role === client_1.UserRole.PATIENT ? { create: {} } : undefined,
                                    },
                                    select: { id: true, email: true, fullName: true, role: true, tenantId: true, createdAt: true },
                                })];
                        case 3:
                            user = _b.sent();
                            this.emailService.sendWelcome(user.email, user.fullName, user.role).catch(function () { });
                            return [4 /*yield*/, this.auditService.log({
                                    userId: user.id,
                                    action: "REGISTER",
                                    entity: "User",
                                    entityId: user.id,
                                    metadata: { email: user.email, role: user.role },
                                })];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (dto, ipAddress, userAgent) {
            return __awaiter(this, void 0, void 0, function () {
                var email, user, passwordMatch, payload, accessToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            email = dto.email.toLowerCase().trim();
                            return [4 /*yield*/, this.prisma.user.findFirst({ where: { email: email, isActive: true } })];
                        case 1:
                            user = _a.sent();
                            if (!!user) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.auditService.log({
                                    action: "LOGIN",
                                    metadata: { email: email, reason: "User not found" },
                                    ipAddress: ipAddress,
                                    userAgent: userAgent,
                                    success: false,
                                    error: "Invalid credentials",
                                })];
                        case 2:
                            _a.sent();
                            throw new common_1.UnauthorizedException("Invalid credentials");
                        case 3: return [4 /*yield*/, bcrypt.compare(dto.password, user.passwordHash)];
                        case 4:
                            passwordMatch = _a.sent();
                            if (!!passwordMatch) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.auditService.log({
                                    userId: user.id,
                                    action: "LOGIN",
                                    entity: "User",
                                    entityId: user.id,
                                    metadata: { email: email },
                                    ipAddress: ipAddress,
                                    userAgent: userAgent,
                                    success: false,
                                    error: "Invalid password",
                                })];
                        case 5:
                            _a.sent();
                            throw new common_1.UnauthorizedException("Invalid credentials");
                        case 6: return [4 /*yield*/, this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })];
                        case 7:
                            _a.sent();
                            payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
                            return [4 /*yield*/, this.jwtService.signAsync(payload)];
                        case 8:
                            accessToken = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: user.id,
                                    action: "LOGIN",
                                    entity: "User",
                                    entityId: user.id,
                                    metadata: { email: user.email, role: user.role },
                                    ipAddress: ipAddress,
                                    userAgent: userAgent,
                                    success: true,
                                })];
                        case 9:
                            _a.sent();
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, tenantId: user.tenantId },
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.forgotPassword = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, resetToken, resetUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: { email: email.toLowerCase().trim(), isActive: true },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, { message: "If that email is registered, a reset link has been sent." }];
                            return [4 /*yield*/, this.jwtService.signAsync({ sub: user.id, email: user.email, purpose: "password-reset" }, { expiresIn: "1h" })];
                        case 2:
                            resetToken = _a.sent();
                            resetUrl = "".concat(process.env.FRONTEND_URL, "/auth/reset-password?token=").concat(resetToken);
                            return [4 /*yield*/, this.emailService.sendPasswordReset(user.email, user.fullName, resetUrl)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: user.id,
                                    action: "PASSWORD_RESET_REQUEST",
                                    entity: "User",
                                    entityId: user.id,
                                    metadata: { email: user.email },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { message: "If that email is registered, a reset link has been sent." }];
                    }
                });
            });
        };
        AuthService_1.prototype.resetPassword = function (token, newPassword) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, _a, user, passwordHash;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!newPassword || newPassword.length < 8) {
                                throw new common_1.BadRequestException("Password must be at least 8 characters");
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.jwtService.verifyAsync(token)];
                        case 2:
                            payload = _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            throw new common_1.BadRequestException("This reset link is invalid or has expired.");
                        case 4:
                            if (payload.purpose !== "password-reset")
                                throw new common_1.BadRequestException("Invalid reset token");
                            return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: payload.sub } })];
                        case 5:
                            user = _b.sent();
                            if (!user || !user.isActive)
                                throw new common_1.BadRequestException("Account not found or inactive");
                            return [4 /*yield*/, bcrypt.hash(newPassword, 12)];
                        case 6:
                            passwordHash = _b.sent();
                            return [4 /*yield*/, this.prisma.user.update({ where: { id: payload.sub }, data: { passwordHash: passwordHash } })];
                        case 7:
                            _b.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: user.id,
                                    action: "PASSWORD_RESET_COMPLETE",
                                    entity: "User",
                                    entityId: user.id,
                                    metadata: { email: user.email },
                                })];
                        case 8:
                            _b.sent();
                            return [2 /*return*/, { message: "Password updated successfully. You can now log in." }];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
