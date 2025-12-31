import { prisma } from '../config/prisma';
import { LLMService } from './llm.service';

export class ChatService {
    static async processMessage(content: string, sessionId?: string) {
        let conversation;

        // 1. Get or Create Session (Fastest possible check)
        if (sessionId) {
            conversation = await prisma.conversation.findUnique({ where: { id: sessionId } });
        }

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: { messages: { create: { role: 'user', content } } },
            });
            // New conversation: No history needed, just 1 message
            const aiReply = await LLMService.generateReply([{ role: 'user', content }]);

            // Save AI reply async (don't block return)
            await prisma.message.create({
                data: { conversationId: conversation.id, role: 'assistant', content: aiReply },
            });

            return { reply: aiReply, sessionId: conversation.id };
        }

        // 2. Optimization: Fetch history AND Save user message in parallel
        // We know the new message isn't in DB yet, but we have it in 'content' variable.
        const [chatHistory, _saveOp] = await Promise.all([
            prisma.message.findMany({
                where: { conversationId: conversation.id },
                orderBy: { createdAt: 'asc' },
                take: 10 // Limit history fetching for speed
            }),
            prisma.message.create({
                data: { conversationId: conversation.id, role: 'user', content }
            })
        ]);

        // 3. Append current message to history in memory (for LLM context)
        const fullContext = [...chatHistory, { role: 'user', content }];

        // 4. Generate AI Reply
        const aiReply = await LLMService.generateReply(fullContext);

        // 5. Save AI Reply (We await this to ensure data consistency, but could be backgrounded)
        await prisma.message.create({
            data: { conversationId: conversation.id, role: 'assistant', content: aiReply },
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
