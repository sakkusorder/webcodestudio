import { Router } from 'express';

const router = Router();

router.get('/search', (req, res) => {
  const { query, category, price, tags, technology } = req.query;
  // TODO: Implement search logic
  res.json({ results: [] });
});

export default router;
