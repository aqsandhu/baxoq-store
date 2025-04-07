# Deployment Guide for Baxoq.Store

This document provides detailed instructions for deploying the Baxoq.Store application to production environments.

## Prerequisites

Before deploying, ensure you have:

- A MongoDB database (MongoDB Atlas recommended for production)
- A Node.js hosting environment (Heroku, DigitalOcean, AWS, etc.)
- A static file hosting service for the frontend (Netlify, Vercel, AWS S3, etc.)
- Domain name(s) if using custom domains

## Backend Deployment

### Option 1: Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI:
   ```
   heroku login
   ```

3. Navigate to the backend directory:
   ```
   cd backend
   ```

4. Create a new Heroku app:
   ```
   heroku create baxoq-store-api
   ```

5. Add MongoDB add-on or set environment variables for your MongoDB Atlas connection:
   ```
   heroku config:set MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/baxoq_store
   heroku config:set JWT_SECRET=your_production_jwt_secret
   heroku config:set NODE_ENV=production
   ```

6. Deploy to Heroku:
   ```
   git subtree push --prefix backend heroku main
   ```

7. Verify the deployment:
   ```
   heroku open
   ```

### Option 2: DigitalOcean App Platform

1. Create a DigitalOcean account
2. Create a new App from the App Platform dashboard
3. Connect your GitHub repository
4. Configure the app:
   - Source Directory: `/backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Environment Variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `NODE_ENV`: production

5. Deploy the app

### Option 3: AWS Elastic Beanstalk

1. Create an AWS account
2. Install the AWS CLI and EB CLI
3. Navigate to the backend directory:
   ```
   cd backend
   ```

4. Initialize EB CLI:
   ```
   eb init
   ```

5. Create an environment:
   ```
   eb create baxoq-store-production
   ```

6. Set environment variables:
   ```
   eb setenv MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/baxoq_store JWT_SECRET=your_production_jwt_secret NODE_ENV=production
   ```

7. Deploy the application:
   ```
   eb deploy
   ```

## Frontend Deployment

### Option 1: Netlify Deployment

1. Create a Netlify account
2. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

3. Navigate to the frontend directory:
   ```
   cd frontend
   ```

4. Create a `.env.production` file with your production API URL:
   ```
   VITE_API_URL=https://your-backend-api.herokuapp.com/api
   ```

5. Build the frontend:
   ```
   npm run build
   ```

6. Deploy to Netlify:
   ```
   netlify deploy --prod
   ```

### Option 2: Vercel Deployment

1. Create a Vercel account
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Navigate to the frontend directory:
   ```
   cd frontend
   ```

4. Create a `vercel.json` file:
   ```json
   {
     "env": {
       "VITE_API_URL": "https://your-backend-api.herokuapp.com/api"
     },
     "build": {
       "env": {
         "VITE_API_URL": "https://your-backend-api.herokuapp.com/api"
       }
     }
   }
   ```

5. Deploy to Vercel:
   ```
   vercel --prod
   ```

### Option 3: AWS S3 + CloudFront

1. Create an AWS account
2. Create an S3 bucket for hosting the website
3. Enable static website hosting on the bucket
4. Build the frontend:
   ```
   cd frontend
   VITE_API_URL=https://your-backend-api.com/api npm run build
   ```

5. Upload the build files to S3:
   ```
   aws s3 sync dist/ s3://your-bucket-name
   ```

6. Create a CloudFront distribution pointing to the S3 bucket
7. Configure your domain name to point to the CloudFront distribution

## Domain Configuration

### Custom Domain for Backend

1. Purchase a domain name (e.g., api.baxoq.store)
2. Configure DNS settings to point to your backend hosting provider
3. Set up SSL certificate for HTTPS

### Custom Domain for Frontend

1. Purchase a domain name (e.g., baxoq.store)
2. Configure DNS settings to point to your frontend hosting provider
3. Set up SSL certificate for HTTPS

## Continuous Deployment

### GitHub Actions for Backend

Create a file at `.github/workflows/backend-deploy.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "baxoq-store-api"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "backend"
```

### GitHub Actions for Frontend

Create a file at `.github/workflows/frontend-deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Build
        run: cd frontend && npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Monitoring and Logging

### Backend Monitoring

1. Set up application monitoring with services like New Relic or Datadog
2. Configure logging with Winston or similar logging library
3. Set up error tracking with Sentry

### Frontend Monitoring

1. Implement Google Analytics for user behavior tracking
2. Set up error tracking with Sentry
3. Configure performance monitoring with Lighthouse CI

## Backup Strategy

1. Set up automated MongoDB backups
2. Store backups in a secure location (e.g., AWS S3)
3. Test backup restoration periodically

## Security Considerations

1. Enable CORS with appropriate origins
2. Set up rate limiting for API endpoints
3. Implement proper authentication and authorization
4. Use HTTPS for all communications
5. Keep dependencies updated
6. Perform regular security audits

## Scaling Considerations

### Backend Scaling

1. Implement caching strategies (Redis, Memcached)
2. Use load balancers for distributing traffic
3. Consider containerization with Docker and Kubernetes for easier scaling

### Database Scaling

1. Set up MongoDB Atlas with appropriate tier for your traffic
2. Configure proper indexing for frequently queried fields
3. Consider sharding for very large datasets

### Frontend Scaling

1. Use CDN for static assets
2. Implement code splitting and lazy loading
3. Optimize images and assets for faster loading

## Troubleshooting

### Common Backend Issues

1. Connection issues with MongoDB
   - Check network connectivity
   - Verify MongoDB connection string
   - Ensure IP whitelist includes your server IP

2. Server crashes
   - Check logs for error messages
   - Verify memory usage and CPU load
   - Implement proper error handling

### Common Frontend Issues

1. API connection issues
   - Verify API URL is correct
   - Check CORS configuration
   - Ensure backend is running

2. Build failures
   - Check for syntax errors
   - Verify dependencies are installed
   - Check environment variables

## Maintenance

1. Regularly update dependencies
2. Monitor server health and performance
3. Implement automated testing
4. Schedule regular backups
5. Plan for downtime during major updates
