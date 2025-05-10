import express, { Request, Response } from 'express';
import { prisma } from '../app';
import { handleAsync } from '../utils/helpers';
import { AppError } from '../middlewares/error';
import { auth, adminAuth } from '../middlewares/auth';
import { calculateTotal } from '../utils/helpers';
import { CartItem, Product } from '@prisma/client';

interface AuthRequest extends Request {
  user?: any;
}

interface CartItemWithProduct extends CartItem {
  product: Product;
}

const router = express.Router();

// Create order
router.post('/', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const { addressId } = req.body;

  if (!addressId) {
    throw new AppError('Please provide delivery address', 400);
  }

  const address = await prisma.address.findUnique({
    where: { id: addressId }
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  if (address.userId !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

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

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Check stock and calculate total
  const orderItems = cart.items.map((item: CartItemWithProduct) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.product.price
  }));

  const total = calculateTotal(orderItems);

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      addressId,
      total,
      items: {
        create: orderItems
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      address: true
    }
  });

  // Update product stock
  for (const item of cart.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity
        }
      }
    });
  }

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
}));

// Get user orders
router.get('/', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      address: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json({
    status: 'success',
    data: {
      orders
    }
  });
}));

// Get order details
router.get('/:id', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      address: true
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('Not authorized', 403);
  }

  res.json({
    status: 'success',
    data: {
      order
    }
  });
}));

// Update order status (admin only)
router.patch('/:id/status', adminAuth, handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError('Please provide status', 400);
  }

  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          product: true
        }
      },
      address: true
    }
  });

  res.json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  });
}));

// Cancel order
router.patch('/:id/cancel', auth, handleAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.userId !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  if (order.status !== 'PENDING') {
    throw new AppError('Cannot cancel order in current status', 400);
  }

  // Restore product stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          increment: item.quantity
        }
      }
    });
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      items: {
        include: {
          product: true
        }
      },
      address: true
    }
  });

  res.json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  });
}));

export default router; 