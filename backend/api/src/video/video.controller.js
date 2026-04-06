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
exports.VideoController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var VideoController = function () {
    var _classDecorators = [(0, common_1.Controller)("video"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDoctorToken_decorators;
    var _getPatientToken_decorators;
    var _getStatus_decorators;
    var VideoController = _classThis = /** @class */ (function () {
        function VideoController_1(videoService) {
            this.videoService = (__runInitializers(this, _instanceExtraInitializers), videoService);
        }
        VideoController_1.prototype.getDoctorToken = function (req, appointmentId) {
            return this.videoService.getDoctorVideoToken(appointmentId, req.user.sub);
        };
        VideoController_1.prototype.getPatientToken = function (req, appointmentId) {
            return this.videoService.getPatientVideoToken(appointmentId, req.user.sub);
        };
        VideoController_1.prototype.getStatus = function (req, appointmentId) {
            return this.videoService.getVideoStatus(appointmentId, req.user.sub);
        };
        return VideoController_1;
    }());
    __setFunctionName(_classThis, "VideoController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDoctorToken_decorators = [(0, common_1.Post)("doctor/:appointmentId/token")];
        _getPatientToken_decorators = [(0, common_1.Post)("patient/:appointmentId/token")];
        _getStatus_decorators = [(0, common_1.Get)(":appointmentId/status")];
        __esDecorate(_classThis, null, _getDoctorToken_decorators, { kind: "method", name: "getDoctorToken", static: false, private: false, access: { has: function (obj) { return "getDoctorToken" in obj; }, get: function (obj) { return obj.getDoctorToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPatientToken_decorators, { kind: "method", name: "getPatientToken", static: false, private: false, access: { has: function (obj) { return "getPatientToken" in obj; }, get: function (obj) { return obj.getPatientToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatus_decorators, { kind: "method", name: "getStatus", static: false, private: false, access: { has: function (obj) { return "getStatus" in obj; }, get: function (obj) { return obj.getStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VideoController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VideoController = _classThis;
}();
exports.VideoController = VideoController;
