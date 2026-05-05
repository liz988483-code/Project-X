# 🚀 Quick Deployment Instructions

## Backend → Render (5 minutes)

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Click **Build and deploy from a Git repository**
4. Connect your GitHub account if needed
5. Search and select your repository
6. Configure:
   - **Name**: `soko-api-gateway`
   - **Environment**: Docker
   - **Dockerfile Path**: `backend/api-gateway/Dockerfile`
   - **Auto-deploy**: Yes
7. Click **Advanced** and add environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=86d789a7f861dd2742f0371db8dfb823e7104d7e643e162a6d668e0d20a1fb4b
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   CORS_ORIGINS=https://soko-mauve.vercel.app
   FRONTEND_URL=https://soko-mauve.vercel.app
   DATABASE_URL=postgresql://neondb_owner:npg_o4yKQurNHD5i@ep-restless-salad-am423kn0-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   CLOUDINARY_CLOUD_NAME=ddqd3gvuf
   CLOUDINARY_API_KEY=278272538658413
   CLOUDINARY_API_SECRET=iMMCV4pRzqRiPVx9CxmD0KndOBY
   CLOUDINARY_UPLOAD_FOLDER=soko
   ```
8. Click **Create Web Service** and wait 5-10 minutes for build
9. Your API will be at: `https://soko-api-gateway.onrender.com`

---

## Frontend → Vercel (3 minutes)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Search and select your repository
5. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `frontend/web`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://soko-api-gateway.onrender.com
   NEXT_PUBLIC_SITE_URL=https://soko-mauve.vercel.app
   DATABASE_URL=postgresql://neondb_owner:npg_o4yKQurNHD5i@ep-restless-salad-am423kn0-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   CLOUDINARY_CLOUD_NAME=ddqd3gvuf
   CLOUDINARY_API_KEY=278272538658413
   CLOUDINARY_API_SECRET=iMMCV4pRzqRiPVx9CxmD0KndOBY
   CLOUDINARY_UPLOAD_FOLDER=soko
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddqd3gvuf
   NEXT_PUBLIC_CLOUDINARY_URL=https://res.cloudinary.com/ddqd3gvuf
   ```
7. Click **Deploy** and wait 3-5 minutes
8. Your site will be at: `https://soko-mauve.vercel.app`

---

## ✅ Verification

After both deploy:

**Test Backend:**
```bash
curl https://soko-api-gateway.onrender.com/health
```

**Test Frontend:**
Visit https://soko-mauve.vercel.app

---

## Status

| Component | Status | URL |
|-----------|--------|-----|
| Code | ✅ Pushed to Git | GitHub main branch |
| Backend | ⏳ Ready to Deploy | Will be on Render |
| Frontend | ⏳ Ready to Deploy | Will be on Vercel |
| Database | ✅ Connected | Neon (active) |
| Cloudinary | ✅ Connected | Active |

Everything is ready! Deploy via the dashboards above. 🎉
