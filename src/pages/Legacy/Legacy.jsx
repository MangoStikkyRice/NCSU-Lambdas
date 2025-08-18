import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Legacy.scss';
import NavBarNew from '../../components/navbar/NavBarNew';

// Import images
import Hero from '../../assets/images/LegacyHero.png';
import ScrollDown from '../../assets/images/scrolldown.png';
import EVANCHEN from '../../assets/images/EVANCHEN.png';
import GRACEYANG from '../../assets/images/GRACEYANG.png';
import BTM from '../../assets/images/BTM.png';
import logo from '../../assets/images/lo.png';
import MISSION from '../../assets/images/MISSION.jpg';
import NATIONAL_HISTORY from '../../assets/images/Crest.png';
import THE_VISION from '../../assets/images/VISION.jpg';
import CORE_VALUES from '../../assets/images/CORE_VALUES.jpg';
import constitution from '../../assets/images/constitution.jpg';

// Animation variants
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
            repeatType: "reverse"
        }
    }
};

const sliderVariants = {
    initial: {
        x: 0
    },
    animate: {
        x: "-380%",
        transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 10
        }
    }
};

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
};

// Philanthropy data
const philanthropyItems = [
    {
        id: 1,
        title: "Honoring Evan Chen",
        img: EVANCHEN,
        desc: "In 1995, Evan Chen, a member of Theta Chapter at Stanford University, was diagnosed with leukemia. Their chapter, along with Evan's friends, organized a joint effort to find a bone marrow donor. What resulted was the largest bone marrow typing drive in the history of the NMDP and Asian American Donor Program (AADP). In a matter of days, over two thousand people were typed. A match was eventually found for Evan, but unfortunately by that time the disease had taken its toll on him and he passed away in 1996. In Evan's memory, the national philanthropy for Lambda Phi Epsilon was established and the fraternity has been working with the organization from that point forward.",
        buttonText: "Explore",
        buttonLink: "https://www.nmdp.org/",
        buttonLogo: logo
    },
    {
        id: 2,
        title: "Be The Match",
        img: GRACEYANG,
        desc: "Lambda Phi Epsilon works with the National Marrow Donor Program to save the lives of patients requiring bone marrow transplants. Additionally, the fraternity promotes awareness for leukemia and other blood disorders. Individuals who suffer from these types of illnesses depend on donors with similar ethnic backgrounds to find compatible bone marrow matches. Thus, the fraternity aims to register as many committed donors to the cause through local #NMDP campaigns to increase the chances for patients to find a life-saving donor.",
        buttonText: "The Donation Process",
        buttonLink: "https://www.mskcc.org/news/stem-cell-bone-marrow-donation-process"
    },
    {
        id: 3,
        title: "International Commitment",
        img: BTM,
        desc: "Every Lambda Phi Epsilon chapter works with the AADP, Asians for Miracle Marrow Matches, and the Cammy Lee Leukemia Foundation to hold bone marrow typing drives on their campuses to encourage Asians and other minorities to register as committed bone marrow/stem cell donors. Since the fraternity's inception, Lambda Phi Epsilon has educated thousands of donors to commit to saving the life of a patient in need.",
        buttonText: "Join the Registry!",
        buttonLink: "https://my.bethematch.org/s/join"
    },
];

// Info data
const infoData = [
    {
        id: 1,
        title: 'National History',
        description: `Lambda Phi Epsilon was founded on February 25, 1981 by a group of nineteen dedicated men led by principal founder Mr. Craig Ishigo. Hoping to transcend the traditional boundaries of national origins, the founders aimed to create an organization that would set new standards of excellence within the Asian American community, develop leaders within each of the member's respective community, and bridge the gaps between those communities. While the initial charter was comprised of Asian Pacific Americans, the brotherhood was open to all who were interested in supporting these goals. Mr. Craig Ishigo and Mr. Darryl L. Mu signed the charter as President and Vice President, respectively.\n\nOn May 28th, 1990, the fraternity, now with six chapters total, convened on the campus of the University of California, Irvine for the first annual National Convention, which to this day has been held regularly over Memorial Day weekend. A national governing body was established to oversee the development of individual chapters and the fraternity as a whole, with Mr. Robert Mimaki, Mr. Eric Naritomi, and Mr. Doug Nishida appointed as National President, Northern Governor and Southern Governor, respectively. On September 8th, 1990, Lambda Phi Epsilon reached another milestone and became the first and only nationally recognized Asian American interest fraternity in the United States with the admission to the National Interfraternity Conference. In 2006, Lambda Phi Epsilon joined the National Asian Pacific Islander American Panhellenic Association to increase collaboration and partnership between fellow APIA Greek organizations.\n\nToday, Lambda Phi Epsilon is widely renown as the preeminent international Asian interest fraternal organization, providing outstanding leadership, philanthropy, and advocacy in the community.`,
    },
    {
        id: 2,
        title: 'Our Mission',
        description: 'To guide men on a lifelong discovery of authenticity and personal growth.',
    },
    {
        id: 3,
        title: 'The Vision',
        description: 'A world where lambda men live fulfilling lives and contribute through the pursuit of their noble purpose.',
    },
    {
        id: 4,
        title: 'Core Values',
        description: 'Authenticity, Courageous Leadership, Cultural Heritage, Love, and Wisdom.',
    },
];

// Background images for info section
const backgroundImages = [NATIONAL_HISTORY, MISSION, THE_VISION, CORE_VALUES];

// Animation variants for philanthropy
const philanthropyVariants = {
    collapsed: { height: '4.4em', overflow: 'hidden' },
    expanded: { height: 'auto' }
};

function Legacy() {
    const navigate = useNavigate();
    
    // Philanthropy state
    const [expandedId, setExpandedId] = useState(null);
    
    // Info state
    const [activeId, setActiveId] = useState(infoData[0].id);
    const [bgIndex, setBgIndex] = useState(0);
    const bgLength = backgroundImages.length;

    // Cycle background images every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % bgLength);
        }, 6000);

        return () => clearInterval(interval);
    }, [bgLength]);

    const handleButtonClick = (path) => {
        navigate(path);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const activeInfo = infoData.find((item) => item.id === activeId);

    return (
        <div className="legacy-page">
            <NavBarNew />
            
            {/* Hero section */}
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

            {/* Contact information section */}
            <section id="Contact">
                <div className="info-title">
                    <h1>History</h1>
                    <div
                        className="info-container"
                        style={{
                            backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImages[bgIndex]})`,
                        }}
                    >
                        {/* Overlay for better text readability */}
                        <div className="overlay"></div>

                        {/* Content Wrapper */}
                        <div className="content-wrapper">
                            {/* Sidebar: Buttons */}
                            <motion.nav
                                className="buttons-column"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {infoData.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        className={`info-button ${activeId === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveId(item.id)}
                                        whileHover={{ scale: 1.05, backgroundColor: '#fff' }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-pressed={activeId === item.id}
                                    >
                                        <h4>{item.title}</h4>
                                    </motion.button>
                                ))}
                            </motion.nav>

                            {/* Main Content */}
                            <main className="info-content">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeInfo.id}
                                        className="info-details"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <h2>{activeInfo.title}</h2>
                                        <p>{activeInfo.description}</p>
                                    </motion.div>
                                </AnimatePresence>
                            </main>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philanthropy activities section */}
            <section id="Philanthropy">
                <div className="philanthropy">
                    <h1>National Philanthropy</h1>
                    <div className="phil-wrapper">
                        {philanthropyItems.map(item => {
                            const shortText = item.desc.slice(0, 150);
                            const isExpanded = expandedId === item.id;

                            return (
                                <div className="phil-card" key={item.id}>
                                    <div className="imageContainer">
                                        <img src={item.img} alt={item.title} />
                                    </div>
                                    <div className="textContainer">
                                        <h2>{item.title}</h2>
                                        <motion.div
                                            animate={isExpanded ? "expanded" : "collapsed"}
                                            variants={philanthropyVariants}
                                            className="desc"
                                        >
                                            <p>
                                                {isExpanded ? item.desc : shortText + '...'}
                                            </p>
                                        </motion.div>
                                        <div className="readMoreContainer">
                                            <button onClick={() => toggleExpand(item.id)}>
                                                {isExpanded ? 'Collapse' : 'Read More'}
                                            </button>
                                        </div>
                                        <a 
                                            href={item.buttonLink} 
                                            className="cta-button"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.buttonText}
                                            {item.buttonLogo && (
                                                <img 
                                                    src={item.buttonLogo} 
                                                    alt="Button Logo" 
                                                    className="button-logo" 
                                                />
                                            )}
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Constitution and bylaws section */}
            <section id="Constitution">
                <div className="Constitution-page">
                    <h1>Constitution</h1>
                    <div className="Constitution-body">
                        <img src={constitution} alt="Constitution" />
                        <a
                            href="https://docs.google.com/document/d/1KuqyxZ0QIB6uYrvdcCjWJc6YRqvPtH1Wz8CC9uPjn4c/edit?usp=drive_link"
                            className="Constitution-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Constitution
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Legacy;
