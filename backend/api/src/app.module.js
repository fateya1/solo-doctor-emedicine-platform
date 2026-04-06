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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var schedule_1 = require("@nestjs/schedule");
var prisma_module_1 = require("./prisma/prisma.module");
var auth_module_1 = require("./auth/auth.module");
var users_module_1 = require("./users/users.module");
var appointments_module_1 = require("./appointments/appointments.module");
var availability_module_1 = require("./availability/availability.module");
var doctor_module_1 = require("./doctor/doctor.module");
var patient_module_1 = require("./patient/patient.module");
var admin_module_1 = require("./admin/admin.module");
var email_module_1 = require("./email/email.module");
var subscription_module_1 = require("./subscription/subscription.module");
var onboarding_module_1 = require("./onboarding/onboarding.module");
var scheduler_module_1 = require("./scheduler/scheduler.module");
var video_module_1 = require("./video/video.module");
var reviews_module_1 = require("./reviews/reviews.module");
var prescriptions_module_1 = require("./prescriptions/prescriptions.module");
var medical_records_module_1 = require("./medical-records/medical-records.module");
var audit_module_1 = require("./audit/audit.module");
var intake_forms_module_1 = require("./intake-forms/intake-forms.module");
var insurance_module_1 = require("./insurance/insurance.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                schedule_1.ScheduleModule.forRoot(),
                prisma_module_1.PrismaModule,
                email_module_1.EmailModule,
                audit_module_1.AuditModule,
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                appointments_module_1.AppointmentsModule,
                availability_module_1.AvailabilityModule,
                doctor_module_1.DoctorModule,
                patient_module_1.PatientModule,
                admin_module_1.AdminModule,
                subscription_module_1.SubscriptionModule,
                onboarding_module_1.OnboardingModule,
                scheduler_module_1.SchedulerModule,
                video_module_1.VideoModule,
                reviews_module_1.ReviewsModule,
                prescriptions_module_1.PrescriptionsModule,
                medical_records_module_1.MedicalRecordsModule,
                intake_forms_module_1.IntakeFormsModule,
                insurance_module_1.InsuranceModule,
                ReferralModule,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
