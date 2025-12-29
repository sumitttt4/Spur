import { PrismaClient } from '@prisma/client';
import { LLMService } from './llm.service';

const prisma = new PrismaClient();

export class ChatService {
    static async processMessage(content: string, sessionId?: string) {
        // 1. Create or get conversation
        let conversation;
        if (sessionId) {
            conversation = await prisma.conversation.findUnique({
                where: { id: sessionId },
                include: { messages: true },
            });
        }

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    messages: {
                        create: {
                            role: 'user',
                            content,
                        },
                    },
                },
                include: { messages: true },
            });
        } else {
            // Add user message
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: 'user',
                    content,
                },
            });
        }

        // 2. Get history for context
        const history = await prisma.message.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'asc' },
        });

        // 3. Generate AI reply
        const aiReply = await LLMService.generateReply(history);

        // 4. Save AI reply
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: 'assistant',
                content: aiReply,
            },
        });

        return {
            reply: aiReply,
            sessionId: conversation.id,
        };
    }

    static async getHistory(sessionId: string) {
        return await prisma.message.findMany({
            where: { conversationId: sessionId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true
            }
        });
    }
}
