# Baxoq.Store Documentation

## Overview

Baxoq.Store is a full-stack, production-ready e-commerce web application designed to sell premium swords and knives to customers around the world. The application features a modern, responsive design with comprehensive functionality for both customers and administrators.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Templating Engine**: EJS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### Frontend
- **Library**: React.js with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM

## Project Structure

The project follows a monorepo structure with separate directories for backend and frontend:

```
Baxoq.Store/
├── backend/             # Express.js server
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── views/           # EJS templates
│   ├── public/          # Static files
│   ├── .env.example     # Environment variables example
│   ├── package.json     # Backend dependencies
│   └── server.js        # Server entry point
│
├── frontend/            # React.js application
│   ├── public/          # Static files
│   ├── src/             # Source code
│   │   ├── assets/      # Images, fonts, etc.
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── slices/      # Redux slices
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Utility functions
│   │   ├── App.tsx      # Main component
│   │   ├── main.tsx     # Entry point
│   │   └── store.ts     # Redux store
│   ├── .env.example     # Environment variables example
│   ├── package.json     # Frontend dependencies
│   ├── tsconfig.json    # TypeScript configuration
│   └── vite.config.ts   # Vite configuration
│
└── docs/                # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string and JWT secret:
   ```
   MONGO_URI=mongodb://localhost:27017/baxoq_store
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your backend API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/users/register` | Register a new user | Public |
| POST | `/api/users/login` | Authenticate user & get token | Public |
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update user profile | Private |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| GET | `/api/products/slug/:slug` | Get product by slug | Public |
| GET | `/api/products/featured` | Get featured products | Public |
| POST | `/api/products` | Create a product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |
| POST | `/api/products/:id/reviews` | Create product review | Private |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create new order | Private |
| GET | `/api/orders/myorders` | Get logged in user orders | Private |
| GET | `/api/orders/:id` | Get order by ID | Private |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/pay` | Update order to paid | Private |
| PUT | `/api/orders/:id/deliver` | Update order to delivered | Admin |

### Newsletter

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter | Public |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe from newsletter | Public |

### Contact

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/contact` | Submit contact form | Public |
| GET | `/api/contact` | Get all contact submissions | Admin |

## Features

### Customer Features
- Browse products with filtering and search
- View detailed product information
- Add products to cart
- Manage cart items
- Complete checkout process
- Create account and login
- View order history
- Submit product reviews
- Subscribe to newsletter
- Contact customer support

### Admin Features
- Dashboard with sales statistics
- Manage products (add, edit, delete)
- Manage orders (view, update status)
- Manage users (view, edit roles)
- View contact form submissions
- View newsletter subscribers

## Deployment Guidelines

### Backend Deployment

1. Ensure your production environment variables are set in `.env`:
   ```
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   PORT=5000
   NODE_ENV=production
   ```

2. Build the application:
   ```
   npm run build
   ```

3. Start the production server:
   ```
   npm start
   ```

### Frontend Deployment

1. Update the `.env` file with your production API URL:
   ```
   VITE_API_URL=https://your-api-domain.com/api
   ```

2. Build the application:
   ```
   npm run build
   ```

3. The build output will be in the `dist` directory, which can be deployed to any static hosting service like Netlify, Vercel, or AWS S3.

## SEO Optimization

The application includes several SEO optimizations:

- Server-side metadata setup for each product
- SEO-friendly slugs for product URLs
- Open Graph / Twitter Card tags for social sharing
- Structured data (JSON-LD) for products
- Responsive design for mobile compatibility
- Optimized performance with lazy loading

## Performance Considerations

- Use production builds for deployment
- Enable gzip compression on the server
- Implement caching strategies for API responses
- Optimize images before uploading
- Use CDN for static assets
- Implement lazy loading for images and routes

## Security Considerations

- Store sensitive information in environment variables
- Implement proper authentication and authorization
- Validate and sanitize user inputs
- Use HTTPS for all communications
- Implement rate limiting for API endpoints
- Regularly update dependencies

## Maintenance

- Regularly backup the database
- Monitor server performance and logs
- Keep dependencies updated
- Implement automated testing
- Document code changes
