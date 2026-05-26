# Deployment Guide

This project is split into two deployable apps:

- `frontend_new`: Vite React frontend
- `backend_new`: Node/Express API

## Recommended Hosting

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Backend on Render

Create a new Render Web Service and connect this repository, or create a Render Blueprint from `render.yaml`.

Use these settings:

```txt
Root Directory: backend_new
Runtime: Node
Build Command: npm ci
Start Command: npm start
```

If using the blueprint, Render reads these settings from `render.yaml`; you only need to provide the secret environment values.

Add these environment variables in Render:

```txt
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=https://your-frontend-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
ACCESS_TOKEN_SECRET=long_random_secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=different_long_random_secret
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=ISO Audit System <noreply@example.com>
```

After deployment, your API base URL will look like:

```txt
https://your-backend-domain.onrender.com/api/v1
```

## Frontend on Vercel

Create a new Vercel project and connect this repository.

Use these settings:

```txt
Root Directory: frontend_new
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Add this environment variable in Vercel:

```txt
VITE_API_URL=https://your-backend-domain.onrender.com/api/v1
```

## Important Production Notes

- Update Render `CORS_ORIGIN` and `FRONTEND_URL` after Vercel gives you the final frontend URL.
- Redeploy the backend after changing `CORS_ORIGIN` or `FRONTEND_URL`.
- The frontend includes `vercel.json` so direct routes like `/login` and `/forms/:id` work after refresh.
- Production cookies require HTTPS. Vercel and Render both provide HTTPS domains by default.
