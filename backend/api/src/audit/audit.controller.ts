import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { AuditService } from "./audit.service";
import { AuditAction } from "@prisma/client";

@Controller("audit")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  getLogs(
    @Query("userId") userId?: string,
    @Query("action") action?: AuditAction,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.auditService.getAuditLogs({
      userId,
      action,
      startDate,
      endDate,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get("stats")
  getStats() {
    return this.auditService.getAuditStats();
  }
}