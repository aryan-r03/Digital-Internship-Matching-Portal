import { Router, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/userService.js';
import { ProfileService } from '../services/profileService.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createRateLimiter } from '../middleware/security.js';

const router = Router();

// Rate limiter for authentication attempts (30 requests per 15 minutes)
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['candidate', 'employer', 'reader', 'creator', 'admin']).optional(),
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

const profileUpdateSchema = z.object({
  bio: z.string().max(300).optional(),
  avatar_url: z.string().url().optional(),
});

router.post('/register', authLimiter, validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = UserService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = UserService.login(req.body);
    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  // Client discards JWT token; session invalidated
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = UserService.getProfile(req.user!.userId);
    let candidateProfile = null;
    if (req.user!.role === 'candidate' || req.user!.role === 'reader' || !req.user!.role) {
      candidateProfile = ProfileService.getProfileByUserId(req.user!.userId);
    }

    res.json({
      success: true,
      data: {
        ...user,
        candidateProfile,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/profile', requireAuth, validateBody(profileUpdateSchema), async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const updated = UserService.updateProfile(req.user!.userId, req.body);
    res.json({
      success: true,
      message: 'User profile updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
