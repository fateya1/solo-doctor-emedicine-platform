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
exports.InsuranceController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var roles_guard_1 = require("../auth/roles.guard");
var InsuranceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)("Insurance"), (0, common_1.Controller)("insurance"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _addCard_decorators;
    var _getCards_decorators;
    var _removeCard_decorators;
    var _submitClaim_decorators;
    var _getClaims_decorators;
    var _getClaimByCode_decorators;
    var InsuranceController = _classThis = /** @class */ (function () {
        function InsuranceController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        // ── Cards ──────────────────────────────────────────────────────────────────
        InsuranceController_1.prototype.addCard = function (req, dto) {
            return this.service.addCard(req.user.sub, dto);
        };
        InsuranceController_1.prototype.getCards = function (req) {
            return this.service.getCards(req.user.sub);
        };
        InsuranceController_1.prototype.removeCard = function (req, id) {
            return this.service.deactivateCard(req.user.sub, id);
        };
        // ── Claims ─────────────────────────────────────────────────────────────────
        InsuranceController_1.prototype.submitClaim = function (req, dto) {
            return this.service.submitClaim(req.user.sub, dto);
        };
        InsuranceController_1.prototype.getClaims = function (req) {
            return this.service.getClaims(req.user.sub);
        };
        InsuranceController_1.prototype.getClaimByCode = function (claimCode) {
            return this.service.getClaimByCode(claimCode);
        };
        return InsuranceController_1;
    }());
    __setFunctionName(_classThis, "InsuranceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _addCard_decorators = [(0, common_1.Post)("cards"), (0, roles_decorator_1.Roles)("PATIENT"), (0, swagger_1.ApiOperation)({ summary: "Add an insurance card" })];
        _getCards_decorators = [(0, common_1.Get)("cards"), (0, roles_decorator_1.Roles)("PATIENT"), (0, swagger_1.ApiOperation)({ summary: "List all active insurance cards for the patient" })];
        _removeCard_decorators = [(0, common_1.Delete)("cards/:id"), (0, roles_decorator_1.Roles)("PATIENT"), (0, swagger_1.ApiOperation)({ summary: "Deactivate (soft-delete) an insurance card" })];
        _submitClaim_decorators = [(0, common_1.Post)("claims"), (0, roles_decorator_1.Roles)("PATIENT"), (0, swagger_1.ApiOperation)({ summary: "Submit an insurance claim for an appointment" })];
        _getClaims_decorators = [(0, common_1.Get)("claims"), (0, roles_decorator_1.Roles)("PATIENT"), (0, swagger_1.ApiOperation)({ summary: "List all insurance claims for the patient" })];
        _getClaimByCode_decorators = [(0, common_1.Get)("claims/:claimCode"), (0, swagger_1.ApiOperation)({ summary: "Look up a claim by claim code (accessible by insurer with the code)" })];
        __esDecorate(_classThis, null, _addCard_decorators, { kind: "method", name: "addCard", static: false, private: false, access: { has: function (obj) { return "addCard" in obj; }, get: function (obj) { return obj.addCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCards_decorators, { kind: "method", name: "getCards", static: false, private: false, access: { has: function (obj) { return "getCards" in obj; }, get: function (obj) { return obj.getCards; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeCard_decorators, { kind: "method", name: "removeCard", static: false, private: false, access: { has: function (obj) { return "removeCard" in obj; }, get: function (obj) { return obj.removeCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitClaim_decorators, { kind: "method", name: "submitClaim", static: false, private: false, access: { has: function (obj) { return "submitClaim" in obj; }, get: function (obj) { return obj.submitClaim; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getClaims_decorators, { kind: "method", name: "getClaims", static: false, private: false, access: { has: function (obj) { return "getClaims" in obj; }, get: function (obj) { return obj.getClaims; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getClaimByCode_decorators, { kind: "method", name: "getClaimByCode", static: false, private: false, access: { has: function (obj) { return "getClaimByCode" in obj; }, get: function (obj) { return obj.getClaimByCode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InsuranceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InsuranceController = _classThis;
}();
exports.InsuranceController = InsuranceController;
