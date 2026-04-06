"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSlotsDto = void 0;
var class_validator_1 = require("class-validator");
var CreateSlotsDto = function () {
    var _a;
    var _from_decorators;
    var _from_initializers = [];
    var _from_extraInitializers = [];
    var _to_decorators;
    var _to_initializers = [];
    var _to_extraInitializers = [];
    var _slotMinutes_decorators;
    var _slotMinutes_initializers = [];
    var _slotMinutes_extraInitializers = [];
    var _breakMinutes_decorators;
    var _breakMinutes_initializers = [];
    var _breakMinutes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSlotsDto() {
                this.from = __runInitializers(this, _from_initializers, void 0);
                this.to = (__runInitializers(this, _from_extraInitializers), __runInitializers(this, _to_initializers, void 0));
                this.slotMinutes = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _slotMinutes_initializers, void 0));
                this.breakMinutes = (__runInitializers(this, _slotMinutes_extraInitializers), __runInitializers(this, _breakMinutes_initializers, void 0));
                __runInitializers(this, _breakMinutes_extraInitializers);
            }
            return CreateSlotsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _from_decorators = [(0, class_validator_1.IsDateString)()];
            _to_decorators = [(0, class_validator_1.IsDateString)()];
            _slotMinutes_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _breakMinutes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _from_decorators, { kind: "field", name: "from", static: false, private: false, access: { has: function (obj) { return "from" in obj; }, get: function (obj) { return obj.from; }, set: function (obj, value) { obj.from = value; } }, metadata: _metadata }, _from_initializers, _from_extraInitializers);
            __esDecorate(null, null, _to_decorators, { kind: "field", name: "to", static: false, private: false, access: { has: function (obj) { return "to" in obj; }, get: function (obj) { return obj.to; }, set: function (obj, value) { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            __esDecorate(null, null, _slotMinutes_decorators, { kind: "field", name: "slotMinutes", static: false, private: false, access: { has: function (obj) { return "slotMinutes" in obj; }, get: function (obj) { return obj.slotMinutes; }, set: function (obj, value) { obj.slotMinutes = value; } }, metadata: _metadata }, _slotMinutes_initializers, _slotMinutes_extraInitializers);
            __esDecorate(null, null, _breakMinutes_decorators, { kind: "field", name: "breakMinutes", static: false, private: false, access: { has: function (obj) { return "breakMinutes" in obj; }, get: function (obj) { return obj.breakMinutes; }, set: function (obj, value) { obj.breakMinutes = value; } }, metadata: _metadata }, _breakMinutes_initializers, _breakMinutes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSlotsDto = CreateSlotsDto;
