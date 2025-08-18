import React, { useEffect, useRef, useState } from 'react';
import './Media.scss';
import NavBarNew from '../components/navbar/NavBarNew';
import Footer from '../components/Footer';
import { youtubeVideos } from '../data/mediaCarouselData';

// Behind-the-scenes gallery removed per request

// YouTube video data imported from separate file

const Media = () => {
    // Refs and state
    const scrollRowRef = useRef(null);
    const [animate, setAnimate] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Behind-the-scenes gallery removed

    // Video data
    const latestVideo = youtubeVideos[youtubeVideos.length - 1];
    const otherVideos = youtubeVideos.slice(0, youtubeVideos.length - 1);

    // Helper functions
    const getHighResThumbnail = (thumbnailUrl) => {
        if (thumbnailUrl.includes('hqdefault')) {
            return thumbnailUrl.replace('hqdefault', 'maxresdefault');
        }
        return thumbnailUrl;
    };

    const scrollAmount = 300;

    // Throttle function for scroll events (must be defined before use)
    const throttle = (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    };

    // Carousel navigation handlers
    const handleVideoLeftClick = () => {
        if (scrollRowRef.current) {
            scrollRowRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const handleVideoRightClick = () => {
        if (scrollRowRef.current) {
            scrollRowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Only scroll the carousel when wheel events occur over the carousel itself
    const handleVideoWheel = throttle((e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = scrollRowRef.current;
        if (!el) return;
        el.scrollLeft += e.deltaY;
        // Clamp to bounds to prevent over-scroll and snap-back
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft < 0) el.scrollLeft = 0;
        if (el.scrollLeft > maxScrollLeft) el.scrollLeft = maxScrollLeft;
    }, 50);


    // Behind-the-scenes gallery controls removed

    // Wheel-to-horizontal scroll handled inline on the carousel element

    // Trigger animations after mount
    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // No edge tracking required; spacing is constant to avoid snapping

    // Note: Space/WebGL background intentionally removed per design update.

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Hero background style based on screen size
    const heroBackgroundStyle = {
        backgroundImage: isMobile
            ? `radial-gradient(circle at left center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 212, 255, 0) 80%), url(${getHighResThumbnail(latestVideo.thumbnail)})`
            : `radial-gradient(circle at left center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 212, 255, 0) 70%), url(${getHighResThumbnail(latestVideo.thumbnail)})`,
        backgroundSize: 'cover',
        backgroundPosition: isMobile ? 'center' : 'top',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div className="media-page">
            <NavBarNew />

            {/* Hero section with latest video */}
            <div className={`hero ${animate ? 'animate' : ''}`}>
                <div className="hero-background" style={heroBackgroundStyle}></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">{latestVideo.title} Class Reveal</h1>
                        <p className="hero-description">
                            Centennial Campus sets the stage. The wait is over. Months of work, loyalty, and brotherhood come down to this. No frills, no filters. Just the reveal.
                        </p>
                    </div>
                    <button
                        className="watch-now-button"
                        onClick={() => window.open(latestVideo.url, '_blank')}
                    >
                        Watch Now
                    </button>
                </div>
            </div>

            {/* Video carousel section */}
            <div className="video-row-title">
                <h2>Previous Reveal Videos</h2>
                <div className="carousel-container">
                    <div className="arrow left-arrow" onClick={handleVideoLeftClick}>
                        &#10094;
                    </div>
                    <div className="video-row" ref={scrollRowRef} onWheel={handleVideoWheel}>
                        {otherVideos.map((video, index) => (
                            <div key={index} className={`video-card ${animate ? 'animate' : ''}`}>
                                <img src={video.thumbnail} alt={video.title} />
                                <div className="video-card-title">{video.title}</div>
                            </div>
                        ))}
                    </div>
                    <div className="arrow right-arrow" onClick={handleVideoRightClick}>
                        &#10095;
                    </div>
                </div>
            </div>

            {/* Behind-the-scenes gallery removed */}

            {/* Footer component */}
            <Footer />
        </div>
    );
};

export default Media;
