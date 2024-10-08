import { motion } from 'framer-motion'

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
    // Array of items with `name` and `link` fields
    const items = [
        { name: "Home", link: "/" },
        { name: "Recruitment", link: "/recruitment" },
        { name: "Legacy", link: "/legacy" },
        { name: "Brothers", link: "/brothers" },
        { name: "Media", link: "/media" }
    ];

    return (
        <motion.div className='links' variants={variants}>
            {items.map((item) => (
                <motion.a
                    href={item.link} // Use the link from the object
                    key={item.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {item.name} {/* Display the name from the object */}
                </motion.a>
            ))}
        </motion.div>
    );
}

export default Links;