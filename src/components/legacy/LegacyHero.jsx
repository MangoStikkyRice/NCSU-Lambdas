import './LegacyHero.scss'
import HeroIMG from '../../assets/images/lo.png'
import Hero from '../../assets/images/LegacyHero.png'
import ScrollDown from '../../assets/images/scrolldown.png'
import { easeIn, motion } from 'framer-motion'

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
        x: "-340%",
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
            ease: [0.7, 0, .8, 0]
        }
    }
}

function LegacyHero() {
    return (
        <div className="legacy-hero">
            <div className='legacy-hero-wrapper'>
                <motion.div className="textContainer" variants={textVariants} initial="initial" animate="animate">
                    <motion.h2 variants={textVariants}>Legacy</motion.h2>
                    <motion.h1 variants={textVariants}>History & Constitution</motion.h1>
                    <motion.div variants={textVariants} className="buttons">
                        <motion.button variants={textVariants}>News</motion.button>
                        <motion.button variants={textVariants}>Contact</motion.button>
                    </motion.div>
                    <motion.img variants={textVariants} animate="scrollButton" src={ScrollDown} alt="" />
                </motion.div>
            </div>
            <motion.div className='slidingTextContainer' variants={sliderVariants} initial="initial" animate="animate">
                Lambda Phi Epsilon
            </motion.div>
            <motion.div className="imageContainer" variants={imageVariants} initial="initial" animate="animate">
                <img src={Hero} alt="" />
            </motion.div>
        </div>
    )
}

export default LegacyHero;