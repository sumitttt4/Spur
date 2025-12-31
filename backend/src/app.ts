import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat.routes';
import { env } from './config/env';

const app = express();

// Configure CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://spur-frontend-kappa.vercel.app' // Add your deployed frontend too
    ],
    credentials: true
}));
app.use(express.json());

// Debug logs
app.use((req, res, next) => {
    console.log(`[Backend] Req: ${req.method} ${req.url}`);
    next();
});

// Debug logs
app.use((req, res, next) => {
    console.log(`[Backend] Req: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/chat', chatRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export { app };
