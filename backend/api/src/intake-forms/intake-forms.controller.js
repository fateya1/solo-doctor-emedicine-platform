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
exports.IntakeFormsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var IntakeFormsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)("Intake Forms"), (0, common_1.Controller)("intake-forms"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _upsertForm_decorators;
    var _getMyForms_decorators;
    var _getForm_decorators;
    var IntakeFormsController = _classThis = /** @class */ (function () {
        function IntakeFormsController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        IntakeFormsController_1.prototype.upsertForm = function (req, appointmentId, dto) {
            return this.service.upsertForm(appointmentId, req.user.sub, dto);
        };
        IntakeFormsController_1.prototype.getMyForms = function (req) {
            return this.service.getMyForms(req.user.sub);
        };
        IntakeFormsController_1.prototype.getForm = function (req, appointmentId) {
            return this.service.getFormByAppointment(appointmentId, req.user.sub, req.user.role);
        };
        return IntakeFormsController_1;
    }());
    __setFunctionName(_classThis, "IntakeFormsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _upsertForm_decorators = [(0, common_1.Post)("appointment/:appointmentId"), (0, swagger_1.ApiOperation)({ summary: "Submit or update intake form for an appointment" })];
        _getMyForms_decorators = [(0, common_1.Get)("my"), (0, swagger_1.ApiOperation)({ summary: "Get all intake forms submitted by the current patient" })];
        _getForm_decorators = [(0, common_1.Get)("appointment/:appointmentId"), (0, swagger_1.ApiOperation)({ summary: "Get intake form for a specific appointment (patient or doctor)" })];
        __esDecorate(_classThis, null, _upsertForm_decorators, { kind: "method", name: "upsertForm", static: false, private: false, access: { has: function (obj) { return "upsertForm" in obj; }, get: function (obj) { return obj.upsertForm; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyForms_decorators, { kind: "method", name: "getMyForms", static: false, private: false, access: { has: function (obj) { return "getMyForms" in obj; }, get: function (obj) { return obj.getMyForms; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getForm_decorators, { kind: "method", name: "getForm", static: false, private: false, access: { has: function (obj) { return "getForm" in obj; }, get: function (obj) { return obj.getForm; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntakeFormsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntakeFormsController = _classThis;
}();
exports.IntakeFormsController = IntakeFormsController;
