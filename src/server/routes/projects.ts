import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';

const router = Router();

router.get('/projects', authenticateToken, (req: AuthRequest, res) => {
  res.json({ projects: [] });
});

router.get('/project/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ project: { id: req.params.id } });
});

router.get('/project-timeline/:id', authenticateToken, (req: AuthRequest, res) => {
  res.json({ timeline: [] });
});

export default router;
