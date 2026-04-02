import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats")
  getStats() {
    return this.adminService.getPlatformStats();
  }

  @Get("tenants")
  getTenants() {
    return this.adminService.getAllTenants();
  }

  @Get("tenants/:id")
  getTenant(@Param("id") id: string) {
    return this.adminService.getTenantDetails(id);
  }

  @Patch("tenants/:id/toggle")
  toggleTenant(@Param("id") id: string) {
    return this.adminService.toggleTenantStatus(id);
  }

  @Get("doctors")
  getDoctors() {
    return this.adminService.getAllDoctors();
  }

  @Get("doctors/pending")
  getPendingDoctors() {
    return this.adminService.getPendingDoctors();
  }

  @Patch("doctors/:id/verify")
  verifyDoctor(@Param("id") id: string) {
    return this.adminService.verifyDoctor(id);
  }

  @Get("patients")
  getPatients() {
    return this.adminService.getAllPatients();
  }

  @Patch("users/:id/toggle")
  toggleUser(@Param("id") id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get("subscriptions")
  getSubscriptions() {
    return this.adminService.getAllSubscriptions();
  }

  @Get("appointments/recent")
  getRecentAppointments() {
    return this.adminService.getRecentAppointments();
  }
}