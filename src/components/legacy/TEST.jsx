import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Info.scss';
import MISSION from './../../assets/images/MISSION.jpg';
import NATIONAL_HISTORY from './../../assets/images/Crest.png';
import THE_VISION from './../../assets/images/VISION.jpg';

// Array of background images to cycle through
const backgroundImages = [MISSION, THE_VISION, NATIONAL_HISTORY];

// Button and Content Data (Removed backgroundImage)
const infoData = [
    {
        id: 1,
        title: 'National History',
        description:
            `Lambda Phi Epsilon was founded on February 25, 1981 by a group of nineteen dedicated men led by principal founder Mr. Craig Ishigo. Hoping to transcend the traditional boundaries of national origins, the founders aimed to create an organization that would set new standards of excellence within the Asian American community, develop leaders within each of the member’s respective community, and bridge the gaps between those communities. While the initial charter was comprised of Asian Pacific Americans, the brotherhood was open to all who were interested in supporting these goals. Mr. Craig Ishigo and Mr. Darryl L. Mu signed the charter as President and Vice President, respectively.

On May 28th, 1990, the fraternity, now with six chapters total, convened on the campus of the University of California, Irvine for the first annual National Convention, which to this day has been held regularly over Memorial Day weekend. A national governing body was established to oversee the development of individual chapters and the fraternity as a whole, with Mr. Robert Mimaki, Mr. Eric Naritomi, and Mr. Doug Nishida appointed as National President, Northern Governor and Southern Governor, respectively. On September 8th, 1990, Lambda Phi Epsilon reached another milestone and became the first and only nationally recognized Asian American interest fraternity in the United States with the admission to the National Interfraternity Conference. In 2006, Lambda Phi Epsilon joined the National Asian Pacific Islander American Panhellenic Association to increase collaboration and partnership between fellow APIA Greek organizations.

Today, Lambda Phi Epsilon is widely renown as the preeminent international Asian interest fraternal organization, providing outstanding leadership, philanthropy, and advocacy in the community.`,
    },
    {
        id: 2,
        title: 'Our Mission',
        description:
            'To guide men on a lifelong discovery of authenticity and personal growth.',
    },
    {
        id: 3,
        title: 'The Vision',
        description:
            'A world where lambda men live fulfilling lives and contribute through the pursuit of their noble purpose.',
    },
    {
        id: 4,
        title: 'Core Values',
        description:
            'Authenticity, Courageous Leadership, Cultural Heritage, Love, and Wisdom.',
    },
];

function Info() {
    const [activeId, setActiveId] = useState(infoData[0].id);
    const activeInfo = infoData.find((item) => item.id === activeId);

    // State for background image index
    const [bgIndex, setBgIndex] = useState(0);
    const bgLength = backgroundImages.length;

    // useEffect to cycle background images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % bgLength);
        }, 5000); // 5000ms = 5 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [bgLength]);

    return (
        <div className="info-container">
            {/* Background Layer */}
            <AnimatePresence>
                <motion.div
                    key={bgIndex}
                    className="background-layer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(5, 5, 5, 1), rgba(35, 35, 35, 0.7)), url(${backgroundImages[bgIndex]})`
                    }}
                />
            </AnimatePresence>

            {/* Left Column: Buttons */}
            <div className="buttons-column">
                {infoData.map((item) => (
                    <motion.button
                        key={item.id}
                        className={`info-button ${activeId === item.id ? 'active' : ''}`}
                        onClick={() => setActiveId(item.id)}
                        whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={activeId === item.id}
                    >
                        {item.title}
                    </motion.button>
                ))}
            </div>

            {/* Right Column: Info Display */}
            <div className="info-content">
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
            </div>
        </div>
    );
}

export default Info;
