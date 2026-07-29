import { Router } from 'express';

const router = Router();

router.get('/homepage', (req, res) => {
  // TODO: Fetch homepage data (hero, featured, testimonials)
  res.json({ message: 'Homepage data' });
});

router.get('/categories', (req, res) => {
  res.json({ categories: [] });
});

router.get('/templates', (req, res) => {
  res.json({ templates: [] });
});

router.get('/template/:id', (req, res) => {
  res.json({ template: { id: req.params.id } });
});

router.get('/featured', (req, res) => {
  res.json({ templates: [] });
});

router.get('/popular', (req, res) => {
  res.json({ templates: [] });
});

router.get('/recent', (req, res) => {
  res.json({ templates: [] });
});

router.get('/reviews', (req, res) => {
  res.json({ reviews: [] });
});

router.get('/faqs', (req, res) => {
  res.json({ faqs: [] });
});

export default router;
