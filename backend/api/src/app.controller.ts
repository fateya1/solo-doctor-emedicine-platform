import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('me')
  me(@Req() req: any) {
    return req.user;
  }
}
