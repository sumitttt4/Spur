
import { OpenAI } from "openai";
import dotenv from "dotenv";
import path from "path";

// Load .env from the current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GROQ_API_KEY;

console.log("---------------------------------------------------");
console.log("🧪 Testing Groq API Connection...");
console.log("🔑 API Key found:", apiKey ? "YES (Starts with " + apiKey.substring(0, 5) + "...)" : "NO ❌");
console.log("---------------------------------------------------");

if (!apiKey) {
    console.error("❌ ERROR: No GROQ_API_KEY found in .env file.");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.groq.com/openai/v1",
});

async function test() {
    try {
        console.log("📡 Sending test request to Groq (llama-3.1-8b-instant)...");
        const completion = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: "Say 'Hello from Groq!' if you can hear me." }],
        });
        console.log("✅ SUCCESS! Response received:");
        console.log("🤖 AI says:", completion.choices[0].message.content);
    } catch (error: any) {
        console.error("❌ FAILED. Error details:");
        console.error(error.message || error);
        if (error.status === 401) {
            console.error("💡 Hint: Your API Key is invalid.");
        } else if (error.status === 404) {
            console.error("💡 Hint: Model name might be wrong.");
        }
    }
}

test();
