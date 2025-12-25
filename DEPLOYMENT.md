# Deployment Guide

This guide will help you deploy Haven Hop to production.

## Prerequisites

- Node.js 14.x or higher
- MongoDB database (local or cloud like MongoDB Atlas)
- Git

## Environment Variables

Before deploying, make sure to set up the following environment variables:

```env
NODE_ENV=production
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_random_secret_key
MAPBOX_TOKEN=your_mapbox_token (optional)
PORT=8080
```

## Deployment Options

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**

   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create a new Heroku app**

   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URL=your_mongodb_connection_string
   heroku config:set SESSION_SECRET=your_random_secret_key
   ```

5. **Deploy**

   ```bash
   git push heroku main
   ```

6. **Open your app**
   ```bash
   heroku open
   ```

### Option 2: Deploy to Render

1. **Create account** on [Render.com](https://render.com)

2. **Create a new Web Service**

   - Connect your GitHub repository
   - Select the repository
   - Configure:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add environment variables** in the Render dashboard:

   - `NODE_ENV` = `production`
   - `MONGO_URL` = your MongoDB connection string
   - `SESSION_SECRET` = your secret key

4. **Deploy** - Render will automatically deploy your app

### Option 3: Deploy to Railway

1. **Create account** on [Railway.app](https://railway.app)

2. **Create new project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add environment variables**

   - Go to Variables tab
   - Add all required environment variables

4. **Deploy** - Railway will automatically build and deploy

### Option 4: VPS (DigitalOcean, AWS, etc.)

1. **Set up server**

   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js and MongoDB**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y mongodb
   ```

3. **Clone repository**

   ```bash
   git clone your-repo-url
   cd haven-hop
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables**

   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Install PM2 (Process Manager)**

   ```bash
   sudo npm install -g pm2
   ```

7. **Start application**

   ```bash
   pm2 start app.js --name haven-hop
   pm2 save
   pm2 startup
   ```

8. **Set up Nginx (optional, for reverse proxy)**
   ```bash
   sudo apt-get install nginx
   # Configure Nginx to proxy to your app
   ```

## MongoDB Atlas Setup

If you don't have a MongoDB database:

1. **Create account** on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster**

   - Choose free tier
   - Select region closest to your users

3. **Create database user**

   - Database Access → Add New Database User
   - Set username and password

4. **Whitelist IP addresses**

   - Network Access → Add IP Address
   - For development: Allow access from anywhere (0.0.0.0/0)
   - For production: Add specific IPs

5. **Get connection string**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `haven_hop`

## Post-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Database connection is working
- [ ] Session secret is set to a strong random string
- [ ] Test user registration and login
- [ ] Test creating, editing, and deleting listings
- [ ] Test adding and deleting reviews
- [ ] Check that maps are loading correctly
- [ ] Verify all routes are working
- [ ] Check for any console errors
- [ ] Test on mobile devices

## Troubleshooting

### Database Connection Issues

- Verify MONGO_URL is correct
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

### Session Issues

- Make sure SESSION_SECRET is set
- Check if cookies are being set correctly

### Map Not Loading

- Verify MAPBOX_TOKEN (if using Mapbox)
- Check browser console for errors

## Security Recommendations

1. **Use strong SESSION_SECRET**

   ```bash
   # Generate a random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Enable HTTPS** in production

3. **Set secure cookie options** for production:

   ```javascript
   cookie: {
     secure: true, // Only send over HTTPS
     httpOnly: true,
     sameSite: 'strict'
   }
   ```

4. **Add rate limiting** to prevent abuse

5. **Sanitize user inputs** to prevent XSS attacks

6. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

## Monitoring

Consider adding monitoring tools:

- **PM2 Monitoring** (for VPS deployments)
- **Sentry** for error tracking
- **LogRocket** for user session replay
- **Google Analytics** for usage statistics

## Support

If you encounter any issues during deployment, please create an issue on GitHub.

Good luck with your deployment! 🚀
