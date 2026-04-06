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
exports.AdminController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var AdminController = function () {
    var _classDecorators = [(0, common_1.Controller)("admin"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)("ADMIN")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getStats_decorators;
    var _getTenants_decorators;
    var _getTenant_decorators;
    var _toggleTenant_decorators;
    var _getDoctors_decorators;
    var _getPendingDoctors_decorators;
    var _verifyDoctor_decorators;
    var _getPatients_decorators;
    var _toggleUser_decorators;
    var _getSubscriptions_decorators;
    var _getRecentAppointments_decorators;
    var AdminController = _classThis = /** @class */ (function () {
        function AdminController_1(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        AdminController_1.prototype.getStats = function () {
            return this.adminService.getPlatformStats();
        };
        AdminController_1.prototype.getTenants = function () {
            return this.adminService.getAllTenants();
        };
        AdminController_1.prototype.getTenant = function (id) {
            return this.adminService.getTenantDetails(id);
        };
        AdminController_1.prototype.toggleTenant = function (id) {
            return this.adminService.toggleTenantStatus(id);
        };
        AdminController_1.prototype.getDoctors = function () {
            return this.adminService.getAllDoctors();
        };
        AdminController_1.prototype.getPendingDoctors = function () {
            return this.adminService.getPendingDoctors();
        };
        AdminController_1.prototype.verifyDoctor = function (id) {
            return this.adminService.verifyDoctor(id);
        };
        AdminController_1.prototype.getPatients = function () {
            return this.adminService.getAllPatients();
        };
        AdminController_1.prototype.toggleUser = function (id) {
            return this.adminService.toggleUserStatus(id);
        };
        AdminController_1.prototype.getSubscriptions = function () {
            return this.adminService.getAllSubscriptions();
        };
        AdminController_1.prototype.getRecentAppointments = function () {
            return this.adminService.getRecentAppointments();
        };
        return AdminController_1;
    }());
    __setFunctionName(_classThis, "AdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getStats_decorators = [(0, common_1.Get)("stats")];
        _getTenants_decorators = [(0, common_1.Get)("tenants")];
        _getTenant_decorators = [(0, common_1.Get)("tenants/:id")];
        _toggleTenant_decorators = [(0, common_1.Patch)("tenants/:id/toggle")];
        _getDoctors_decorators = [(0, common_1.Get)("doctors")];
        _getPendingDoctors_decorators = [(0, common_1.Get)("doctors/pending")];
        _verifyDoctor_decorators = [(0, common_1.Patch)("doctors/:id/verify")];
        _getPatients_decorators = [(0, common_1.Get)("patients")];
        _toggleUser_decorators = [(0, common_1.Patch)("users/:id/toggle")];
        _getSubscriptions_decorators = [(0, common_1.Get)("subscriptions")];
        _getRecentAppointments_decorators = [(0, common_1.Get)("appointments/recent")];
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTenants_decorators, { kind: "method", name: "getTenants", static: false, private: false, access: { has: function (obj) { return "getTenants" in obj; }, get: function (obj) { return obj.getTenants; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTenant_decorators, { kind: "method", name: "getTenant", static: false, private: false, access: { has: function (obj) { return "getTenant" in obj; }, get: function (obj) { return obj.getTenant; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggleTenant_decorators, { kind: "method", name: "toggleTenant", static: false, private: false, access: { has: function (obj) { return "toggleTenant" in obj; }, get: function (obj) { return obj.toggleTenant; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDoctors_decorators, { kind: "method", name: "getDoctors", static: false, private: false, access: { has: function (obj) { return "getDoctors" in obj; }, get: function (obj) { return obj.getDoctors; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPendingDoctors_decorators, { kind: "method", name: "getPendingDoctors", static: false, private: false, access: { has: function (obj) { return "getPendingDoctors" in obj; }, get: function (obj) { return obj.getPendingDoctors; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyDoctor_decorators, { kind: "method", name: "verifyDoctor", static: false, private: false, access: { has: function (obj) { return "verifyDoctor" in obj; }, get: function (obj) { return obj.verifyDoctor; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPatients_decorators, { kind: "method", name: "getPatients", static: false, private: false, access: { has: function (obj) { return "getPatients" in obj; }, get: function (obj) { return obj.getPatients; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggleUser_decorators, { kind: "method", name: "toggleUser", static: false, private: false, access: { has: function (obj) { return "toggleUser" in obj; }, get: function (obj) { return obj.toggleUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubscriptions_decorators, { kind: "method", name: "getSubscriptions", static: false, private: false, access: { has: function (obj) { return "getSubscriptions" in obj; }, get: function (obj) { return obj.getSubscriptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentAppointments_decorators, { kind: "method", name: "getRecentAppointments", static: false, private: false, access: { has: function (obj) { return "getRecentAppointments" in obj; }, get: function (obj) { return obj.getRecentAppointments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
}();
exports.AdminController = AdminController;
