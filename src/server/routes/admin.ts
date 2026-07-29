import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth';

const router = Router();
const adminOnly = [authenticateToken, authorizeRole('admin', 'manager')];

router.get('/admin/dashboard', adminOnly, (req, res) => {
  res.json({ dashboardData: {} });
});

router.get('/admin/categories', adminOnly, (req, res) => {
  res.json({ categories: [] });
});

router.post('/admin/categories', adminOnly, (req, res) => {
  res.status(201).json({ message: 'Category created' });
});

router.get('/admin/templates', adminOnly, (req, res) => {
  res.json({ templates: [] });
});

router.post('/admin/templates', adminOnly, (req, res) => {
  res.status(201).json({ message: 'Template created' });
});

router.get('/admin/orders', adminOnly, (req, res) => {
  res.json({ orders: [] });
});

router.get('/admin/projects', adminOnly, (req, res) => {
  res.json({ projects: [] });
});

router.get('/admin/clients', adminOnly, (req, res) => {
  res.json({ clients: [] });
});

router.get('/admin/payments', adminOnly, (req, res) => {
  res.json({ payments: [] });
});

router.get('/admin/invoices', adminOnly, (req, res) => {
  res.json({ invoices: [] });
});

router.get('/admin/messages', adminOnly, (req, res) => {
  res.json({ messages: [] });
});

router.get('/admin/reviews', adminOnly, (req, res) => {
  res.json({ reviews: [] });
});

router.get('/admin/homepage', adminOnly, (req, res) => {
  res.json({ homepageSettings: {} });
});

router.get('/admin/reports', adminOnly, (req, res) => {
  res.json({ reports: {} });
});

router.get('/admin/settings', adminOnly, (req, res) => {
  res.json({ settings: {} });
});

export default router;
