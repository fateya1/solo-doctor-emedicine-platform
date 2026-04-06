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
exports.MessagingController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var MessagingController = function () {
    var _classDecorators = [(0, common_1.Controller)("messaging"), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getConversations_decorators;
    var _startConversation_decorators;
    var _getMessages_decorators;
    var _sendMessage_decorators;
    var _getUnreadCount_decorators;
    var MessagingController = _classThis = /** @class */ (function () {
        function MessagingController_1(messagingService) {
            this.messagingService = (__runInitializers(this, _instanceExtraInitializers), messagingService);
        }
        // Get all conversations for current user
        MessagingController_1.prototype.getConversations = function (req) {
            return this.messagingService.getMyConversations(req.user.sub, req.user.role);
        };
        // Start or get conversation with doctor (patient) or patient (doctor)
        MessagingController_1.prototype.startConversation = function (req, otherProfileId) {
            return this.messagingService.getOrStartConversation(req.user.sub, req.user.role, otherProfileId);
        };
        // Get conversation messages
        MessagingController_1.prototype.getMessages = function (req, conversationId) {
            return this.messagingService.getConversationWithMessages(conversationId, req.user.sub);
        };
        // Send message
        MessagingController_1.prototype.sendMessage = function (req, conversationId, body) {
            return this.messagingService.sendMessage(req.user.sub, req.user.role, conversationId, body.body);
        };
        // Get unread count
        MessagingController_1.prototype.getUnreadCount = function (req) {
            return this.messagingService.getUnreadCount(req.user.sub);
        };
        return MessagingController_1;
    }());
    __setFunctionName(_classThis, "MessagingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getConversations_decorators = [(0, common_1.Get)("conversations")];
        _startConversation_decorators = [(0, common_1.Post)("conversations/:otherProfileId")];
        _getMessages_decorators = [(0, common_1.Get)("conversations/:conversationId/messages")];
        _sendMessage_decorators = [(0, common_1.Post)("conversations/:conversationId/messages")];
        _getUnreadCount_decorators = [(0, common_1.Get)("unread")];
        __esDecorate(_classThis, null, _getConversations_decorators, { kind: "method", name: "getConversations", static: false, private: false, access: { has: function (obj) { return "getConversations" in obj; }, get: function (obj) { return obj.getConversations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _startConversation_decorators, { kind: "method", name: "startConversation", static: false, private: false, access: { has: function (obj) { return "startConversation" in obj; }, get: function (obj) { return obj.startConversation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMessages_decorators, { kind: "method", name: "getMessages", static: false, private: false, access: { has: function (obj) { return "getMessages" in obj; }, get: function (obj) { return obj.getMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendMessage_decorators, { kind: "method", name: "sendMessage", static: false, private: false, access: { has: function (obj) { return "sendMessage" in obj; }, get: function (obj) { return obj.sendMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUnreadCount_decorators, { kind: "method", name: "getUnreadCount", static: false, private: false, access: { has: function (obj) { return "getUnreadCount" in obj; }, get: function (obj) { return obj.getUnreadCount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessagingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessagingController = _classThis;
}();
exports.MessagingController = MessagingController;
