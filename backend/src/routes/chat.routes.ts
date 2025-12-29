import { Router } from 'express';
import { sendMessage, getHistory } from '../controllers/chat.controller';

const router = Router();

router.post('/message', sendMessage);
router.get('/:sessionId', getHistory);

export const chatRouter = router;
