import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Info.scss';
import MISSION from './../../assets/images/MISSION.jpg';
import NATIONAL_HISTORY from './../../assets/images/Crest.png';
import THE_VISION from './../../assets/images/VISION.jpg';
import CORE_VALUES from './../../assets/images/CORE_VALUES.jpg';

// Array of background images to cycle through
const backgroundImages = [NATIONAL_HISTORY, MISSION, THE_VISION, CORE_VALUES];

// Button and Content Data
const infoData = [
    {
        id: 1,
        title: 'National History',
        description: `Lambda Phi Epsilon was founded on February 25, 1981 by a group of nineteen dedicated men led by principal founder Mr. Craig Ishigo...`,
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

function Info() {
    const [activeId, setActiveId] = useState(infoData[0].id);
    const activeInfo = infoData.find((item) => item.id === activeId);

    // State for background image index
    const [bgIndex, setBgIndex] = useState(0);
    const bgLength = backgroundImages.length;

    // Cycle background images every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % bgLength);
        }, 6000);

        return () => clearInterval(interval);
    }, [bgLength]);

    return (
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
                            {item.title}
                        </motion.button>
                    ))}
                </motion.nav>

                {/* Main Content */}
                <main className="info-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeInfo.id}
                            className="info-details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2>{activeInfo.title}</h2>
                            <p>{activeInfo.description}</p>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default Info;
