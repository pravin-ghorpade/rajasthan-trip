# 🚀 Deployment Guide - Rajasthan Hotel Picker

## Quick Deploy to Vercel (Recommended - 5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free - sign up at https://vercel.com)

### Step-by-Step Instructions

#### 1. **Push Your Code to GitHub**

```bash
# Initialize git if not already done
cd /Users/pravinghorpade/Desktop/rajasthan-picker
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Rajasthan Hotel Picker"

# Create a new repository on GitHub (https://github.com/new)
# Name it: rajasthan-picker

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rajasthan-picker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 2. **Deploy to Vercel**

**Option A: Using Vercel Website (Easiest)**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `rajasthan-picker` repository
5. Configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
6. Click **"Deploy"**
7. Wait 2-3 minutes ⏳
8. Your site is live! 🎉

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? rajasthan-picker
# - Directory? ./
# - Override settings? N

# Production deployment
vercel --prod
```

#### 3. **Your App is Live!**
- Vercel will give you a URL like: `https://rajasthan-picker.vercel.app`
- Share this link with your group!
- Every time you push to GitHub, Vercel automatically redeploys 🔄

---

## Alternative: Deploy to Netlify

### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build your app
npm run build

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

### Using Netlify Website
1. Go to https://netlify.com
2. Drag and drop your project folder
3. Or connect your GitHub repo

**Note:** For Netlify, you may need to add a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Alternative: Deploy to Your Own Server (VPS/Cloud)

### Requirements
- Node.js 18+ installed on server
- PM2 for process management
- Nginx for reverse proxy (optional)

### Steps

```bash
# 1. Build the app locally
npm run build

# 2. Copy these files to your server:
# - .next/
# - node_modules/
# - public/
# - package.json
# - next.config.js

# 3. On the server, install PM2
npm install -g pm2

# 4. Start the app
pm2 start npm --name "rajasthan-picker" -- start

# 5. Make it restart on reboot
pm2 startup
pm2 save

# 6. Your app runs on port 3000
# Access at: http://your-server-ip:3000
```

### Nginx Configuration (Optional - for custom domain)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables (If Needed Later)

If you add features requiring secrets (like database connections), create a `.env.local` file:

```bash
# .env.local (don't commit this!)
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

In Vercel:
1. Go to your project settings
2. Click "Environment Variables"
3. Add your variables
4. Redeploy

---

## Post-Deployment Checklist

✅ **Test all features:**
- [ ] Vote on hotels (all tabs work)
- [ ] Submit ratings
- [ ] View results tab
- [ ] Admin tab - add/edit/delete hotels
- [ ] Google preview links work
- [ ] Images load correctly

✅ **Share the link:**
- Send to your group members
- Bookmark it for easy access

✅ **Monitor usage:**
- Vercel dashboard shows analytics
- Check for errors in Vercel logs

---

## Updating Your Deployed App

Every time you make changes:

```bash
# 1. Make your changes locally
# 2. Test locally: npm run dev
# 3. Commit changes
git add .
git commit -m "Description of changes"
git push origin main

# Vercel automatically redeploys! 🚀
```

---

## Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `rajasthantrip.com`)
3. Follow DNS configuration instructions
4. Vercel provides free SSL certificate 🔒

---

## Troubleshooting

### Build Fails on Vercel
- Check Vercel build logs
- Ensure `package.json` has correct Node version:
  ```json
  "engines": {
    "node": ">=18.0.0"
  }
  ```

### Images Not Loading
- Ensure image URLs in JSON are publicly accessible
- Check browser console for CORS errors

### API Routes Not Working
- Vercel automatically handles API routes
- No additional configuration needed

### Data Not Persisting
- The JSON file writes work on Vercel's serverless functions
- For production with multiple users, consider:
  - Database (Supabase, MongoDB Atlas - both have free tiers)
  - Or keep current file-based approach (works fine for small groups)

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Check Logs:** Vercel Dashboard → Your Project → Deployments → Click deployment → View Logs

---

## 🎉 That's It!

Your Rajasthan Hotel Picker is now live and accessible to anyone with the link!
