# 🚀 Full Deployment Guide: Render, Vercel, and Neon

## ✅ Pre-Deployment Checklist

- [x] Frontend built successfully
- [x] Backend built successfully  
- [x] Environment variables configured
- [x] JWT Secret generated: `86d789a7f861dd2742f0371db8dfb823e7104d7e643e162a6d668e0d20a1fb4b`
- [x] Neon Database URL: Configured

## Summary of URLs & Credentials

| Service | Value |
|---------|-------|
| **Vercel App URL** | https://soko-mauve.vercel.app |
| **Render Backend URL** | https://soko-api-gateway.onrender.com |
| **Neon Database** | Connected |
| **JWT Secret** | 86d789a7f861dd2742f0371db8dfb823e7104d7e643e162a6d668e0d20a1fb4b |
| **Cloudinary Cloud** | ddqd3gvuf |

---

## Step 1️⃣: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `soko-api-gateway`
   - **Environment**: Docker
   - **Dockerfile Path**: `backend/api-gateway/Dockerfile`
   - **Auto-deploy**: Enable

5. Add Environment Variables (click **Advanced**):
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

6. Click **Create Web Service**
7. **Wait for build to complete** (5-10 minutes)
8. Copy your Render URL: `https://soko-api-gateway.onrender.com`

### Option B: Using render.yaml (Infrastructure as Code)

```bash
cd C:\PROJECT X\soko
git add render.yaml
git commit -m "Update render.yaml with deployment config"
git push
```

Then connect to Render and it will auto-deploy.

---

## Step 2️⃣: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
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

6. Click **Deploy**
7. **Wait for deployment** (3-5 minutes)

---

## Step 3️⃣: Database Setup (Neon)

### Your Neon Connection String is already configured:

```
DATABASE_URL=postgresql://neondb_owner:npg_o4yKQurNHD5i@ep-restless-salad-am423kn0-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Run Database Migrations:

If you have Prisma migrations:

```bash
cd C:\PROJECT X\soko\backend\services\user-service
npx prisma migrate deploy
npx prisma generate
```

Or manually execute SQL schemas in Neon Dashboard:
1. Go to [Neon Console](https://console.neon.tech)
2. Navigate to **SQL Editor**
3. Copy schemas from `databases/postgres/schemas/`
4. Execute each file

---

## Step 4️⃣: Connect the Services

After all deployments complete:

### In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_URL` to: `https://soko-api-gateway.onrender.com`
3. Redeploy: **Deployments** → **Redeploy** latest

### In Render Dashboard:
1. Go to `soko-api-gateway` service → **Environment**
2. Update these variables:
   - `CORS_ORIGINS`: `https://soko-mauve.vercel.app`
   - `FRONTEND_URL`: `https://soko-mauve.vercel.app`
   - `DATABASE_URL`: Your Neon URL
3. **Manual Restart**: Click **Restart** if needed

---

## Step 5️⃣: Verify Deployment

### Test Backend API:
```bash
curl https://soko-api-gateway.onrender.com/health
# Should return: {"status":"ok"}
```

### Test Frontend:
Visit: https://soko-mauve.vercel.app

Should load without CORS errors.

### Test Database Connection:
```bash
curl https://soko-api-gateway.onrender.com/api/database/status
```

---

## 🔍 Troubleshooting

### Render Build Fails
- Check logs: Render Dashboard → Service → **Logs**
- Ensure `backend/api-gateway/Dockerfile` exists
- Run locally: `docker build -t test backend/api-gateway/`

### Vercel Build Fails
- Check logs: Vercel Dashboard → Deployment
- Ensure `frontend/web/package.json` exists
- Run locally: `cd frontend/web && npm run build`

### CORS Errors
- Backend `CORS_ORIGINS` must match Vercel URL exactly
- Check Render environment variables

### Database Connection Issues
- Verify Neon connection string has `sslmode=require`
- Test locally first with same connection string
- Check Neon firewall settings allow Render IP

---

## Environment Variables Reference

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://soko-api-gateway.onrender.com
NEXT_PUBLIC_SITE_URL=https://soko-mauve.vercel.app
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=ddqd3gvuf
CLOUDINARY_API_KEY=278272538658413
CLOUDINARY_API_SECRET=iMMCV4pRzqRiPVx9CxmD0KndOBY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddqd3gvuf
NEXT_PUBLIC_CLOUDINARY_URL=https://res.cloudinary.com/ddqd3gvuf
```

### Backend (.env / Render)
```
NODE_ENV=production
PORT=3001
JWT_SECRET=86d789a7f861dd2742f0371db8dfb823e7104d7e643e162a6d668e0d20a1fb4b
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGINS=https://soko-mauve.vercel.app
FRONTEND_URL=https://soko-mauve.vercel.app
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=ddqd3gvuf
CLOUDINARY_API_KEY=278272538658413
CLOUDINARY_API_SECRET=iMMCV4pRzqRiPVx9CxmD0KndOBY
```

---

## 📞 Support

- **Render Issues**: https://render.com/docs
- **Vercel Issues**: https://vercel.com/docs
- **Neon Issues**: https://neon.tech/docs

---

**All environment files have been configured. You're ready to deploy!** 🎉
