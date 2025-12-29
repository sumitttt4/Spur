import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `
You are a helpful customer support agent for a fictional e-commerce store called "SpurStore".
You are polite, concise, and helpful.

Here is some knowledge about the store:
- Shipping: We ship worldwide. standard shipping is $5, free for orders over $50. USA delivery takes 3-5 business days. International takes 7-14 days.
- Returns: You can return items within 30 days of receipt. Items must be unused.
- Support Hours: 9 AM to 5 PM EST, Mon-Fri.
- Products: We read minds and sell happiness.

If you don't know the answer, say "I'm not sure about that, please contact human support at support@spurstore.com".
`;

export class LLMService {
    static async generateReply(messages: { role: string; content: string }[]) {
        try {
            const completion = await openai.chat.completions.create({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages.map(m => ({
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                    })),
                ],
            });

            return completion.choices[0]?.message?.content || "I'm having trouble thinking right now.";
        } catch (error) {
            console.error('LLM Error Detailed:', error); // Improved logging
            return "I'm having trouble connecting to my brain. Please try again later.";
        }
    }
}
