import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { z } from 'zod';

const messageSchema = z.object({
    message: z.string().min(1, "Message cannot be empty").max(1000, "Message is too long (max 1000 chars)"),
    sessionId: z.string().nullish(),
});

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message, sessionId } = messageSchema.parse(req.body);

        const chatResponse = await ChatService.processMessage(message, sessionId || undefined);

        res.json(chatResponse);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            console.error('[ChatController] Error processing message:', error);
            res.status(500).json({
                error: 'Failed to process message',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const messages = await ChatService.getHistory(sessionId);
        res.json({ messages });
    } catch (error) {
        console.error('[ChatController] Error fetching history:', error);
        res.status(500).json({ error: 'Failed to load conversation history' });
    }
};
