# E-Commerce Platform Backend

This is the backend API for an e-commerce platform, built with Node.js, Express, TypeScript, and Prisma.

## Features

- User authentication (register, login, profile management)
- Product management (categories, search, filtering)
- Shopping cart functionality
- Order processing
- Review system
- User favorites
- Coupon system
- Address management
- Messaging system

## Tech Stack

- Node.js & Express
- TypeScript
- Prisma (PostgreSQL)
- JWT Authentication
- RESTful API design
- Multer for file uploads

## Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd e-commerce-platform-backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file based on the `.env.example` file and fill in your configuration.

4. Set up the database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start the development server

```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/change-password` - Change password

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload user avatar
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PATCH /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart Endpoints

- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Order Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `PATCH /api/orders/:id/cancel` - Cancel order

## License

This project is licensed under the MIT License. 