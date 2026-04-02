import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { EmailService } from "../email/email.service";
import { UserRole } from "@prisma/client";

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID ?? "default-tenant";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    tenantId?: string;
  }) {
    const user = await this.usersService.createUser({
      ...dto,
      tenantId: dto.tenantId ?? DEFAULT_TENANT_ID,
    });
    // Send welcome email (non-blocking)
    this.emailService.sendWelcome(user.email, user.fullName, user.role).catch(() => {});
    return user;
  }

  async login(dto: { email: string; password: string; tenantId?: string }) {
    const tenantId = dto.tenantId ?? DEFAULT_TENANT_ID;
    const user = await this.usersService.findByEmail(dto.email, tenantId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException("Invalid credentials");

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}