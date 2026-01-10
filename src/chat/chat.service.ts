import { Injectable, Logger } from '@nestjs/common'
import { Agent, run, RunResult } from '@openai/agents'

export interface ChatMessage {
  message: string
  sessionId?: string
}


export interface ChatResponse {
  reply: string
  sessionId: string
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)
  private agent: Agent
  private sessions: Map<string, any[]> = new Map()

  constructor() {
    // 初始化 OpenAI Agent
    this.agent = new Agent({
      name: 'SparkMap Assistant',
      instructions: `You are a helpful assistant for SparkMap application. 
      You can help users with questions about locations, points of interest, and geographic data.
      Be friendly, concise, and informative.`,
      model: 'gpt-4o-mini', // 或者使用 'gpt-4o' 获得更好的性能
    })

    this.logger.log('ChatService initialized with OpenAI Agent SDK')
  }

  async chat(message: string, sessionId?: string): Promise<ChatResponse> {
    const currentSessionId = sessionId || this.generateSessionId()

    try {
      // 获取或创建会话历史
      const history = this.sessions.get(currentSessionId) || []

      // 运行 agent
      const result = await run(this.agent, message, {
        context: history.length > 0 ? { history } : undefined,
      })

      // 获取 agent 的回复内容
      const reply = result.finalOutput || ''

      // 更新会话历史
      history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: reply }
      )
      this.sessions.set(currentSessionId, history)
      if (history.length > 20) {
        this.sessions.set(currentSessionId, history.slice(-20))
      }

      return {
        reply,
        sessionId: currentSessionId,
      }
    } catch (error) {
      this.logger.error(`Chat error: ${error.message}`, error.stack)
      throw error
    }
  }

  async clearSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId)
    this.logger.log(`Session ${sessionId} cleared`)
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}

