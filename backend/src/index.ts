import { app } from './app';
import { env } from './config/env';

const PORT = env.PORT || 4000;

// Only start server if not running in Vercel (serverless)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
