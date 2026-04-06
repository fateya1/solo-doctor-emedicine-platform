import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MessagingService } from "./messaging.service";

@Controller("messaging")
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  // Get all conversations for current user
  @Get("conversations")
  getConversations(@Req() req: any) {
    return this.messagingService.getMyConversations(req.user.sub, req.user.role);
  }

  // Start or get conversation with doctor (patient) or patient (doctor)
  @Post("conversations/:otherProfileId")
  startConversation(@Req() req: any, @Param("otherProfileId") otherProfileId: string) {
    return this.messagingService.getOrStartConversation(req.user.sub, req.user.role, otherProfileId);
  }

  // Get conversation messages
  @Get("conversations/:conversationId/messages")
  getMessages(@Req() req: any, @Param("conversationId") conversationId: string) {
    return this.messagingService.getConversationWithMessages(conversationId, req.user.sub);
  }

  // Send message
  @Post("conversations/:conversationId/messages")
  sendMessage(
    @Req() req: any,
    @Param("conversationId") conversationId: string,
    @Body() body: { body: string },
  ) {
    return this.messagingService.sendMessage(req.user.sub, req.user.role, conversationId, body.body);
  }

  // Get unread count
  @Get("unread")
  getUnreadCount(@Req() req: any) {
    return this.messagingService.getUnreadCount(req.user.sub);
  }
}