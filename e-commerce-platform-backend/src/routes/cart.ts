import express, { Request, Response } from 'express';
import { prisma } from '../app';
import { handleAsync } from '../utils/helpers';
import { AppError } from '../middlewares/error';
import { auth } from '../middlewares/auth';
import { CartItem } from '@prisma/client';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Get cart
router.get('/', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  res.json({
    status: 'success',
    data: {
      cart
    }
  });
}));

// Add item to cart
router.post('/items', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new AppError('Please provide product ID and quantity', 400);
  }

  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: {
      items: true
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: req.user.id
      },
      include: {
        items: true
      }
    });
  }

  const existingItem = cart.items.find((item: CartItem) => item.productId === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError('Insufficient stock', 400);
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  res.json({
    status: 'success',
    data: {
      cart: updatedCart
    }
  });
}));

// Update cart item quantity
router.patch('/items/:id', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity) {
    throw new AppError('Please provide quantity', 400);
  }

  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: {
      cart: true,
      product: true
    }
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  if (cartItem.cart.userId !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  if (cartItem.product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  await prisma.cartItem.update({
    where: { id },
    data: { quantity }
  });

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cartItem.cartId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  res.json({
    status: 'success',
    data: {
      cart: updatedCart
    }
  });
}));

// Remove item from cart
router.delete('/items/:id', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: {
      cart: true
    }
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  if (cartItem.cart.userId !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  await prisma.cartItem.delete({
    where: { id }
  });

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cartItem.cartId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  res.json({
    status: 'success',
    data: {
      cart: updatedCart
    }
  });
}));

// Clear cart
router.delete('/', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id }
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  res.json({
    status: 'success',
    message: 'Cart cleared successfully'
  });
}));

export default router; 