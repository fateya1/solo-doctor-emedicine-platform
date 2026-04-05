import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface TemplateSlotDto {
  dayOfWeek: number;   // 0=Sun … 6=Sat
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  slotMinutes: number;
  breakMinutes: number;
}

export interface CreateTemplateDto {
  name: string;
  timezone?: string;
  slots: TemplateSlotDto[];
}

export interface ApplyTemplateDto {
  fromDate: string;  // ISO date string — "YYYY-MM-DD"
  weeks: number;     // 1–12
}

@Injectable()
export class AvailabilityTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Helpers ──────────────────────────────────────────────────────────────

  private async getDoctorProfile(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Doctor profile not found");
    return profile;
  }

  private async ownedTemplate(templateId: string, doctorId: string) {
    const t = await this.prisma.availabilityTemplate.findFirst({
      where: { id: templateId, doctorId },
      include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
    });
    if (!t) throw new NotFoundException("Template not found");
    return t;
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────

  async getTemplates(userId: string) {
    const doctor = await this.getDoctorProfile(userId);
    return this.prisma.availabilityTemplate.findMany({
      where: { doctorId: doctor.id },
      include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
      orderBy: { createdAt: "desc" },
    });
  }

  async createTemplate(userId: string, dto: CreateTemplateDto) {
    const doctor = await this.getDoctorProfile(userId);
    this.validateSlots(dto.slots);

    return this.prisma.availabilityTemplate.create({
      data: {
        doctorId: doctor.id,
        name: dto.name.trim(),
        timezone: dto.timezone ?? "Africa/Nairobi",
        slots: {
          create: dto.slots.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            startHour: s.startHour,
            startMinute: s.startMinute ?? 0,
            endHour: s.endHour,
            endMinute: s.endMinute ?? 0,
            slotMinutes: s.slotMinutes,
            breakMinutes: s.breakMinutes ?? 0,
          })),
        },
      },
      include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
    });
  }

  async updateTemplate(templateId: string, userId: string, dto: Partial<CreateTemplateDto>) {
    const doctor = await this.getDoctorProfile(userId);
    await this.ownedTemplate(templateId, doctor.id);

    if (dto.slots) this.validateSlots(dto.slots);

    // Replace all slots if provided
    return this.prisma.$transaction(async (tx) => {
      if (dto.slots) {
        await tx.availabilityTemplateSlot.deleteMany({ where: { templateId } });
        await tx.availabilityTemplateSlot.createMany({
          data: dto.slots.map((s) => ({
            templateId,
            dayOfWeek: s.dayOfWeek,
            startHour: s.startHour,
            startMinute: s.startMinute ?? 0,
            endHour: s.endHour,
            endMinute: s.endMinute ?? 0,
            slotMinutes: s.slotMinutes,
            breakMinutes: s.breakMinutes ?? 0,
          })),
        });
      }

      return tx.availabilityTemplate.update({
        where: { id: templateId },
        data: {
          ...(dto.name ? { name: dto.name.trim() } : {}),
          ...(dto.timezone ? { timezone: dto.timezone } : {}),
        },
        include: { slots: { orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }] } },
      });
    });
  }

  async toggleTemplate(templateId: string, userId: string) {
    const doctor = await this.getDoctorProfile(userId);
    const template = await this.ownedTemplate(templateId, doctor.id);
    return this.prisma.availabilityTemplate.update({
      where: { id: templateId },
      data: { isActive: !template.isActive },
    });
  }

  async deleteTemplate(templateId: string, userId: string) {
    const doctor = await this.getDoctorProfile(userId);
    await this.ownedTemplate(templateId, doctor.id);
    await this.prisma.availabilityTemplate.delete({ where: { id: templateId } });
    return { ok: true };
  }

  // ── Apply ─────────────────────────────────────────────────────────────────

  async applyTemplate(templateId: string, userId: string, dto: ApplyTemplateDto) {
    if (dto.weeks < 1 || dto.weeks > 12) {
      throw new BadRequestException("Weeks must be between 1 and 12");
    }

    const doctor = await this.getDoctorProfile(userId);
    const template = await this.ownedTemplate(templateId, doctor.id);

    if (!template.slots.length) {
      throw new BadRequestException("This template has no time slots configured");
    }

    const from = new Date(dto.fromDate);
    from.setHours(0, 0, 0, 0);
    if (isNaN(from.getTime())) throw new BadRequestException("Invalid fromDate");

    const totalDays = dto.weeks * 7;
    const slotsToCreate: { doctorId: string; startTime: Date; endTime: Date }[] = [];

    for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
      const currentDate = new Date(from);
      currentDate.setDate(from.getDate() + dayOffset);
      const dayOfWeek = currentDate.getDay();

      const matchingSlots = template.slots.filter((s) => s.dayOfWeek === dayOfWeek);

      for (const tSlot of matchingSlots) {
        const windowStart = new Date(currentDate);
        windowStart.setHours(tSlot.startHour, tSlot.startMinute, 0, 0);

        const windowEnd = new Date(currentDate);
        windowEnd.setHours(tSlot.endHour, tSlot.endMinute, 0, 0);

        if (windowEnd <= windowStart) continue;

        const slotMs = tSlot.slotMinutes * 60_000;
        const breakMs = tSlot.breakMinutes * 60_000;
        let cursor = new Date(windowStart);

        while (cursor.getTime() + slotMs <= windowEnd.getTime()) {
          slotsToCreate.push({
            doctorId: doctor.id,
            startTime: new Date(cursor),
            endTime: new Date(cursor.getTime() + slotMs),
          });
          cursor = new Date(cursor.getTime() + slotMs + breakMs);
        }
      }
    }

    if (!slotsToCreate.length) {
      throw new BadRequestException("No slots generated — check your template days match the date range");
    }

    const result = await this.prisma.availabilitySlot.createMany({
      data: slotsToCreate,
      skipDuplicates: true,
    });

    return {
      created: result.count,
      skipped: slotsToCreate.length - result.count,
      weeks: dto.weeks,
      from: dto.fromDate,
    };
  }

  // ── Validation ────────────────────────────────────────────────────────────

  private validateSlots(slots: TemplateSlotDto[]) {
    for (const s of slots) {
      if (s.dayOfWeek < 0 || s.dayOfWeek > 6) throw new BadRequestException("dayOfWeek must be 0–6");
      if (s.startHour < 0 || s.startHour > 23) throw new BadRequestException("Invalid startHour");
      if (s.endHour < 0 || s.endHour > 23) throw new BadRequestException("Invalid endHour");
      const startMins = s.startHour * 60 + (s.startMinute ?? 0);
      const endMins = s.endHour * 60 + (s.endMinute ?? 0);
      if (endMins <= startMins) throw new BadRequestException("End time must be after start time");
      if (s.slotMinutes < 5 || s.slotMinutes > 480) throw new BadRequestException("slotMinutes must be 5–480");
    }
  }
}
