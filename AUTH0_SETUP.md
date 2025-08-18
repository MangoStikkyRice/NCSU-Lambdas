# 🔐 Auth0 Setup Guide for NCSU Lambda Members

## Quick Setup (5 minutes)

### 1. Create Free Auth0 Account
1. Visit [auth0.com](https://auth0.com)
2. Click "Sign Up" 
3. Choose "Personal" (completely free)
4. Verify your email

### 2. Create Application
1. In Auth0 Dashboard, click **"Applications"**
2. Click **"Create Application"**
3. Name: `NCSU Lambda Management`
4. Choose **"Single Page Web Applications"**
5. Click **"Create"**

### 3. Configure Settings
In your new application's **Settings** tab:

**Application URIs:**
- **Allowed Callback URLs**: `http://localhost:5173, https://your-domain.netlify.app`
- **Allowed Logout URLs**: `http://localhost:5173, https://your-domain.netlify.app`
- **Allowed Web Origins**: `http://localhost:5173, https://your-domain.netlify.app`

### 4. Get Your Credentials
Copy these from the **Settings** tab:
- **Domain** (e.g., `dev-xyz123.us.auth0.com`)
- **Client ID** (e.g., `abc123xyz...`)

### 5. Add to Your Project
Create `.env` file in project root:
```env
VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here
```

### 6. Add Authorized Users
1. Go to **User Management > Users**
2. Click **"Create User"**
3. Add emails for your 5 authorized members
4. Or use **Social Connections** (Google, GitHub, etc.)

## 🎉 That's it!

- **Hamburger Menu**: Now shows "🔐 Member Login"
- **After Login**: Shows "📊 Management Panel" + user info
- **Management Page**: Protected - only logged-in users can access
- **Free Tier**: 7,000 active users/month (way more than you need!)

## Troubleshooting
- **Login not working?** Check your callback URLs include your exact domain
- **Management page redirects?** Make sure you're logged in first
- **Need help?** Auth0 has great docs at [auth0.com/docs](https://auth0.com/docs)

## Features Added
✅ Secure authentication with Auth0  
✅ Protected management panel  
✅ Login/logout in hamburger menu  
✅ User info display  
✅ Automatic redirects  
✅ Mobile responsive  
✅ Loading states  
✅ 100% free (no credit card required)
