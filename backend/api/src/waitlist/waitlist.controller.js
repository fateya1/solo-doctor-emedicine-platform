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
exports.WaitlistController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var WaitlistController = function () {
    var _classDecorators = [(0, common_1.Controller)("waitlist"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _join_decorators;
    var _leave_decorators;
    var _status_decorators;
    var _myWaitlist_decorators;
    var _doctorWaitlist_decorators;
    var WaitlistController = _classThis = /** @class */ (function () {
        function WaitlistController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        WaitlistController_1.prototype.join = function (req, doctorProfileId) {
            return this.service.joinWaitlist(req.user.sub, doctorProfileId);
        };
        WaitlistController_1.prototype.leave = function (req, doctorProfileId) {
            return this.service.leaveWaitlist(req.user.sub, doctorProfileId);
        };
        WaitlistController_1.prototype.status = function (req, doctorProfileId) {
            return this.service.getWaitlistStatus(req.user.sub, doctorProfileId);
        };
        WaitlistController_1.prototype.myWaitlist = function (req) {
            return this.service.getPatientWaitlist(req.user.sub);
        };
        WaitlistController_1.prototype.doctorWaitlist = function (req) {
            return this.service.getDoctorWaitlist(req.user.sub);
        };
        return WaitlistController_1;
    }());
    __setFunctionName(_classThis, "WaitlistController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _join_decorators = [(0, common_1.Post)("join/:doctorProfileId")];
        _leave_decorators = [(0, common_1.Delete)("leave/:doctorProfileId")];
        _status_decorators = [(0, common_1.Get)("status/:doctorProfileId")];
        _myWaitlist_decorators = [(0, common_1.Get)("my")];
        _doctorWaitlist_decorators = [(0, common_1.Get)("doctor")];
        __esDecorate(_classThis, null, _join_decorators, { kind: "method", name: "join", static: false, private: false, access: { has: function (obj) { return "join" in obj; }, get: function (obj) { return obj.join; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _leave_decorators, { kind: "method", name: "leave", static: false, private: false, access: { has: function (obj) { return "leave" in obj; }, get: function (obj) { return obj.leave; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _status_decorators, { kind: "method", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _myWaitlist_decorators, { kind: "method", name: "myWaitlist", static: false, private: false, access: { has: function (obj) { return "myWaitlist" in obj; }, get: function (obj) { return obj.myWaitlist; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _doctorWaitlist_decorators, { kind: "method", name: "doctorWaitlist", static: false, private: false, access: { has: function (obj) { return "doctorWaitlist" in obj; }, get: function (obj) { return obj.doctorWaitlist; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WaitlistController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WaitlistController = _classThis;
}();
exports.WaitlistController = WaitlistController;
