# Deployment Guide: Vercel, Render, Cloudinary, Neon

This repo is prepared for:

- Vercel: `frontend/web` Next.js app
- Render: `backend/api-gateway` API gateway
- Cloudinary: product/media uploads through `frontend/web/app/api/upload/route.ts`
- Neon: Postgres through `DATABASE_URL`

## 1. Neon

1. Create a Neon project and database.
2. Copy the pooled connection string.
3. Use it anywhere the app asks for `DATABASE_URL`.

Example:

```env
DATABASE_URL=postgresql://user:password@ep-example.region.aws.neon.tech/soko?sslmode=require
```

The Prisma schema in `backend/services/user-service/prisma/schema.prisma` already reads `env("DATABASE_URL")`.

## 2. Cloudinary

Create a Cloudinary account, then copy:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=iMMCV4pRzqRiPVx9CxmD0KndOBY
CLOUDINARY_API_KEY=278272538658413
CLOUDINARY_API_SECRET=iMMCV4pRzqRiPVx9CxmD0KndOBY
CLOUDINARY_UPLOAD_FOLDER=soko
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=soko
CLOUDINARY_CLOUD_NAME=ddqd3gvuf
CLOUDINARY_CLOUD_NAME=ddqd3gvuf
NEXT_PUBLIC_CLOUDINARY_URL=https://res.cloudinary.com/
```

Signed uploads are supported with `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. If you prefer unsigned uploads, set `CLOUDINARY_UPLOAD_PRESET` instead.

## 3. Render API Gateway

Use `render.yaml` from the repo root, or create a Render Web Service manually:

- Runtime: Docker
- Dockerfile: `backend/api-gateway/Dockerfile`
- Service name: `soko-api-gateway`

Required Render env vars:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=replace_with_a_long_random_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
FRONTEND_URL=https://your-vercel-app.vercel.app
DATABASE_URL=your_neon_database_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_FOLDER=soko
```

After deploy, copy the Render URL:

```text
https://soko-api-gateway.onrender.com
```

## 4. Vercel Frontend

Create a Vercel project with:

- Root Directory: `frontend/web`
- Framework: Next.js
- Build Command: `npm run build`

Required Vercel env vars:

```env
NEXT_PUBLIC_API_URL=https://your-render-api-gateway.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_URL=https://res.cloudinary.com/your_cloudinary_cloud_name
CLOUDINARY_CLOUD_NAME=soko
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_FOLDER=soko
DATABASE_URL=your_neon_database_url
```

## 5. Connect The URLs

After both deploys:

1. In Vercel, set `NEXT_PUBLIC_API_URL` to the Render API URL.
2. In Render, set `CORS_ORIGINS` and `FRONTEND_URL` to the Vercel URL.
3. Redeploy both services.

## Local Check

From the repo:

```powershell
cd frontend/web
npm.cmd run type-check
npm.cmd run build

cd ../../backend/api-gateway
npm.cmd run build
```
