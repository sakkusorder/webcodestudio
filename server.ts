import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';

// Import Routes
import authRoutes from './src/server/routes/auth';
import publicRoutes from './src/server/routes/public';
import ordersRoutes from './src/server/routes/orders';
import customRequestRoutes from './src/server/routes/customRequests';
import projectsRoutes from './src/server/routes/projects';
import paymentsRoutes from './src/server/routes/payments';
import messagesRoutes from './src/server/routes/messages';
import notificationsRoutes from './src/server/routes/notifications';
import adminRoutes from './src/server/routes/admin';
import searchRoutes from './src/server/routes/search';
import filterRoutes from './src/server/routes/filter';

// Import Middlewares
import { globalLimiter } from './src/server/middlewares/rateLimiter';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Security Middlewares
  app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP for Vite dev server compatibility
  app.use(globalLimiter);

  // Middlewares
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // API Routes
  app.use('/api', authRoutes);
  app.use('/api', publicRoutes);
  app.use('/api', ordersRoutes);
  app.use('/api', customRequestRoutes);
  app.use('/api', projectsRoutes);
  app.use('/api', paymentsRoutes);
  app.use('/api', messagesRoutes);
  app.use('/api', notificationsRoutes);
  app.use('/api', adminRoutes);
  app.use('/api', searchRoutes);
  app.use('/api', filterRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.originalUrl.startsWith('/api')) {
         return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
