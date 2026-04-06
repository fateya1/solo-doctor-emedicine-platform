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
exports.MedicalRecordsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var MedicalRecordsController = function () {
    var _classDecorators = [(0, common_1.Controller)("medical-records"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _saveNote_decorators;
    var _getNote_decorators;
    var _myHistory_decorators;
    var _patientHistory_decorators;
    var _myPatients_decorators;
    var MedicalRecordsController = _classThis = /** @class */ (function () {
        function MedicalRecordsController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        MedicalRecordsController_1.prototype.saveNote = function (req, body) {
            return this.service.saveConsultationNote(req.user.sub, body);
        };
        MedicalRecordsController_1.prototype.getNote = function (req, appointmentId) {
            return this.service.getConsultationNote(req.user.sub, appointmentId, req.user.role);
        };
        MedicalRecordsController_1.prototype.myHistory = function (req) {
            return this.service.getPatientMedicalHistory(req.user.sub);
        };
        MedicalRecordsController_1.prototype.patientHistory = function (req, patientUserId) {
            return this.service.getPatientMedicalHistory(req.user.sub, patientUserId, req.user.role);
        };
        MedicalRecordsController_1.prototype.myPatients = function (req) {
            return this.service.getDoctorPatientList(req.user.sub);
        };
        return MedicalRecordsController_1;
    }());
    __setFunctionName(_classThis, "MedicalRecordsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _saveNote_decorators = [(0, common_1.Post)("notes")];
        _getNote_decorators = [(0, common_1.Get)("notes/:appointmentId")];
        _myHistory_decorators = [(0, common_1.Get)("history/me")];
        _patientHistory_decorators = [(0, common_1.Get)("history/patient/:patientUserId")];
        _myPatients_decorators = [(0, common_1.Get)("patients")];
        __esDecorate(_classThis, null, _saveNote_decorators, { kind: "method", name: "saveNote", static: false, private: false, access: { has: function (obj) { return "saveNote" in obj; }, get: function (obj) { return obj.saveNote; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNote_decorators, { kind: "method", name: "getNote", static: false, private: false, access: { has: function (obj) { return "getNote" in obj; }, get: function (obj) { return obj.getNote; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _myHistory_decorators, { kind: "method", name: "myHistory", static: false, private: false, access: { has: function (obj) { return "myHistory" in obj; }, get: function (obj) { return obj.myHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patientHistory_decorators, { kind: "method", name: "patientHistory", static: false, private: false, access: { has: function (obj) { return "patientHistory" in obj; }, get: function (obj) { return obj.patientHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _myPatients_decorators, { kind: "method", name: "myPatients", static: false, private: false, access: { has: function (obj) { return "myPatients" in obj; }, get: function (obj) { return obj.myPatients; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MedicalRecordsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MedicalRecordsController = _classThis;
}();
exports.MedicalRecordsController = MedicalRecordsController;
