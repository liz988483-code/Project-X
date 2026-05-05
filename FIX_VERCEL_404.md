# 🔧 Fix Vercel 404 Error - Step by Step

The 404 means Vercel needs to be reconfigured. Follow these EXACT steps:

---

## ❌ If Vercel Project Already Exists (soko-mauve.vercel.app taken)

### Option 1: Redeploy Existing Project

1. Go to: https://vercel.com/dashboard
2. Find your **soko-mauve** project (or soko project)
3. Click on it → Go to **Settings** → **General**
4. Scroll to **Environment Variables**
5. Delete any old variables
6. Add EXACTLY these (one by one):
   ```
   NEXT_PUBLIC_API_URL = https://soko-api-gateway.onrender.com
   NEXT_PUBLIC_SITE_URL = https://soko-mauve.vercel.app
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = ddqd3gvuf
   NEXT_PUBLIC_CLOUDINARY_URL = https://res.cloudinary.com/ddqd3gvuf
   ```
7. Go to **Deployments** tab
8. Click the three dots ⋯ on the latest deployment
9. Click **Redeploy**
10. Wait 3-5 minutes ⏳

### Option 2: Delete & Recreate Project

1. Go to: https://vercel.com/dashboard
2. Find your project
3. Click **Settings** → scroll to bottom
4. Click **Delete Project** (red button)
5. Confirm deletion
6. Follow "Create New Project" instructions below

---

## ✅ If Creating New Vercel Project

### Step 1: Connect GitHub
1. Go to: https://vercel.com/new
2. Click **Continue with GitHub** (or **GitHub** button)
3. Authorize Vercel to access GitHub
4. Search for your repository name
5. Click **Import**

### Step 2: Configure Project
1. **Project Name**: Keep as default or use `soko-mauve`
2. **Framework Preset**: Select **Next.js**
3. **Root Directory**: Click **Edit** and set to: `frontend/web`
4. Click **Continue**

### Step 3: Environment Variables (CRITICAL)
1. Under "Environment Variables" section, add:
   
   **Variable 1:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://soko-api-gateway.onrender.com`
   - Click **Add**
   
   **Variable 2:**
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://soko-mauve.vercel.app`
   - Click **Add**
   
   **Variable 3:**
   - Name: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - Value: `ddqd3gvuf`
   - Click **Add**
   
   **Variable 4:**
   - Name: `NEXT_PUBLIC_CLOUDINARY_URL`
   - Value: `https://res.cloudinary.com/ddqd3gvuf`
   - Click **Add**

### Step 4: Deploy
1. Click the big **Deploy** button
2. Wait for build to complete (3-5 minutes) ⏳
3. You should see "Congratulations! Your project has been successfully deployed"

### Step 5: Test
1. Click **Visit** or go to: https://soko-mauve.vercel.app
2. Should load without 404 error ✅

---

## 🧪 If Still Getting 404 After Deploy

Check these:

1. **Verify Build Succeeded:**
   - Vercel Dashboard → **Deployments**
   - Click latest deployment
   - Look for **"READY"** status (not "ERROR")
   - Check **Build Logs** if there are errors

2. **Check Environment Variables:**
   - Dashboard → **Settings** → **Environment Variables**
   - Verify all 4 variables are there
   - Click redeploy button

3. **Clear Browser Cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows)
   - Or open in Incognito window

4. **Check if Root Page Exists:**
   - Try: `https://soko-mauve.vercel.app/login`
   - Try: `https://soko-mauve.vercel.app/products`
   - If these work, root page might have specific issue

---

## 📊 Troubleshooting

| Error | Solution |
|-------|----------|
| 404 on all pages | Check build logs for errors, verify environment variables |
| 500 Internal Error | Backend API not responding, check Render deployment |
| Build Failed | Check node_modules, run `npm install` locally first |
| Can't see project | Wrong GitHub account connected, disconnect & reconnect |

---

## ✅ After Vercel is Live

Your deployment chain will be:
```
User → Vercel Frontend (soko-mauve.vercel.app)
   ↓
   → Render API Gateway (soko-api-gateway.onrender.com)
   ↓
   → Neon Database (PostgreSQL)
   ↓
   → Cloudinary (Images)
```

All components ready! 🚀
