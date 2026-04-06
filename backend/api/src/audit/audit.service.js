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
exports.AuditService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var AuditService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditService = _classThis = /** @class */ (function () {
        function AuditService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(AuditService.name);
        }
        AuditService_1.prototype.log = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        userId: (_a = dto.userId) !== null && _a !== void 0 ? _a : null,
                                        action: dto.action,
                                        entity: (_b = dto.entity) !== null && _b !== void 0 ? _b : null,
                                        entityId: (_c = dto.entityId) !== null && _c !== void 0 ? _c : null,
                                        ipAddress: (_d = dto.ipAddress) !== null && _d !== void 0 ? _d : null,
                                        userAgent: dto.userAgent ? dto.userAgent.substring(0, 500) : null,
                                        metadata: (_e = dto.metadata) !== null && _e !== void 0 ? _e : client_1.Prisma.JsonNull,
                                        success: (_f = dto.success) !== null && _f !== void 0 ? _f : true,
                                        error: (_g = dto.error) !== null && _g !== void 0 ? _g : null,
                                    },
                                })];
                        case 1:
                            _h.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _h.sent();
                            this.logger.error("Failed to write audit log: ".concat(err_1.message));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuditService_1.prototype.getAuditLogs = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, skip, where, _a, logs, total;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = (_b = filters.page) !== null && _b !== void 0 ? _b : 1;
                            limit = Math.min((_c = filters.limit) !== null && _c !== void 0 ? _c : 50, 100);
                            skip = (page - 1) * limit;
                            where = {};
                            if (filters.userId)
                                where.userId = filters.userId;
                            if (filters.action)
                                where.action = filters.action;
                            if (filters.startDate || filters.endDate) {
                                where.createdAt = {};
                                if (filters.startDate)
                                    where.createdAt.gte = new Date(filters.startDate);
                                if (filters.endDate)
                                    where.createdAt.lte = new Date(filters.endDate);
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.auditLog.findMany({
                                        where: where,
                                        include: {
                                            user: { select: { fullName: true, email: true, role: true } },
                                        },
                                        orderBy: { createdAt: "desc" },
                                        skip: skip,
                                        take: limit,
                                    }),
                                    this.prisma.auditLog.count({ where: where }),
                                ])];
                        case 1:
                            _a = _d.sent(), logs = _a[0], total = _a[1];
                            return [2 /*return*/, { logs: logs, total: total, page: page, limit: limit, totalPages: Math.ceil(total / limit) }];
                    }
                });
            });
        };
        AuditService_1.prototype.getAuditStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, last24h, last7d, _a, total, last24hCount, last7dCount, byAction, failedCount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                            last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.auditLog.count(),
                                    this.prisma.auditLog.count({ where: { createdAt: { gte: last24h } } }),
                                    this.prisma.auditLog.count({ where: { createdAt: { gte: last7d } } }),
                                    this.prisma.auditLog.groupBy({
                                        by: ["action"],
                                        _count: { action: true },
                                        orderBy: { _count: { action: "desc" } },
                                        take: 10,
                                    }),
                                    this.prisma.auditLog.count({ where: { success: false } }),
                                ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], last24hCount = _a[1], last7dCount = _a[2], byAction = _a[3], failedCount = _a[4];
                            return [2 /*return*/, {
                                    total: total,
                                    last24h: last24hCount,
                                    last7d: last7dCount,
                                    failedCount: failedCount,
                                    byAction: byAction.map(function (b) { return ({ action: b.action, count: b._count.action }); }),
                                }];
                    }
                });
            });
        };
        return AuditService_1;
    }());
    __setFunctionName(_classThis, "AuditService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditService = _classThis;
}();
exports.AuditService = AuditService;
