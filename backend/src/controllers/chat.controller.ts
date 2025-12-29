import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { z } from 'zod';

const messageSchema = z.object({
    message: z.string().min(1),
    sessionId: z.string().nullish(),
});

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message, sessionId } = messageSchema.parse(req.body);

        const result = await ChatService.processMessage(message, sessionId || undefined);

        res.json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const history = await ChatService.getHistory(sessionId);
        res.json({ messages: history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
