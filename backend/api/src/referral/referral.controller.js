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
exports.ReferralController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var ReferralController = function () {
    var _classDecorators = [(0, common_1.Controller)("referrals"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _request_decorators;
    var _approve_decorators;
    var _reject_decorators;
    var _book_decorators;
    var _patientReferrals_decorators;
    var _doctorReferrals_decorators;
    var _specialistReferrals_decorators;
    var _getDoctors_decorators;
    var ReferralController = _classThis = /** @class */ (function () {
        function ReferralController_1(referralService) {
            this.referralService = (__runInitializers(this, _instanceExtraInitializers), referralService);
        }
        ReferralController_1.prototype.create = function (req, dto) {
            return this.referralService.createReferral(req.user.id, dto);
        };
        ReferralController_1.prototype.request = function (req, dto) {
            return this.referralService.requestReferral(req.user.id, dto);
        };
        ReferralController_1.prototype.approve = function (req, id, body) {
            return this.referralService.approveReferral(req.user.id, id, body.specialistId);
        };
        ReferralController_1.prototype.reject = function (req, id) {
            return this.referralService.rejectReferral(req.user.id, id);
        };
        ReferralController_1.prototype.book = function (req, dto) {
            return this.referralService.bookReferralAppointment(req.user.id, dto);
        };
        ReferralController_1.prototype.patientReferrals = function (req) {
            return this.referralService.getPatientReferrals(req.user.id);
        };
        ReferralController_1.prototype.doctorReferrals = function (req) {
            return this.referralService.getDoctorReferrals(req.user.id);
        };
        ReferralController_1.prototype.specialistReferrals = function (req) {
            return this.referralService.getSpecialistReferrals(req.user.id);
        };
        ReferralController_1.prototype.getDoctors = function (speciality) {
            return this.referralService.getDoctors(speciality);
        };
        return ReferralController_1;
    }());
    __setFunctionName(_classThis, "ReferralController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _request_decorators = [(0, common_1.Post)("request")];
        _approve_decorators = [(0, common_1.Put)(":id/approve")];
        _reject_decorators = [(0, common_1.Put)(":id/reject")];
        _book_decorators = [(0, common_1.Post)("book")];
        _patientReferrals_decorators = [(0, common_1.Get)("my")];
        _doctorReferrals_decorators = [(0, common_1.Get)("doctor")];
        _specialistReferrals_decorators = [(0, common_1.Get)("specialist")];
        _getDoctors_decorators = [(0, common_1.Get)("doctors")];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _request_decorators, { kind: "method", name: "request", static: false, private: false, access: { has: function (obj) { return "request" in obj; }, get: function (obj) { return obj.request; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approve_decorators, { kind: "method", name: "approve", static: false, private: false, access: { has: function (obj) { return "approve" in obj; }, get: function (obj) { return obj.approve; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reject_decorators, { kind: "method", name: "reject", static: false, private: false, access: { has: function (obj) { return "reject" in obj; }, get: function (obj) { return obj.reject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _book_decorators, { kind: "method", name: "book", static: false, private: false, access: { has: function (obj) { return "book" in obj; }, get: function (obj) { return obj.book; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patientReferrals_decorators, { kind: "method", name: "patientReferrals", static: false, private: false, access: { has: function (obj) { return "patientReferrals" in obj; }, get: function (obj) { return obj.patientReferrals; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _doctorReferrals_decorators, { kind: "method", name: "doctorReferrals", static: false, private: false, access: { has: function (obj) { return "doctorReferrals" in obj; }, get: function (obj) { return obj.doctorReferrals; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _specialistReferrals_decorators, { kind: "method", name: "specialistReferrals", static: false, private: false, access: { has: function (obj) { return "specialistReferrals" in obj; }, get: function (obj) { return obj.specialistReferrals; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDoctors_decorators, { kind: "method", name: "getDoctors", static: false, private: false, access: { has: function (obj) { return "getDoctors" in obj; }, get: function (obj) { return obj.getDoctors; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReferralController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReferralController = _classThis;
}();
exports.ReferralController = ReferralController;
