# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Git repository setup
- Vercel account (for Vercel deployment)

## Local Development

### Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000

### Building Locally

\`\`\`bash
npm run build
npm run start
\`\`\`

## Production Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel is the official Next.js platform and provides the best integration.

#### Step 1: Prepare Your Repository

\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

#### Step 3: Configure

- **Project Name**: hookah-events
- **Framework**: Next.js
- **Root Directory**: ./
- **Environment Variables**: Add any required variables

#### Step 4: Deploy

Click "Deploy" - your site will be live in seconds!

**Your site will be available at**: `https://hookah-events.vercel.app`

### Option 2: Self-Hosted (Server/VPS)

For AWS, Digital Ocean, Linode, or similar:

#### Step 1: Server Setup

\`\`\`bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
\`\`\`

#### Step 2: Clone & Setup

\`\`\`bash
cd /var/www
git clone <your-repo-url> hookah-events
cd hookah-events

npm install
npm run build
\`\`\`

#### Step 3: Start Application

\`\`\`bash
pm2 start npm --name "hookah-events" -- start
pm2 startup
pm2 save
\`\`\`

#### Step 4: Setup Reverse Proxy (Nginx)

\`\`\`nginx
server {
    listen 80;
    server_name hookahevents.ru www.hookahevents.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

#### Step 5: SSL Certificate (Let's Encrypt)

\`\`\`bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d hookahevents.ru -d www.hookahevents.ru
\`\`\`

### Option 3: Docker Deployment

#### Dockerfile

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

#### Build & Run

\`\`\`bash
docker build -t hookah-events .
docker run -p 3000:80 hookah-events
\`\`\`

## Environment Variables

Create `.env.local` in root:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=https://hookahevents.ru/api

# Database (if needed)
DATABASE_URL=your_database_url

# Email Service (if implementing)
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@hookahevents.ru

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id
\`\`\`

## Post-Deployment Checklist

- [ ] Test all forms (contact, calculator, lead capture)
- [ ] Verify email notifications work
- [ ] Check mobile responsiveness
- [ ] Test 3D hook ah loading
- [ ] Verify all images load correctly
- [ ] Test smooth scroll on all navigation links
- [ ] Check SEO meta tags
- [ ] Test dark mode toggle
- [ ] Verify production build optimization
- [ ] Setup monitoring/error tracking

## Monitoring & Maintenance

### Setup Error Tracking

Consider using Sentry for error monitoring:

\`\`\`bash
npm install @sentry/nextjs
\`\`\`

### Performance Monitoring

1. Check Core Web Vitals in Google Search Console
2. Monitor Lighthouse scores
3. Track user analytics with Google Analytics

### Regular Updates

\`\`\`bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
\`\`\`

## Troubleshooting

### 3D Model Not Loading
- Verify Three.js is installed
- Check browser console for WebGL errors
- Ensure dynamic import is working

### Forms Not Submitting
- Check API route is accessible
- Verify CORS headers if needed
- Check environment variables

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind CSS v4 compatibility

### Performance Issues
- Check image optimization
- Verify dynamic imports working
- Profile with Chrome DevTools

## Support

For deployment issues:
- Check [Next.js docs](https://nextjs.org/docs)
- Review [Vercel deployment docs](https://vercel.com/docs)
- Contact support team

---

**Last Updated**: November 2025
