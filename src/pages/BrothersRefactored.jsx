import React, { useState, useEffect, useRef } from 'react';
import './Brothers.scss';
import NavBarNew from './../components/navbar/NavBarNew';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PositionsOverlay from './../components/PositionsOverlay';
import { motion, AnimatePresence } from 'framer-motion';

// Import organized components and utilities
import BrotherCard from '../components/brothers/BrotherCard';
import YearOverlay from '../components/brothers/YearOverlay';
import { useBrothers } from '../hooks/useBrothers';
import { getTitle, getBig, getLittles, adjustPopupPosition } from '../utils/brotherUtils';
import { YEARBOOK_DATA } from '../constants/yearbookData';

gsap.registerPlugin(ScrollTrigger);

const BrothersRefactored = () => {
    // Use custom hook for brothers data
    const { brothers, loading, error, refetch } = useBrothers();
    
    // State management
    const [selectedBrotherId, setSelectedBrotherId] = useState(null);
    const [overlayData, setOverlayData] = useState(null);
    const [showYearbooks, setShowYearbooks] = useState(false);
    const [yearOverlayData, setYearOverlayData] = useState(null);
    const [hobbyFilter, setHobbyFilter] = useState(null);

    // Refs
    const headshotRefs = useRef({});

    // GSAP animations
    useEffect(() => {
        const cards = document.querySelectorAll('.headshot-card');
        
        gsap.fromTo(cards, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.1,
                ease: "power2.out"
            }
        );

        return () => {
            gsap.killTweensOf(cards);
        };
    }, [brothers]);

    // Event handlers
    const openOverlay = (positions, name, imageUrl) => {
        setOverlayData({ positions, name, imageUrl });
    };

    const closeOverlay = () => {
        setOverlayData(null);
    };

    const handleLinkClick = (targetId) => {
        if (selectedBrotherId === targetId) {
            setSelectedBrotherId(null);
        } else {
            setSelectedBrotherId(targetId);
        }
    };

    const assignRef = (id, element) => {
        headshotRefs.current[id] = element;
    };

    const isSelected = (id) => selectedBrotherId === id;

    const handleHeadshotClick = (id) => {
        if (selectedBrotherId === id) {
            setSelectedBrotherId(null);
        } else {
            setSelectedBrotherId(id);
        }
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedBrotherId && !event.target.closest('.headshot-card')) {
                setSelectedBrotherId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedBrotherId]);

    // Yearbook handlers
    const openYearOverlay = (entry) => {
        setYearOverlayData(entry);
    };

    const closeYearOverlay = () => {
        setYearOverlayData(null);
    };

    const toggleYearbooks = () => {
        setShowYearbooks(!showYearbooks);
    };

    // Filter brothers based on hobby
    const filteredBrothers = hobbyFilter 
        ? brothers.filter(brother => 
            brother.hobbies && brother.hobbies.includes(hobbyFilter)
          )
        : brothers;

    // Loading state
    if (loading) {
        return (
            <div className="brothers-page">
                <NavBarNew />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading brothers...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="brothers-page">
                <NavBarNew />
                <div className="error-container">
                    <h2>Error loading brothers</h2>
                    <p>{error}</p>
                    <button onClick={refetch}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="brothers-page">
            <NavBarNew />
            
            <div className="brothers-content">
                <div className="brothers-header">
                    <h1>Brothers</h1>
                    <p className="current-semester">{getTitle()}</p>
                </div>

                {/* Yearbooks Section */}
                <div className="yearbooks-section">
                    <button 
                        className="yearbooks-toggle"
                        onClick={toggleYearbooks}
                    >
                        {showYearbooks ? 'Hide' : 'Show'} Yearbooks
                    </button>
                    
                    {showYearbooks && (
                        <motion.div 
                            className="yearbooks-grid"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {YEARBOOK_DATA.map((entry, index) => (
                                <motion.div
                                    key={entry.year}
                                    className="yearbook-entry"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => openYearOverlay(entry)}
                                >
                                    <img 
                                        src={entry.image} 
                                        alt={`Class of ${entry.year}`}
                                        className="yearbook-thumbnail"
                                    />
                                    <div className="yearbook-info">
                                        <h3>{entry.year}</h3>
                                        <p>{entry.class}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Brothers Grid */}
                <div className="brothers-grid">
                    {filteredBrothers.map((person, index) => (
                        <BrotherCard
                            key={person.id}
                            person={person}
                            index={index}
                            isSelected={isSelected(person.id)}
                            handleHeadshotClick={handleHeadshotClick}
                            assignRef={assignRef}
                            handleLinkClick={handleLinkClick}
                            getBig={getBig(brothers)}
                            getLittles={getLittles(brothers)}
                            hobbyFilter={hobbyFilter}
                            setHobbyFilter={setHobbyFilter}
                            openOverlay={openOverlay}
                        />
                    ))}
                </div>

                {/* Hobby Filter Display */}
                {hobbyFilter && (
                    <div className="hobby-filter-display">
                        <span>Filtering by: {hobbyFilter}</span>
                        <button onClick={() => setHobbyFilter(null)}>
                            Clear Filter
                        </button>
                    </div>
                )}
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {overlayData && (
                    <PositionsOverlay
                        positions={overlayData.positions}
                        name={overlayData.name}
                        imageUrl={overlayData.imageUrl}
                        onClose={closeOverlay}
                    />
                )}
                
                {yearOverlayData && (
                    <YearOverlay
                        yearData={yearOverlayData}
                        onClose={closeYearOverlay}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BrothersRefactored; 