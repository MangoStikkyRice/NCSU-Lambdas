import './LegacyHero.scss'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Hero from '../../assets/images/LegacyHero.png'
import ScrollDown from '../../assets/images/scrolldown.png'
import { motion } from 'framer-motion'

const textVariants = {
    initial: {
        x: -500,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 1,
            staggerChildren: 0.1
        }
    },
    scrollButton: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 0.75,
            repeat: Infinity,
            repeatType:"reverse"
        }
    }
}

const sliderVariants = {
    initial: {
        x: 0
    },
    animate: {
        x: "-380%",
        transition: {
            repeat: Infinity,
            repeatType:"mirror",
            duration: 10
        }
    }
}

const imageVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 100,
        transition: {
            duration: 1,
            delay: 1,
        }
    }
}

function LegacyHero() {
    const navigate = useNavigate(); // Initialize navigate

    const handleButtonClick = (path) => {
        navigate(path);
    }
    return (
        <div id="top" className="legacy-hero">
            <div className='legacy-hero-wrapper'>
                <motion.div className="textContainer" variants={textVariants} initial="initial" animate="animate">
                    <motion.h2 variants={textVariants}>Legacy</motion.h2>
                    <motion.h1 variants={textVariants}>History & Constitution</motion.h1>
                    <motion.div variants={textVariants} className="buttons">
                        <motion.a 
                            variants={textVariants} 
                            href={`#Services`}
                            aria-label="Jump to Constitution"
                        >
                            Jump to Constitution
                        </motion.a>
                        <motion.a
                            variants={textVariants} 
                            href={`https://lambdaphiepsilon.com/giving-tuesday-2023/`}
                            target="_blank" rel="noopener noreferrer"
                            aria-label="International News"
                        >
                            International News
                        </motion.a>
                    </motion.div>
                    <motion.img 
                        variants={textVariants} 
                        animate="scrollButton" 
                        src={ScrollDown} 
                        alt="Scroll Down Indicator" 
                    />
                </motion.div>
            </div>
            <motion.div className='slidingTextContainer' variants={sliderVariants} initial="initial" animate="animate">
                Lambdas
            </motion.div>
            <motion.div className="imageContainer" variants={imageVariants} initial="initial" animate="animate">
                <img src={Hero} alt="Hero" />
            </motion.div>
        </div>
    )
}

export default LegacyHero;