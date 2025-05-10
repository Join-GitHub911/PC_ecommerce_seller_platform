import express, { Request, Response } from 'express';
import { prisma } from '../app';
import { handleAsync } from '../utils/helpers';
import { AppError } from '../middlewares/error';
import { auth, adminAuth } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { validatePhone } from '../utils/helpers';

interface AuthRequest extends Request {
  user?: any;
  file?: Express.Multer.File;
}

const router = express.Router();

// Get user profile
router.get('/profile', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      addresses: true,
      cart: {
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  res.json({
    status: 'success',
    data: {
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        phone: user?.phone,
        avatar: user?.avatar,
        addresses: user?.addresses,
        cart: user?.cart
      }
    }
  });
}));

// Update user profile
router.patch('/profile', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const { name, phone } = req.body;

  if (phone && !validatePhone(phone)) {
    throw new AppError('Please provide a valid phone number', 400);
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name,
      phone
    }
  });

  res.json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar
      }
    }
  });
}));

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), handleAsync(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new AppError('Please upload an image', 400);
  }

  const avatarUrl = `/uploads/${req.file.filename}`;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatar: avatarUrl }
  });

  res.json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        avatar: user.avatar
      }
    }
  });
}));

// Get all users (admin only)
router.get('/', adminAuth, handleAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true
    }
  });

  res.json({
    status: 'success',
    data: {
      users
    }
  });
}));

// Delete user (admin only)
router.delete('/:id', adminAuth, handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id }
  });

  res.json({
    status: 'success',
    message: 'User deleted successfully'
  });
}));

export default router; 