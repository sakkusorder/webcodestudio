import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, saveUsers, User } from '../db';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

// Initialize Supabase fallback client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

router.post('/register', authLimiter, async (req, res) => {
  const { fullName, email, phone, password, confirmPassword } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const phoneRegex = /^[0-9+-\s]{8,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid mobile number' });
  }

  const users = getUsers();
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  if (users.some(u => u.phone === phone)) {
    return res.status(400).json({ error: 'Mobile number already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: User = {
    id: uuidv4(),
    fullName,
    email,
    phone,
    passwordHash,
    role: 'client',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'Registration successful!' });
});

router.post('/login', authLimiter, async (req, res) => {
  const { loginId, password } = req.body;
  
  if (!loginId || !password) {
    return res.status(400).json({ error: 'Login ID and password are required' });
  }

  const users = getUsers();
  let user = users.find(u => u.email === loginId || u.phone === loginId);

  // If not found in local JSON, try fallback to existing Supabase user
  if (!user && loginId.includes('@') && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginId,
        password: password
      });
      
      if (!error && data.user) {
        // Successfully authenticated against old Supabase DB!
        // We can create a local token for them.
        user = {
          id: data.user.id,
          fullName: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || loginId,
          phone: '',
          passwordHash: '', // We don't store it
          role: 'client',
          createdAt: new Date().toISOString()
        };
      }
    } catch (e) {
      console.error("Supabase fallback error", e);
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.passwordHash) {
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  const payload = { id: user.id, email: user.email, role: user.role, name: user.fullName };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  });

  res.json({ token, user: payload });
});

router.post('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/profile', authenticateToken, (req: AuthRequest, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user?.id);
  
  if (!user) {
    // If not found in local DB, it might be an old Supabase user who just has a valid token
    if (req.user) {
      return res.json({ user: req.user });
    }
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

router.post('/forgot-password', async (req, res) => {
  res.json({ message: 'Password reset feature coming soon' });
});

export default router;
