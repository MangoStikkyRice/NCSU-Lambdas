// PositionsOverlay.jsx

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import './PositionsOverlay.scss';

// Helper function remains unchanged
const formatSeason = (month, year) => {
    const springMonths = ["January", "February", "March", "April", "May", "June"];
    const fallMonths = ["July", "August", "September", "October", "November", "December"];
    
    if (springMonths.includes(month)) {
        return `Spring ${year}`;
    } else if (fallMonths.includes(month)) {
        return `Fall ${year}`;
    }
    return `${month} ${year}`;  // Default fallback
};

const PositionsOverlay = ({ name, positions, imageUrl, onClose }) => {
    const overlayRef = useRef(null);
    const timelineLineRef = useRef(null);
    const positionRefs = useRef([]);
    const [expandedIndex, setExpandedIndex] = useState(null);

    // Clear refs on re-render
    positionRefs.current = [];

    const addToRefs = (el) => {
        if (el && !positionRefs.current.includes(el)) {
            positionRefs.current.push(el);
        }
    };

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        tl.fromTo(overlayRef.current, { opacity: 0, y: '-100%' }, { opacity: 1, y: '0%', duration: 0.5 });
        tl.fromTo(timelineLineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1 }, '-=0.3');
        tl.fromTo(positionRefs.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 }, '-=0.8');

        return () => tl.kill();
    }, [positions]);

    const handleHoverIn = (el) => {
        const content = el.querySelector('.content-wrapper');
        gsap.to(content, { scale: 1.05, duration: 0.3, ease: 'power2.out', transformOrigin: 'left center'});
    };

    const handleHoverOut = (el) => {
        const content = el.querySelector('.content-wrapper');
        gsap.to(content, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const handlePositionClick = (index, ref) => {
        if (expandedIndex === index) {
            gsap.to(ref.querySelector('.description'), { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' });
            setExpandedIndex(null);
        } else {
            if (expandedIndex !== null) {
                const previousRef = positionRefs.current[expandedIndex];
                gsap.to(previousRef.querySelector('.description'), { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' });
            }
            const descriptionEl = ref.querySelector('.description');
            gsap.set(descriptionEl, { height: 'auto' });
            const targetHeight = descriptionEl.offsetHeight;
            gsap.fromTo(descriptionEl, { height: 0, opacity: 0 }, { height: targetHeight, opacity: 1, duration: 0.5, ease: 'power2.inOut' });
            setExpandedIndex(index);
        }
    };

    const handleClose = () => {
        const tl = gsap.timeline({
            onComplete: onClose
        });
        tl.to(overlayRef.current, { opacity: 0, y: '-100%', duration: 0.5, ease: 'power2.in' });
    };

    // Function to get the term and year from the position
    const getTermAndYear = (start_month, start_year) => {
        if (start_month && start_year) {
            return formatSeason(start_month, start_year);
        }
        return 'Unknown';  // Fallback for missing data
    };

    return createPortal(
        <div
            className="positions-overlay"
            ref={overlayRef}
            onClick={(e) => {
                if (e.target === overlayRef.current) {
                    handleClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="positions-overlay-title"
        >
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose} aria-label="Close Positions Overlay">
                    &times;
                </button>
                <h2 id="positions-overlay-title">{name}'s Career</h2> {/* Centered Title */}
                
                {/* Container for headshot and timeline */}
                <div className="positions-container">
                    {/* Headshot Image */}
                    {imageUrl && (
                        <div className="headshot">
                            <img
                                src={imageUrl}
                                alt={`${name} Headshot`}
                                loading="lazy"
                                onError={(e) => { e.target.src = '/path/to/default/image.png'; }} // Fallback image
                            />
                        </div>
                    )}
                    
                    {/* Timeline */}
                    <div className="positions-timeline">
                        <div className="timeline-line" ref={timelineLineRef}></div>
                        {positions.map((position, index) => (
                            <div
                                key={index}
                                className="position-item"
                                ref={(el) => addToRefs(el)}
                                onClick={() => handlePositionClick(index, positionRefs.current[index])}
                                onMouseEnter={() => handleHoverIn(positionRefs.current[index])}
                                onMouseLeave={() => handleHoverOut(positionRefs.current[index])}
                            >
                                    {/* Conditionally apply a class when the title is 'President' */}
    <div className={`timeline-dot ${position.title === 'President' ? 'president-dot' : ''}`}></div>
                                
                                <div className={`content-wrapper ${position.title === 'President' ? 'president-wrapper' : ''}`}>
                                    <h3>{position.title}</h3>
                                    <p className="year">{getTermAndYear(position.start_month, position.start_year)}</p>
                                    <div className="description">
                                        <p>{position.description}</p>
                                        {/* Example Button Inside Description */}
                                        {/* Ensure buttons within the description are styled properly */}
                                        {/* <button className="some-button">Action</button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PositionsOverlay;
