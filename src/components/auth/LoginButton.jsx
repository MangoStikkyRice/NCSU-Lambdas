import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';

const itemVariants = {
    open: {
        y: 0,
        opacity: 1
    },
    closed: {
        y: 50,
        opacity: 0
    }
};

const LoginButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <motion.div 
        className="loading-text"
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Loading...
      </motion.div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <motion.a
          href="/management"
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Management Panel
        </motion.a>
        
        <motion.button
          onClick={() => logout({ 
            logoutParams: { returnTo: window.location.origin } 
          })}
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="logout-button"
        >
          Logout
        </motion.button>
      </>
    );
  }

  return (
    <motion.button
      onClick={() => loginWithRedirect()}
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="login-button"
    >
      Member Login
    </motion.button>
  );
};

export default LoginButton;
