# API Documentation for Baxoq.Store

This document provides detailed information about the RESTful API endpoints available in Baxoq.Store.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Many endpoints require authentication. To authenticate requests, include a JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

You can obtain a token by logging in through the `/api/users/login` endpoint.

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Endpoints

### Authentication

#### Register a new user

```
POST /api/users/register
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

#### Login user

```
POST /api/users/login
```

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

#### Get user profile

```
GET /api/users/profile
```

Authorization: Required

Response:
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    }
  }
}
```

#### Update user profile

```
PUT /api/users/profile
```

Authorization: Required

Request body:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "newpassword123",
  "shippingAddress": {
    "address": "456 Elm St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "john@example.com",
    "isAdmin": false,
    "shippingAddress": {
      "address": "456 Elm St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    }
  }
}
```

### Products

#### Get all products

```
GET /api/products
```

Query parameters:
- `keyword`: Search term (optional)
- `category`: Filter by category (optional)
- `pageNumber`: Page number for pagination (default: 1)
- `sortBy`: Sort field and direction (e.g., "price:asc", "name:desc") (optional)

Response:
```json
{
  "success": true,
  "products": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Katana Sword",
      "slug": "katana-sword",
      "image": "/images/katana.jpg",
      "brand": "Hattori Hanzo",
      "category": "Swords",
      "description": "Traditional Japanese sword...",
      "price": 299.99,
      "countInStock": 10,
      "rating": 4.5,
      "numReviews": 12,
      "featured": true
    },
    // More products...
  ],
  "page": 1,
  "pages": 5,
  "count": 50
}
```

#### Get product by ID

```
GET /api/products/:id
```

Response:
```json
{
  "success": true,
  "product": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Katana Sword",
    "slug": "katana-sword",
    "image": "/images/katana.jpg",
    "images": [
      "/images/katana-1.jpg",
      "/images/katana-2.jpg"
    ],
    "brand": "Hattori Hanzo",
    "category": "Swords",
    "description": "Traditional Japanese sword...",
    "price": 299.99,
    "countInStock": 10,
    "rating": 4.5,
    "numReviews": 12,
    "featured": true,
    "reviews": [
      {
        "name": "John Doe",
        "rating": 5,
        "comment": "Excellent quality!",
        "user": "60d21b4667d0d8992e610c85",
        "createdAt": "2023-04-01T12:00:00.000Z"
      }
      // More reviews...
    ]
  }
}
```

#### Get product by slug

```
GET /api/products/slug/:slug
```

Response: Same as Get product by ID

#### Get featured products

```
GET /api/products/featured
```

Response:
```json
{
  "success": true,
  "products": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Katana Sword",
      "slug": "katana-sword",
      "image": "/images/katana.jpg",
      "brand": "Hattori Hanzo",
      "category": "Swords",
      "description": "Traditional Japanese sword...",
      "price": 299.99,
      "countInStock": 10,
      "rating": 4.5,
      "numReviews": 12,
      "featured": true
    },
    // More featured products...
  ]
}
```

#### Create a product

```
POST /api/products
```

Authorization: Admin only

Request body (multipart/form-data):
```
name: "Katana Sword"
price: 299.99
image: [file upload]
brand: "Hattori Hanzo"
category: "Swords"
countInStock: 10
description: "Traditional Japanese sword..."
featured: true
```

Response:
```json
{
  "success": true,
  "product": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Katana Sword",
    "slug": "katana-sword",
    "image": "/images/katana.jpg",
    "brand": "Hattori Hanzo",
    "category": "Swords",
    "description": "Traditional Japanese sword...",
    "price": 299.99,
    "countInStock": 10,
    "rating": 0,
    "numReviews": 0,
    "featured": true
  }
}
```

#### Update a product

```
PUT /api/products/:id
```

Authorization: Admin only

Request body (multipart/form-data): Same as Create a product

Response:
```json
{
  "success": true,
  "product": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Katana Sword - Updated",
    "slug": "katana-sword-updated",
    "image": "/images/katana-updated.jpg",
    "brand": "Hattori Hanzo",
    "category": "Swords",
    "description": "Updated description...",
    "price": 349.99,
    "countInStock": 15,
    "rating": 4.5,
    "numReviews": 12,
    "featured": true
  }
}
```

#### Delete a product

```
DELETE /api/products/:id
```

Authorization: Admin only

Response:
```json
{
  "success": true,
  "message": "Product removed"
}
```

#### Create product review

```
POST /api/products/:id/reviews
```

Authorization: Required

Request body:
```json
{
  "rating": 5,
  "comment": "Excellent quality!"
}
```

Response:
```json
{
  "success": true,
  "message": "Review added"
}
```

### Orders

#### Create new order

```
POST /api/orders
```

Authorization: Required

Request body:
```json
{
  "orderItems": [
    {
      "product": "60d21b4667d0d8992e610c85",
      "name": "Katana Sword",
      "image": "/images/katana.jpg",
      "price": 299.99,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Boston",
    "postalCode": "02108",
    "country": "USA"
  },
  "paymentMethod": "PayPal",
  "itemsPrice": 299.99,
  "shippingPrice": 15.99,
  "taxPrice": 24.00,
  "totalPrice": 339.98
}
```

Response:
```json
{
  "success": true,
  "order": {
    "_id": "60d21b4667d0d8992e610c85",
    "user": "60d21b4667d0d8992e610c85",
    "orderItems": [
      {
        "product": "60d21b4667d0d8992e610c85",
        "name": "Katana Sword",
        "image": "/images/katana.jpg",
        "price": 299.99,
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 299.99,
    "shippingPrice": 15.99,
    "taxPrice": 24.00,
    "totalPrice": 339.98,
    "isPaid": false,
    "isDelivered": false,
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Get logged in user orders

```
GET /api/orders/myorders
```

Authorization: Required

Response:
```json
{
  "success": true,
  "orders": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "user": "60d21b4667d0d8992e610c85",
      "orderItems": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "name": "Katana Sword",
          "image": "/images/katana.jpg",
          "price": 299.99,
          "quantity": 1
        }
      ],
      "shippingAddress": {
        "address": "123 Main St",
        "city": "Boston",
        "postalCode": "02108",
        "country": "USA"
      },
      "paymentMethod": "PayPal",
      "itemsPrice": 299.99,
      "shippingPrice": 15.99,
      "taxPrice": 24.00,
      "totalPrice": 339.98,
      "isPaid": true,
      "paidAt": "2023-04-01T13:00:00.000Z",
      "isDelivered": false,
      "createdAt": "2023-04-01T12:00:00.000Z"
    }
    // More orders...
  ]
}
```

#### Get order by ID

```
GET /api/orders/:id
```

Authorization: Required (User can only access their own orders, Admin can access any order)

Response:
```json
{
  "success": true,
  "order": {
    "_id": "60d21b4667d0d8992e610c85",
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "orderItems": [
      {
        "product": "60d21b4667d0d8992e610c85",
        "name": "Katana Sword",
        "image": "/images/katana.jpg",
        "price": 299.99,
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "paymentResult": {
      "id": "5O190127783134954",
      "status": "COMPLETED",
      "update_time": "2023-04-01T13:00:00Z",
      "email_address": "john@example.com"
    },
    "itemsPrice": 299.99,
    "shippingPrice": 15.99,
    "taxPrice": 24.00,
    "totalPrice": 339.98,
    "isPaid": true,
    "paidAt": "2023-04-01T13:00:00.000Z",
    "isDelivered": false,
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Get all orders

```
GET /api/orders
```

Authorization: Admin only

Response:
```json
{
  "success": true,
  "orders": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "orderItems": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "name": "Katana Sword",
          "image": "/images/katana.jpg",
          "price": 299.99,
          "quantity": 1
        }
      ],
      "shippingAddress": {
        "address": "123 Main St",
        "city": "Boston",
        "postalCode": "02108",
        "country": "USA"
      },
      "paymentMethod": "PayPal",
      "itemsPrice": 299.99,
      "shippingPrice": 15.99,
      "taxPrice": 24.00,
      "totalPrice": 339.98,
      "isPaid": true,
      "paidAt": "2023-04-01T13:00:00.000Z",
      "isDelivered": false,
      "createdAt": "2023-04-01T12:00:00.000Z"
    }
    // More orders...
  ]
}
```

#### Update order to paid

```
PUT /api/orders/:id/pay
```

Authorization: Required

Request body:
```json
{
  "id": "5O190127783134954",
  "status": "COMPLETED",
  "update_time": "2023-04-01T13:00:00Z",
  "email_address": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "order": {
    "_id": "60d21b4667d0d8992e610c85",
    "user": "60d21b4667d0d8992e610c85",
    "orderItems": [
      {
        "product": "60d21b4667d0d8992e610c85",
        "name": "Katana Sword",
        "image": "/images/katana.jpg",
        "price": 299.99,
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "paymentResult": {
      "id": "5O190127783134954",
      "status": "COMPLETED",
      "update_time": "2023-04-01T13:00:00Z",
      "email_address": "john@example.com"
    },
    "itemsPrice": 299.99,
    "shippingPrice": 15.99,
    "taxPrice": 24.00,
    "totalPrice": 339.98,
    "isPaid": true,
    "paidAt": "2023-04-01T13:00:00.000Z",
    "isDelivered": false,
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

#### Update order to delivered

```
PUT /api/orders/:id/deliver
```

Authorization: Admin only

Response:
```json
{
  "success": true,
  "order": {
    "_id": "60d21b4667d0d8992e610c85",
    "user": "60d21b4667d0d8992e610c85",
    "orderItems": [
      {
        "product": "60d21b4667d0d8992e610c85",
        "name": "Katana Sword",
        "image": "/images/katana.jpg",
        "price": 299.99,
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02108",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "paymentResult": {
      "id": "5O190127783134954",
      "status": "COMPLETED",
      "update_time": "2023-04-01T13:00:00Z",
      "email_address": "john@example.com"
    },
    "itemsPrice": 299.99,
    "shippingPrice": 15.99,
    "taxPrice": 24.00,
    "totalPrice": 339.98,
    "isPaid": true,
    "paidAt": "2023-04-01T13:00:00.000Z",
    "isDelivered": true,
    "deliveredAt": "2023-04-03T10:00:00.000Z",
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

### Newsletter

#### Subscribe to newsletter

```
POST /api/newsletter/subscribe
```

Request body:
```json
{
  "email": "john@example.com",
  "preferences": ["swords", "knives", "promotions"]
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

#### Unsubscribe from newsletter

```
POST /api/newsletter/unsubscribe
```

Request body:
```json
{
  "email": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

### Contact

#### Submit contact form

```
POST /api/contact
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Product Inquiry",
  "message": "I have a question about your Katana sword..."
}
```

Response:
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

#### Get all contact submissions

```
GET /api/contact
```

Authorization: Admin only

Response:
```json
{
  "success": true,
  "contacts": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Product Inquiry",
      "message": "I have a question about your Katana sword...",
      "status": "unread",
      "createdAt": "2023-04-01T12:00:00.000Z"
    }
    // More contact submissions...
  ]
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting:
- 100 requests per IP address per 15-minute window for public endpoints
- 300 requests per IP address per 15-minute window for authenticated endpoints

## Pagination

Endpoints that return multiple items (like products or orders) support pagination:
- Default page size: 10 items
- Maximum page size: 50 items

## Versioning

The current API version is v1. All endpoints are prefixed with `/api` without explicit version number. Future versions will be prefixed with `/api/v2`, etc.
