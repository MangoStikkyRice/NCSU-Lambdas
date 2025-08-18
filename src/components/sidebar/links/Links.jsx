import { motion } from 'framer-motion'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'


const variants = {
    open: {
        transition: {
            staggerChildren: 0.1
        }
    },

    closed: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
}

const itemVariants = {
    open: {
        y: 0,
        opacity: 1
    },

    closed: {
        y: 50,
        opacity: 0
    }
}
function Links() {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    
    // Array of items with `name`, `link`, and optional `imgSrc` fields
    const items = [
        { name: "Home", link: "/" },
        { name: "Recruitment", link: "/recruitment" },
        { name: "Legacy", link: "/legacy" },
        { name: "Brothers", link: "/brothers" },
        { name: "Media", link: "/media" },
    ];

    // Add auth items to the list
    if (isAuthenticated) {
        items.push({ name: "Management Panel", link: "/management" }); // No action - just a regular link
        items.push({ name: "Logout", link: "#", action: "logout" });
    } else {
        items.push({ name: "Member Login", link: "#", action: "login" });
    }

    const handleClick = (item, e) => {
        if (item.action === "login") {
            e.preventDefault();
            loginWithRedirect();
        } else if (item.action === "logout") {
            e.preventDefault();
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    };

    return (
        <motion.div className='links' variants={variants}>
            {items.map((item) => {
                // Use Link for internal routes, motion.a for external or action items
                if (item.action) {
                    return (
                        <motion.a
                            key={item.name}
                            href={item.link}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleClick(item, e)}
                        >
                            {item.name}
                        </motion.a>
                    );
                } else {
                    return (
                        <motion.div
                            key={item.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to={item.link} className="sidebar-link">
                                {item.imgSrc ? (
                                    <motion.img 
                                        src="/assets/images/LambdaLink.png"  
                                        alt={item.name} 
                                        style={{ width: '50px', height: '50px' }}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }} 
                                    />
                                ) : (
                                    item.name
                                )}
                            </Link>
                        </motion.div>
                    );
                }
            })}
            
            {/* User email - bottom right corner */}
            {isAuthenticated && user && (
                <motion.div 
                    className="user-email"
                    variants={itemVariants}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {user.email}
                </motion.div>
            )}
        </motion.div>
    );
}

export default Links;