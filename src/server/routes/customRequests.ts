import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';

const router = Router();

router.post('/custom-request', authenticateToken, (req: AuthRequest, res) => {
  res.status(201).json({ message: 'Custom request created', requestId: 'REQ-123' });
});

router.get('/custom-request/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ request: { id: req.params.id } });
});

router.put('/custom-request/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'Request updated' });
});

router.delete('/custom-request/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'Request deleted' });
});

export default router;
