"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AppointmentsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var AppointmentsController = function () {
    var _classDecorators = [(0, common_1.Controller)("appointments"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _book_decorators;
    var _myAppointments_decorators;
    var _doctorAppointments_decorators;
    var _updateStatus_decorators;
    var _scheduleFollowUp_decorators;
    var _cancel_decorators;
    var AppointmentsController = _classThis = /** @class */ (function () {
        function AppointmentsController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        AppointmentsController_1.prototype.book = function (req, dto) {
            return this.service.bookSlot(req.user.sub, dto);
        };
        AppointmentsController_1.prototype.myAppointments = function (req) {
            return this.service.getPatientAppointments(req.user.sub);
        };
        AppointmentsController_1.prototype.doctorAppointments = function (req) {
            return this.service.getDoctorAppointments(req.user.sub);
        };
        AppointmentsController_1.prototype.updateStatus = function (req, id, body) {
            return this.service.updateAppointmentStatus(id, req.user.sub, body.status);
        };
        AppointmentsController_1.prototype.scheduleFollowUp = function (req, id, body) {
            return this.service.scheduleFollowUp(req.user.sub, __assign({ appointmentId: id }, body));
        };
        AppointmentsController_1.prototype.cancel = function (req, id, body) {
            return this.service.cancelAppointment(id, req.user.sub, body === null || body === void 0 ? void 0 : body.reason);
        };
        return AppointmentsController_1;
    }());
    __setFunctionName(_classThis, "AppointmentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _book_decorators = [(0, common_1.Post)("book")];
        _myAppointments_decorators = [(0, common_1.Get)("my")];
        _doctorAppointments_decorators = [(0, common_1.Get)("doctor")];
        _updateStatus_decorators = [(0, common_1.Patch)(":id/status")];
        _scheduleFollowUp_decorators = [(0, common_1.Post)(":id/follow-up")];
        _cancel_decorators = [(0, common_1.Delete)(":id/cancel")];
        __esDecorate(_classThis, null, _book_decorators, { kind: "method", name: "book", static: false, private: false, access: { has: function (obj) { return "book" in obj; }, get: function (obj) { return obj.book; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _myAppointments_decorators, { kind: "method", name: "myAppointments", static: false, private: false, access: { has: function (obj) { return "myAppointments" in obj; }, get: function (obj) { return obj.myAppointments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _doctorAppointments_decorators, { kind: "method", name: "doctorAppointments", static: false, private: false, access: { has: function (obj) { return "doctorAppointments" in obj; }, get: function (obj) { return obj.doctorAppointments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scheduleFollowUp_decorators, { kind: "method", name: "scheduleFollowUp", static: false, private: false, access: { has: function (obj) { return "scheduleFollowUp" in obj; }, get: function (obj) { return obj.scheduleFollowUp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancel_decorators, { kind: "method", name: "cancel", static: false, private: false, access: { has: function (obj) { return "cancel" in obj; }, get: function (obj) { return obj.cancel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppointmentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppointmentsController = _classThis;
}();
exports.AppointmentsController = AppointmentsController;
