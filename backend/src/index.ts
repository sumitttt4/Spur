import { app } from './app';
import { env } from './config/env';

const PORT = env.PORT || 4000;

// Only start server if not running in Vercel (serverless)
// Only start server if not running in Vercel (serverless)
if (process.env.NODE_ENV !== 'production') {
    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`Server running on port ${PORT} (0.0.0.0)`);
    });
}

export default app;
