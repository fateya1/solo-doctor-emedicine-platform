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
exports.OnboardingController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var OnboardingController = function () {
    var _classDecorators = [(0, common_1.Controller)("onboarding"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getStatus_decorators;
    var _saveProfile_decorators;
    var _saveDocuments_decorators;
    var _completePayment_decorators;
    var OnboardingController = _classThis = /** @class */ (function () {
        function OnboardingController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        OnboardingController_1.prototype.getStatus = function (req) {
            return this.service.getStatus(req.user.sub);
        };
        OnboardingController_1.prototype.saveProfile = function (req, body) {
            return this.service.saveProfile(req.user.sub, body);
        };
        OnboardingController_1.prototype.saveDocuments = function (req, body) {
            return this.service.saveDocuments(req.user.sub, body);
        };
        OnboardingController_1.prototype.completePayment = function (req) {
            return this.service.completePaymentStep(req.user.sub);
        };
        return OnboardingController_1;
    }());
    __setFunctionName(_classThis, "OnboardingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getStatus_decorators = [(0, common_1.Get)("status")];
        _saveProfile_decorators = [(0, common_1.Post)("profile")];
        _saveDocuments_decorators = [(0, common_1.Post)("documents")];
        _completePayment_decorators = [(0, common_1.Post)("complete-payment")];
        __esDecorate(_classThis, null, _getStatus_decorators, { kind: "method", name: "getStatus", static: false, private: false, access: { has: function (obj) { return "getStatus" in obj; }, get: function (obj) { return obj.getStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _saveProfile_decorators, { kind: "method", name: "saveProfile", static: false, private: false, access: { has: function (obj) { return "saveProfile" in obj; }, get: function (obj) { return obj.saveProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _saveDocuments_decorators, { kind: "method", name: "saveDocuments", static: false, private: false, access: { has: function (obj) { return "saveDocuments" in obj; }, get: function (obj) { return obj.saveDocuments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _completePayment_decorators, { kind: "method", name: "completePayment", static: false, private: false, access: { has: function (obj) { return "completePayment" in obj; }, get: function (obj) { return obj.completePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OnboardingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OnboardingController = _classThis;
}();
exports.OnboardingController = OnboardingController;
