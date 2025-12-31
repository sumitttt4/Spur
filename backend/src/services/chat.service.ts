import { prisma } from '../config/prisma';
import { LLMService } from './llm.service';

export class ChatService {
    static async processMessage(content: string, sessionId?: string) {
        let conversation;

        if (sessionId) {
            conversation = await prisma.conversation.findUnique({
                where: { id: sessionId },
            });
        }

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    messages: {
                        create: { role: 'user', content },
                    },
                },
            });
        } else {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: 'user',
                    content,
                },
            });
        }

        const chatHistory = await prisma.message.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'asc' },
        });

        const aiReply = await LLMService.generateReply(chatHistory);

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
