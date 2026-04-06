"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var RevenueController = function () {
    var _classDecorators = [(0, common_1.Controller)("revenue"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)("ADMIN")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getSummary_decorators;
    var _getDoctorEarnings_decorators;
    var _getPayouts_decorators;
    var _getCommissions_decorators;
    var _createPayout_decorators;
    var _updatePayoutStatus_decorators;
    var _resendStkPush_decorators;
    var _recordCommission_decorators;
    var RevenueController = _classThis = /** @class */ (function () {
        function RevenueController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        RevenueController_1.prototype.getSummary = function () {
            return this.service.getPlatformRevenueSummary();
        };
        RevenueController_1.prototype.getDoctorEarnings = function () {
            return this.service.getDoctorEarnings();
        };
        RevenueController_1.prototype.getPayouts = function () {
            return this.service.getAllPayouts();
        };
        RevenueController_1.prototype.getCommissions = function () {
            return this.service.getRecentCommissions();
        };
        RevenueController_1.prototype.createPayout = function (doctorProfileId, dto) {
            return this.service.createPayout(doctorProfileId, dto);
        };
        RevenueController_1.prototype.updatePayoutStatus = function (id, body) {
            return this.service.updatePayoutStatus(id, body.status, body.mpesaReceiptNo);
        };
        RevenueController_1.prototype.resendStkPush = function (id) {
            return this.service.resendStkPush(id);
        };
        RevenueController_1.prototype.recordCommission = function (appointmentId) {
            return this.service.recordCommission(appointmentId);
        };
        return RevenueController_1;
    }());
    __setFunctionName(_classThis, "RevenueController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getSummary_decorators = [(0, common_1.Get)("summary")];
        _getDoctorEarnings_decorators = [(0, common_1.Get)("doctor-earnings")];
        _getPayouts_decorators = [(0, common_1.Get)("payouts")];
        _getCommissions_decorators = [(0, common_1.Get)("commissions")];
        _createPayout_decorators = [(0, common_1.Post)("payouts/:doctorProfileId")];
        _updatePayoutStatus_decorators = [(0, common_1.Patch)("payouts/:id/status")];
        _resendStkPush_decorators = [(0, common_1.Post)("payouts/:id/resend-stk")];
        _recordCommission_decorators = [(0, common_1.Post)("commissions/:appointmentId/record")];
        __esDecorate(_classThis, null, _getSummary_decorators, { kind: "method", name: "getSummary", static: false, private: false, access: { has: function (obj) { return "getSummary" in obj; }, get: function (obj) { return obj.getSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDoctorEarnings_decorators, { kind: "method", name: "getDoctorEarnings", static: false, private: false, access: { has: function (obj) { return "getDoctorEarnings" in obj; }, get: function (obj) { return obj.getDoctorEarnings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPayouts_decorators, { kind: "method", name: "getPayouts", static: false, private: false, access: { has: function (obj) { return "getPayouts" in obj; }, get: function (obj) { return obj.getPayouts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCommissions_decorators, { kind: "method", name: "getCommissions", static: false, private: false, access: { has: function (obj) { return "getCommissions" in obj; }, get: function (obj) { return obj.getCommissions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPayout_decorators, { kind: "method", name: "createPayout", static: false, private: false, access: { has: function (obj) { return "createPayout" in obj; }, get: function (obj) { return obj.createPayout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePayoutStatus_decorators, { kind: "method", name: "updatePayoutStatus", static: false, private: false, access: { has: function (obj) { return "updatePayoutStatus" in obj; }, get: function (obj) { return obj.updatePayoutStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resendStkPush_decorators, { kind: "method", name: "resendStkPush", static: false, private: false, access: { has: function (obj) { return "resendStkPush" in obj; }, get: function (obj) { return obj.resendStkPush; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordCommission_decorators, { kind: "method", name: "recordCommission", static: false, private: false, access: { has: function (obj) { return "recordCommission" in obj; }, get: function (obj) { return obj.recordCommission; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RevenueController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RevenueController = _classThis;
}();
exports.RevenueController = RevenueController;
