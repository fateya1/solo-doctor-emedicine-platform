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
exports.AvailabilityTemplatesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var roles_guard_1 = require("../auth/roles.guard");
var AvailabilityTemplatesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)("Availability Templates"), (0, common_1.Controller)("availability/templates"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)("DOCTOR")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAll_decorators;
    var _create_decorators;
    var _update_decorators;
    var _toggle_decorators;
    var _apply_decorators;
    var _remove_decorators;
    var AvailabilityTemplatesController = _classThis = /** @class */ (function () {
        function AvailabilityTemplatesController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        AvailabilityTemplatesController_1.prototype.getAll = function (req) {
            return this.service.getTemplates(req.user.sub);
        };
        AvailabilityTemplatesController_1.prototype.create = function (req, dto) {
            return this.service.createTemplate(req.user.sub, dto);
        };
        AvailabilityTemplatesController_1.prototype.update = function (req, id, dto) {
            return this.service.updateTemplate(id, req.user.sub, dto);
        };
        AvailabilityTemplatesController_1.prototype.toggle = function (req, id) {
            return this.service.toggleTemplate(id, req.user.sub);
        };
        AvailabilityTemplatesController_1.prototype.apply = function (req, id, dto) {
            return this.service.applyTemplate(id, req.user.sub, dto);
        };
        AvailabilityTemplatesController_1.prototype.remove = function (req, id) {
            return this.service.deleteTemplate(id, req.user.sub);
        };
        return AvailabilityTemplatesController_1;
    }());
    __setFunctionName(_classThis, "AvailabilityTemplatesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: "List all templates for the current doctor" })];
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: "Create a new weekly availability template" })];
        _update_decorators = [(0, common_1.Patch)(":id"), (0, swagger_1.ApiOperation)({ summary: "Update template name / slots" })];
        _toggle_decorators = [(0, common_1.Patch)(":id/toggle"), (0, swagger_1.ApiOperation)({ summary: "Toggle template active / inactive" })];
        _apply_decorators = [(0, common_1.Post)(":id/apply"), (0, swagger_1.ApiOperation)({ summary: "Apply template — generate real availability slots for N weeks" })];
        _remove_decorators = [(0, common_1.Delete)(":id"), (0, swagger_1.ApiOperation)({ summary: "Delete a template" })];
        __esDecorate(_classThis, null, _getAll_decorators, { kind: "method", name: "getAll", static: false, private: false, access: { has: function (obj) { return "getAll" in obj; }, get: function (obj) { return obj.getAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggle_decorators, { kind: "method", name: "toggle", static: false, private: false, access: { has: function (obj) { return "toggle" in obj; }, get: function (obj) { return obj.toggle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _apply_decorators, { kind: "method", name: "apply", static: false, private: false, access: { has: function (obj) { return "apply" in obj; }, get: function (obj) { return obj.apply; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AvailabilityTemplatesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AvailabilityTemplatesController = _classThis;
}();
exports.AvailabilityTemplatesController = AvailabilityTemplatesController;
