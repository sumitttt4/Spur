import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat.routes';
import { env } from './config/env';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export { app };
