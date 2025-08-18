import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const BrotherCard = ({
    person,
    index,
    isSelected,
    handleHeadshotClick,
    assignRef,
    handleLinkClick,
    getBig,
    getLittles,
    hobbyFilter,
    setHobbyFilter,
    openOverlay,
}) => {
    const [currentCasualImageIndex, setCurrentCasualImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    const casualImages = [
        person.casual_image1_url,
        person.casual_image2_url,
        person.casual_image3_url
    ].filter(Boolean);

    const startLineNameScroll = () => {
        const nameElement = document.getElementById(`line-name-${person.id}`);
        if (nameElement && nameElement.scrollWidth > nameElement.clientWidth) {
            nameElement.style.animation = 'scrollText 3s linear infinite';
        }
    };

    const resetLineNameScroll = () => {
        const nameElement = document.getElementById(`line-name-${person.id}`);
        if (nameElement) {
            nameElement.style.animation = 'none';
            nameElement.scrollLeft = 0;
        }
    };

    const handlePrevCasualImage = () => {
        setCurrentCasualImageIndex(prev => 
            prev === 0 ? casualImages.length - 1 : prev - 1
        );
    };

    const handleNextCasualImage = () => {
        setCurrentCasualImageIndex(prev => 
            prev === casualImages.length - 1 ? 0 : prev + 1
        );
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setShowPopup(false);
        resetLineNameScroll();
    };

    const handleCardMouseEnter = () => {
        setIsHovered(true);
        startLineNameScroll();
    };

    const handleCardMouseLeave = () => {
        setIsHovered(false);
        resetLineNameScroll();
    };

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    const handleImageError = () => {
        setIsImageLoaded(true); // Set to true even on error to show fallback
    };

    const getDisplayImage = () => {
        if (casualImages.length > 0 && isHovered) {
            return casualImages[currentCasualImageIndex];
        }
        return person.image_url || person.image;
    };

    const getBigBrother = getBig(person);
    const getLittleBrothers = getLittles(person);

    return (
        <motion.div
            ref={(el) => assignRef(person.id, el)}
            className={`headshot-card ${isSelected ? 'selected' : ''}`}
            onClick={() => handleHeadshotClick(person.id)}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="headshot-container">
                <div 
                    className="headshot-image-container"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        src={getDisplayImage()}
                        alt={person.name}
                        className={`headshot-image ${isImageLoaded ? 'loaded' : ''}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                    
                    {casualImages.length > 1 && isHovered && (
                        <div className="casual-image-controls">
                            <button 
                                className="casual-nav-btn prev"
                                onClick={handlePrevCasualImage}
                            >
                                ‹
                            </button>
                            <button 
                                className="casual-nav-btn next"
                                onClick={handleNextCasualImage}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>

                <div className="headshot-info">
                    <h3 className="brother-name">{person.name}</h3>
                    <div 
                        id={`line-name-${person.id}`}
                        className="line-name"
                        onMouseEnter={startLineNameScroll}
                        onMouseLeave={resetLineNameScroll}
                    >
                        {person.line_name}
                    </div>
                    <p className="brother-major">{person.major}</p>
                    
                    {person.hobbies && person.hobbies.length > 0 && (
                        <div className="hobbies-container">
                            {person.hobbies.map((hobby, idx) => (
                                <span 
                                    key={idx}
                                    className={`hobby-tag ${hobbyFilter === hobby ? 'active' : ''}`}
                                    onClick={() => setHobbyFilter(hobbyFilter === hobby ? null : hobby)}
                                >
                                    {hobby}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isSelected && (
                <motion.div 
                    className="brother-popup"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                        left: popupPosition.x,
                        top: popupPosition.y
                    }}
                >
                    <div className="popup-content">
                        <h4>{person.name}</h4>
                        <p><strong>Line Name:</strong> {person.line_name}</p>
                        <p><strong>Major:</strong> {person.major}</p>
                        <p><strong>Status:</strong> {person.status}</p>
                        
                        {getBigBrother && (
                            <div className="family-info">
                                <p><strong>Big:</strong> 
                                    <span 
                                        className="family-link"
                                        onClick={() => handleLinkClick(getBigBrother.id)}
                                    >
                                        {getBigBrother.name}
                                    </span>
                                </p>
                            </div>
                        )}
                        
                        {getLittleBrothers.length > 0 && (
                            <div className="family-info">
                                <p><strong>Littles:</strong></p>
                                <ul>
                                    {getLittleBrothers.map(little => (
                                        <li key={little.id}>
                                            <span 
                                                className="family-link"
                                                onClick={() => handleLinkClick(little.id)}
                                            >
                                                {little.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {person.positions && person.positions.length > 0 && (
                            <div className="positions-info">
                                <p><strong>Positions:</strong></p>
                                <button 
                                    className="view-positions-btn"
                                    onClick={() => openOverlay(person.positions, person.name, person.image_url)}
                                >
                                    View Positions
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default BrotherCard; 