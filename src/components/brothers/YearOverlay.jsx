import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const YearOverlay = ({ yearData, onClose }) => {
    const [currentClassIndex, setCurrentClassIndex] = useState(0);
    
    if (!yearData) return null;

    const hasMultipleClasses = yearData.classes && yearData.classes.length > 1;
    const currentClass = yearData.classes && yearData.classes.length > 0 ? yearData.classes[currentClassIndex] : null;
    
    // Reset to first class when yearData changes
    useEffect(() => {
        setCurrentClassIndex(0);
    }, [yearData]);

    const nextClass = () => {
        if (hasMultipleClasses) {
            setCurrentClassIndex(prev => 
                prev < yearData.classes.length - 1 ? prev + 1 : 0
            );
        }
    };

    const prevClass = () => {
        if (hasMultipleClasses) {
            setCurrentClassIndex(prev => 
                prev > 0 ? prev - 1 : yearData.classes.length - 1
            );
        }
    };

    return (
        <motion.div 
            className="year-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div 
                className="year-overlay-content"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                
                <div className="year-overlay-header">
                    <h2>{yearData.year}</h2>
                    {hasMultipleClasses && (
                        <div className="class-navigation">
                            <button 
                                className="nav-arrow prev"
                                onClick={prevClass}
                                aria-label="Previous class"
                            >
                                ←
                            </button>
                            <span className="class-indicator">
                                {currentClassIndex + 1}/{yearData.classes.length}
                            </span>
                            <button 
                                className="nav-arrow next"
                                onClick={nextClass}
                                aria-label="Next class"
                            >
                                →
                            </button>
                        </div>
                    )}
                    {currentClass ? (
                        <img 
                            src={currentClass.image} 
                            alt={`${currentClass.className} class of ${yearData.year}`}
                            className="yearbook-image"
                        />
                    ) : yearData.image ? (
                        <img 
                            src={yearData.image} 
                            alt={`Class of ${yearData.year}`}
                            className="yearbook-image"
                        />
                    ) : null}
                </div>
                
                <div className="year-overlay-info">
                    {yearData.classes && yearData.classes.length > 0 ? (
                        <>
                            <p><strong>Class:</strong> {currentClass.className}</p>
                            <p><strong>PM:</strong> {currentClass.PM}</p>
                            <p><strong>PD:</strong> {currentClass.PD}</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Class:</strong> {yearData.class}</p>
                            <p><strong>Members:</strong> {yearData.members}</p>
                            {yearData.description && (
                                <p><strong>Description:</strong> {yearData.description}</p>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default YearOverlay; 