import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';

const router = Router();

router.get('/notifications', authenticateToken, (req: AuthRequest, res) => {
  res.json({ notifications: [] });
});

router.put('/notification/read', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'Notifications marked as read' });
});

export default router;
