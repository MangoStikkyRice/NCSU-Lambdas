import React from 'react';
import { motion } from 'framer-motion';

const YearOverlay = ({ yearData, onClose }) => {
    if (!yearData) return null;

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
                    <img 
                        src={yearData.image} 
                        alt={`Class of ${yearData.year}`}
                        className="yearbook-image"
                    />
                </div>
                
                <div className="year-overlay-info">
                    <p><strong>Class:</strong> {yearData.class}</p>
                    <p><strong>Members:</strong> {yearData.members}</p>
                    {yearData.description && (
                        <p><strong>Description:</strong> {yearData.description}</p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default YearOverlay; 