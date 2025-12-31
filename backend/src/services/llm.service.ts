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
- Keep responses SHORT and to the point.
- Use bullet points (•) for lists or multiple options.
- Avoid long paragraphs. Max 2-3 sentences per paragraph.
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

🛍️ PRODUCT CATALOG:

1. **Mind-Reading Hoodie** ($49.99)
   - Colors: Void Black, Neural Blue.
   - Sizes: XS to XXL (Unisex).
   - Features: "Mood-sensing" fabric that changes warmth based on stress levels. 100% Organic Cotton.

2. **Happy Mug** ($15.00)
   - Capacity: 12oz.
   - Design: Self-stirring mechanism. Dishwasher safe.
   - Slogan: "Sip logic, spit facts."

3. **Focus Cap** ($25.00)
   - Colors: Matte Grey only.
   - Features: Built-in noise-dampening ear flaps (detachable).
   - Material: Recycled polyester.

ℹ️ STOCK STATUS:
- All items are currently IN STOCK except "Happy Mug" (Low Stock - only 5 left).

💡 SALES GUIDELINES:
- If a user asks for a recommendation, ask them about their style (Comfort vs utility).
- Always mention the "30-Day Happiness Guarantee" if they seem hesitant.
`;

export class LLMService {
    /**
     * Generates a reply from the LLM based on the conversation history.
     * Includes guardrails for context window and error handling.
     */
    static async generateReply(messages: { role: string; content: string }[]) {
        try {
            const recentMessages = messages.slice(-10);

            const completion = await openai.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...recentMessages.map(m => ({
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                    })),
                ],
                max_tokens: 300,
                temperature: 0.7,
            });

            return completion.choices[0]?.message?.content || "I'm having trouble thinking right now.";
        } catch (error: any) {
            console.error('LLM Error:', error);

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
