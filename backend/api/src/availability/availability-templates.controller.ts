import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import {
  AvailabilityTemplatesService,
  CreateTemplateDto,
  ApplyTemplateDto,
} from "./availability-templates.service";

@ApiTags("Availability Templates")
@Controller("availability/templates")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("DOCTOR")
export class AvailabilityTemplatesController {
  constructor(private readonly service: AvailabilityTemplatesService) {}

  @Get()
  @ApiOperation({ summary: "List all templates for the current doctor" })
  getAll(@Req() req: any) {
    return this.service.getTemplates(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: "Create a new weekly availability template" })
  create(@Req() req: any, @Body() dto: CreateTemplateDto) {
    return this.service.createTemplate(req.user.sub, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update template name / slots" })
  update(@Req() req: any, @Param("id") id: string, @Body() dto: Partial<CreateTemplateDto>) {
    return this.service.updateTemplate(id, req.user.sub, dto);
  }

  @Patch(":id/toggle")
  @ApiOperation({ summary: "Toggle template active / inactive" })
  toggle(@Req() req: any, @Param("id") id: string) {
    return this.service.toggleTemplate(id, req.user.sub);
  }

  @Post(":id/apply")
  @ApiOperation({ summary: "Apply template — generate real availability slots for N weeks" })
  apply(@Req() req: any, @Param("id") id: string, @Body() dto: ApplyTemplateDto) {
    return this.service.applyTemplate(id, req.user.sub, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a template" })
  remove(@Req() req: any, @Param("id") id: string) {
    return this.service.deleteTemplate(id, req.user.sub);
  }
}
