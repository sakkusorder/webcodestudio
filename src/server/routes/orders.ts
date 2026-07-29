import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';

const router = Router();

router.post('/order/template', authenticateToken, (req: AuthRequest, res) => {
  res.status(201).json({ message: 'Order created', orderId: 'ORD-123' });
});

router.get('/orders', authenticateToken, (req: AuthRequest, res) => {
  res.json({ orders: [] });
});

router.get('/order/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ order: { id: req.params.id } });
});

router.put('/order/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'Order updated' });
});

router.delete('/order/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'Order cancelled' });
});

export default router;
