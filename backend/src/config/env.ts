import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('4000'),
    DATABASE_URL: z.string(),
    GROQ_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
