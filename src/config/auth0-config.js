// Auth0 Configuration
// You'll need to create a free Auth0 account and update these values
// Visit https://auth0.com to create your account

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id-here'
};

// Instructions:
// 1. Go to https://auth0.com and create a free account
// 2. Create a new "Single Page Application"
// 3. In the settings, add your domain to:
//    - Allowed Callback URLs: http://localhost:5173, https://your-domain.com
//    - Allowed Logout URLs: http://localhost:5173, https://your-domain.com  
//    - Allowed Web Origins: http://localhost:5173, https://your-domain.com
// 4. Create a .env file in the project root with:
//    VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
//    VITE_AUTH0_CLIENT_ID=your-client-id-here
