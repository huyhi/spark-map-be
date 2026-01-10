import { Controller, Post, Body, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { ChatService } from './chat.service'

export class ChatMessageDto {
  message: string
  sessionId?: string
}

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post('/')
  async chat(@Body() dto: ChatMessageDto) {
    const { message, sessionId } = dto
    return await this.chatService.chat(message, sessionId)
  }

  @Delete('/session/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearSession(@Param('sessionId') sessionId: string) {
    await this.chatService.clearSession(sessionId)
  }
}
