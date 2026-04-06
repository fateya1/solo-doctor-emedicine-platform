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
exports.SubscriptionController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var SubscriptionController = function () {
    var _classDecorators = [(0, common_1.Controller)("subscription")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getPlans_decorators;
    var _getMy_decorators;
    var _initiate_decorators;
    var _mpesaCallback_decorators;
    var _simulate_decorators;
    var SubscriptionController = _classThis = /** @class */ (function () {
        function SubscriptionController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        SubscriptionController_1.prototype.getPlans = function () {
            return this.service.getPlans();
        };
        SubscriptionController_1.prototype.getMy = function (req) {
            return this.service.getSubscription(req.user.tenantId);
        };
        SubscriptionController_1.prototype.initiate = function (req, body) {
            return this.service.initiateMpesaPayment(req.user.tenantId, body.plan, body.phoneNumber);
        };
        SubscriptionController_1.prototype.mpesaCallback = function (body) {
            return this.service.handleMpesaCallback(body);
        };
        SubscriptionController_1.prototype.simulate = function (body) {
            return this.service.simulatePayment(body.paymentId);
        };
        return SubscriptionController_1;
    }());
    __setFunctionName(_classThis, "SubscriptionController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getPlans_decorators = [(0, common_1.Get)("plans")];
        _getMy_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)("my")];
        _initiate_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)("initiate")];
        _mpesaCallback_decorators = [(0, common_1.Post)("mpesa/callback")];
        _simulate_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)("mpesa/simulate")];
        __esDecorate(_classThis, null, _getPlans_decorators, { kind: "method", name: "getPlans", static: false, private: false, access: { has: function (obj) { return "getPlans" in obj; }, get: function (obj) { return obj.getPlans; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMy_decorators, { kind: "method", name: "getMy", static: false, private: false, access: { has: function (obj) { return "getMy" in obj; }, get: function (obj) { return obj.getMy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _initiate_decorators, { kind: "method", name: "initiate", static: false, private: false, access: { has: function (obj) { return "initiate" in obj; }, get: function (obj) { return obj.initiate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _mpesaCallback_decorators, { kind: "method", name: "mpesaCallback", static: false, private: false, access: { has: function (obj) { return "mpesaCallback" in obj; }, get: function (obj) { return obj.mpesaCallback; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _simulate_decorators, { kind: "method", name: "simulate", static: false, private: false, access: { has: function (obj) { return "simulate" in obj; }, get: function (obj) { return obj.simulate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionController = _classThis;
}();
exports.SubscriptionController = SubscriptionController;
