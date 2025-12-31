import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `
You are a helpful customer support agent for "SpurStore", a premium lifestyle brand.
Your goal is to assist customers with their orders, product questions, and policies.

CORE GUIDELINES:
- Answer clearly, concisely, and with a friendly tone.
- NEVER mention you are an AI, a large language model, or developed by OpenAI/Groq. Just say you are from SpurStore Support.
- Use the context of the conversation to provide relevant answers.

STORE KNOWLEDGE BASE:

💰 pricing & Payments:
- We accept Visa, Mastercard, Amex, and PayPal.
- All prices are in USD.

🚚 Shipping & Delivery:
- Standard Shipping ($5): 3-5 business days (Free on orders over $50).
- Express Shipping ($15): 1-2 business days.
- International Shipping: 7-14 business days (Rates calculated at checkout).
- Order processing takes 24 hours.

↩️ Returns & Refunds:
- 30-Day Happiness Guarantee: Return any unused item within 30 days for a full refund.
- Customer pays for return shipping unless the item was damaged.
- Refunds are processed within 5-7 business days after we receive the return.

🛍️ Products:
- We sell "Mind-Reading Hoodies", "Happy Mugs", and "Focus Caps".
- Our products are sustainably made and ethically sourced.

📞 Contact & Support:
- Email: support@spurstore.com
- Phone: +1 (800) 555-SPUR
- Hours: Mon-Fri, 9 AM - 5 PM EST

If a customer asks a question not covered here, kindly offer to connect them with a human agent via email.
`;

export class LLMService {
    static async generateReply(messages: { role: string; content: string }[]) {
        try {
            // Guardrail 1: Cap Context Window (Cost Control)
            // Only send the last 10 messages to keep token usage low
            const recentMessages = messages.slice(-10);

            const completion = await openai.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...recentMessages.map(m => ({
                        role: m.role as 'user' | 'assistant',
                        content: m.content, // We could also truncate long user messages here
                    })),
                ],
                // Guardrail 2: Cap Response Tokens (Cost Control)
                max_tokens: 300,
                temperature: 0.7,
            });

            return completion.choices[0]?.message?.content || "I'm having trouble thinking right now.";
        } catch (error: any) {
            console.error('LLM Error:', error);

            // Guardrail 3: Graceful Error Handling
            if (error?.status === 429) {
                return "I'm receiving too many messages right now. Please allow me a moment to catch up!";
            }
            if (error?.status === 401) {
                return "My configuration seems to be invalid (API Key Error). Please contact support.";
            }
            if (error?.status === 503 || error?.status === 500) {
                return "I'm currently undergoing maintenance. Please try again in a few minutes.";
            }

            return "I'm having trouble connecting to my brain. Please try again later.";
        }
    }
}
