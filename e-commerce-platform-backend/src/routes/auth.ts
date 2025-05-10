import express from 'express';
import { prisma } from '../app';
import { hashPassword, comparePassword, generateToken, validateEmail, validatePassword } from '../utils/helpers';
import { handleAsync } from '../utils/helpers';
import { AppError } from '../middlewares/error';
import { auth } from '../middlewares/auth';

const router = express.Router();

// Register
router.post('/register', handleAsync(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  if (!validateEmail(email)) {
    throw new AppError('Please provide a valid email', 400);
  }

  if (!validatePassword(password)) {
    throw new AppError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });

  const token = generateToken(user.id);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  });
}));

// Login
router.post('/login', handleAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);

  res.json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  });
}));

// Get current user
router.get('/me', auth, handleAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  res.json({
    status: 'success',
    data: {
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role
      }
    }
  });
}));

// Change password
router.patch('/change-password', auth, handleAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide current password and new password', 400);
  }

  if (!validatePassword(newPassword)) {
    throw new AppError('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user || !(await comparePassword(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect', 401);
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  res.json({
    status: 'success',
    message: 'Password updated successfully'
  });
}));

export default router; 