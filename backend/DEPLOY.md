# Deploying Backend to Render

## Prerequisites
- Your code is on GitHub (✓ You have this)
- Render account (free at https://render.com)
- All environment variables ready

## Step-by-Step Deployment

### 1. Prepare Your GitHub Repository
Make sure your `.env` file is NOT committed (it should be in `.gitignore`):

```bash
# Check your .gitignore includes:
# .env
# .env.local
```

Push the `.env.example` file and all code to GitHub.

### 2. Create a Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Grant Render permission to access your repositories

### 3. Create a New Web Service on Render
1. Click **"New +"** → **"Web Service"**
2. Select your NextHire repository from GitHub
3. Configure the service:
   - **Name**: `NextHire-Backend` (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main (or your deployment branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 4. Add Environment Variables
In Render dashboard for your service:

1. Go to **Environment** tab
2. Add each variable from your `.env.example`:
   - `PORT` = 5000 (Render assigns this, but keep for reference)
   - `NODE_ENV` = production
   - `MONGO_URI` = mongodb+srv://mishraaman4512_db_user:Aman%404512@cluster0.pkigabl.mongodb.net/?appName=Cluster0
   - `JWT_SECRET` = (use a strong random key, e.g., from: https://www.uuidgenerator.net/)
   - `CLIENT_URL` = https://yourdomain.com (or your frontend Render URL)
   - `CLOUDINARY_CLOUD_NAME` = your_value
   - `CLOUDINARY_API_KEY` = your_value
   - `CLOUDINARY_API_SECRET` = your_value

### 5. Deploy
1. Click **"Deploy"**
2. Monitor logs in Render dashboard
3. Once deployment succeeds, you'll get a public URL like: `https://nexthire-backend.onrender.com`

## Important Notes

### Handling the PORT Variable
- Render assigns a dynamic port via the `PORT` environment variable
- Your `server.js` already handles this: `process.env.PORT || 5000`
- ✓ No changes needed

### Database Connection Issues
- Make sure your MongoDB Atlas allows connections from Render's IP ranges
- If using IP whitelist, add `0.0.0.0/0` (allow all) in MongoDB Atlas → Network Access
- Better: Use username/password authentication (which you are)

### First Deployment
- Takes 2-5 minutes
- Watch the logs for any connection errors
- Check MongoDB connectivity first before debugging other issues

### CORS Configuration
- Update `CLIENT_URL` in environment variables to match your frontend domain
- Ensure your frontend CORS requests match the backend domain

## Troubleshooting

### Service won't start
1. Check **Logs** tab in Render
2. Verify all required environment variables are set
3. Check MongoDB URI is correct and allows connections

### CORS errors in frontend
1. Update `CLIENT_URL` environment variable
2. Check your CORS middleware in `src/app.js`

### Database connection timeout
1. Check MongoDB network access settings
2. Verify MONGO_URI is correct
3. Test connection locally first

## After Deployment

### Update Frontend API URL
In your frontend, update API calls to use the Render backend URL:
- Development: `http://localhost:5000`
- Production: `https://nexthire-backend.onrender.com`

### Auto-deploy on Git Push
Render automatically redeploys when you push to your main branch (you can change this in settings).

### Free Plan Limitations
- Services spin down after 15 min of inactivity (cold start = slow first request)
- Upgrade to paid plan for always-on service

## Your Backend URL After Deployment
Once deployed, your API will be available at:
```
https://nexthire-backend.onrender.com
```

Update this in your frontend's API configuration files.
