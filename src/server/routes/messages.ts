import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/messages/:project_id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ messages: [] });
});

router.post('/messages', authenticateToken, upload.array('attachments', 5), (req: AuthRequest, res) => {
  res.status(201).json({ message: 'Message sent', files: req.files });
});

export default router;
