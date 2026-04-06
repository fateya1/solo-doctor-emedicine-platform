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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var VideoService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VideoService = _classThis = /** @class */ (function () {
        function VideoService_1(prisma, emailService) {
            this.prisma = prisma;
            this.emailService = emailService;
            this.logger = new common_1.Logger(VideoService.name);
            this.dailyApiKey = process.env.DAILY_API_KEY;
            this.dailyBaseUrl = "https://api.daily.co/v1";
        }
        Object.defineProperty(VideoService_1.prototype, "headers", {
            get: function () {
                return {
                    Authorization: "Bearer ".concat(this.dailyApiKey),
                    "Content-Type": "application/json",
                };
            },
            enumerable: false,
            configurable: true
        });
        VideoService_1.prototype.createDailyRoom = function (appointmentId) {
            return __awaiter(this, void 0, void 0, function () {
                var roomName, _a, response;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            roomName = "solodoc-".concat(appointmentId);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.delete("".concat(this.dailyBaseUrl, "/rooms/").concat(roomName), {
                                    headers: this.headers,
                                })];
                        case 2:
                            _b.sent();
                            this.logger.log("Deleted existing room ".concat(roomName));
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, axios_1.default.post("".concat(this.dailyBaseUrl, "/rooms"), {
                                name: roomName,
                                privacy: "public",
                                properties: {
                                    max_participants: 2,
                                    enable_chat: true,
                                    enable_screenshare: false,
                                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                                    eject_at_room_exp: false,
                                },
                            }, { headers: this.headers })];
                        case 5:
                            response = _b.sent();
                            this.logger.log("Created room ".concat(roomName, ": ").concat(response.data.url));
                            return [2 /*return*/, { name: response.data.name, url: response.data.url }];
                    }
                });
            });
        };
        VideoService_1.prototype.isRoomValid = function (roomName) {
            return __awaiter(this, void 0, void 0, function () {
                var res, exp, _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios_1.default.get("".concat(this.dailyBaseUrl, "/rooms/").concat(roomName), {
                                    headers: this.headers,
                                })];
                        case 1:
                            res = _d.sent();
                            exp = (_c = (_b = res.data) === null || _b === void 0 ? void 0 : _b.config) === null || _c === void 0 ? void 0 : _c.exp;
                            if (!exp)
                                return [2 /*return*/, true];
                            return [2 /*return*/, exp > Math.floor(Date.now() / 1000) + 300]; // at least 5 mins remaining
                        case 2:
                            _a = _d.sent();
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        VideoService_1.prototype.getDoctorVideoToken = function (appointmentId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doctorProfile, appointment, roomName, roomUrl, roomValid, _a, room, doctorUser;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.doctorProfile.findUnique({ where: { userId: userId } })];
                        case 1:
                            doctorProfile = _b.sent();
                            if (!doctorProfile)
                                throw new common_1.NotFoundException("Doctor profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: appointmentId },
                                    include: {
                                        availabilitySlot: true,
                                        patient: { include: { user: true } },
                                    },
                                })];
                        case 2:
                            appointment = _b.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
                                throw new common_1.BadRequestException("Not authorized for this appointment");
                            }
                            if (!["CONFIRMED"].includes(appointment.status)) {
                                throw new common_1.BadRequestException("Video is only available for confirmed appointments");
                            }
                            roomName = appointment.videoRoomName;
                            roomUrl = appointment.videoRoomUrl;
                            if (!roomName) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.isRoomValid(roomName)];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = false;
                            _b.label = 5;
                        case 5:
                            roomValid = _a;
                            if (!(!roomName || !roomValid)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.createDailyRoom(appointmentId)];
                        case 6:
                            room = _b.sent();
                            roomName = room.name;
                            roomUrl = room.url;
                            return [4 /*yield*/, this.prisma.appointment.update({
                                    where: { id: appointmentId },
                                    data: { videoRoomName: roomName, videoRoomUrl: roomUrl },
                                })];
                        case 7:
                            _b.sent();
                            return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: userId } })];
                        case 8:
                            doctorUser = _b.sent();
                            this.emailService.sendVideoConsultationInvite(appointment.patient.user.email, appointment.patient.user.fullName, doctorUser.fullName, appointmentId, appointment.availabilitySlot.startTime).catch(function () { });
                            _b.label = 9;
                        case 9: return [2 /*return*/, { token: null, roomUrl: roomUrl, roomName: roomName }];
                    }
                });
            });
        };
        VideoService_1.prototype.getPatientVideoToken = function (appointmentId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var patientProfile, appointment, roomValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.patientProfile.findUnique({
                                where: { userId: userId },
                                include: { user: true },
                            })];
                        case 1:
                            patientProfile = _a.sent();
                            if (!patientProfile)
                                throw new common_1.NotFoundException("Patient profile not found");
                            return [4 /*yield*/, this.prisma.appointment.findUnique({
                                    where: { id: appointmentId },
                                    include: { availabilitySlot: true },
                                })];
                        case 2:
                            appointment = _a.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            if (appointment.patientId !== patientProfile.id) {
                                throw new common_1.BadRequestException("Not authorized for this appointment");
                            }
                            if (!appointment.videoRoomName) {
                                throw new common_1.BadRequestException("Doctor has not started the video session yet. Please wait.");
                            }
                            return [4 /*yield*/, this.isRoomValid(appointment.videoRoomName)];
                        case 3:
                            roomValid = _a.sent();
                            if (!roomValid) {
                                throw new common_1.BadRequestException("Video room has expired. Please ask the doctor to restart the session.");
                            }
                            return [2 /*return*/, { token: null, roomUrl: appointment.videoRoomUrl, roomName: appointment.videoRoomName }];
                    }
                });
            });
        };
        VideoService_1.prototype.getVideoStatus = function (appointmentId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var appointment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.appointment.findUnique({
                                where: { id: appointmentId },
                            })];
                        case 1:
                            appointment = _a.sent();
                            if (!appointment)
                                throw new common_1.NotFoundException("Appointment not found");
                            return [2 /*return*/, {
                                    hasRoom: !!appointment.videoRoomName,
                                    roomUrl: appointment.videoRoomUrl,
                                    status: appointment.status,
                                }];
                    }
                });
            });
        };
        return VideoService_1;
    }());
    __setFunctionName(_classThis, "VideoService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VideoService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VideoService = _classThis;
}();
exports.VideoService = VideoService;
