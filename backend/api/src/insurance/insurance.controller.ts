import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { InsuranceService, AddInsuranceCardDto, SubmitClaimDto } from "./insurance.service";

@ApiTags("Insurance")
@Controller("insurance")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InsuranceController {
  constructor(private readonly service: InsuranceService) {}

  // ── Cards ──────────────────────────────────────────────────────────────────

  @Post("cards")
  @Roles("PATIENT")
  @ApiOperation({ summary: "Add an insurance card" })
  addCard(@Req() req: any, @Body() dto: AddInsuranceCardDto) {
    return this.service.addCard(req.user.sub, dto);
  }

  @Get("cards")
  @Roles("PATIENT")
  @ApiOperation({ summary: "List all active insurance cards for the patient" })
  getCards(@Req() req: any) {
    return this.service.getCards(req.user.sub);
  }

  @Delete("cards/:id")
  @Roles("PATIENT")
  @ApiOperation({ summary: "Deactivate (soft-delete) an insurance card" })
  removeCard(@Req() req: any, @Param("id") id: string) {
    return this.service.deactivateCard(req.user.sub, id);
  }

  // ── Claims ─────────────────────────────────────────────────────────────────

  @Post("claims")
  @Roles("PATIENT")
  @ApiOperation({ summary: "Submit an insurance claim for an appointment" })
  submitClaim(@Req() req: any, @Body() dto: SubmitClaimDto) {
    return this.service.submitClaim(req.user.sub, dto);
  }

  @Get("claims")
  @Roles("PATIENT")
  @ApiOperation({ summary: "List all insurance claims for the patient" })
  getClaims(@Req() req: any) {
    return this.service.getClaims(req.user.sub);
  }

  @Get("claims/:claimCode")
  @ApiOperation({ summary: "Look up a claim by claim code (accessible by insurer with the code)" })
  getClaimByCode(@Param("claimCode") claimCode: string) {
    return this.service.getClaimByCode(claimCode);
  }
}
