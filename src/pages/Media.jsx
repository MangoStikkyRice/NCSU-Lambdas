import React, { useEffect, useRef, useState } from 'react';
import './Media.scss';
import NavBarNew from '../components/navbar/NavBarNew';
import Footer from '../components/Footer';

// Behind-the-scenes gallery removed per request

// YouTube video data
const youtubeVideos = [
    {
        title: 'Charter Conquest',
        url: 'https://youtu.be/RUQTrrlLkx8',
        thumbnail: 'https://i.ytimg.com/vi/RUQTrrlLkx8/hqdefault.jpg',
        semester: 'Fall',
        year: 2016,
    },
    {
        title: 'Alpha Ascension',
        url: 'https://youtu.be/9zngWsr6LE4',
        thumbnail: 'https://i.ytimg.com/vi/9zngWsr6LE4/hqdefault.jpg',
        semester: 'Spring',
        year: 2017,
    },
    {
        title: 'Beta Battalion',
        url: 'https://youtu.be/DGXhEBjH81E',
        thumbnail: 'https://i.ytimg.com/vi/DGXhEBjH81E/hqdefault.jpg',
        semester: 'Fall',
        year: 2017,
    },
    {
        title: 'Gamma Guardians',
        url: 'https://youtu.be/OrSyEHm372o',
        thumbnail: 'https://i.ytimg.com/vi/OrSyEHm372o/hqdefault.jpg',
        semester: 'Spring',
        year: 2018,
    },
    {
        title: 'Delta Dimension',
        url: 'https://youtu.be/Wx1MEwTpfEo',
        thumbnail: 'https://i.ytimg.com/vi/Wx1MEwTpfEo/hqdefault.jpg',
        semester: 'Fall',
        year: 2018,
    },
    {
        title: 'Epsilon Eclipse',
        url: 'https://youtu.be/SBTsNR2__e4',
        thumbnail: 'https://i.ytimg.com/vi/SBTsNR2__e4/hqdefault.jpg',
        semester: 'Spring',
        year: 2019,
    },
    {
        title: 'Zeta Zaibatsu',
        url: 'https://youtu.be/VAUJxBy--yc',
        thumbnail: 'https://i.ytimg.com/vi/VAUJxBy--yc/hqdefault.jpg',
        semester: 'Fall',
        year: 2019,
    },
    {
        title: 'Iota Immortals',
        url: 'https://www.youtube.com/watch?v=TBdsb6LB-tg',
        thumbnail: 'https://i.ytimg.com/vi/TBdsb6LB-tg/hqdefault.jpg',
        semester: 'Spring',
        year: 2020,
    },
    {
        title: 'Mu Monarchs',
        url: 'https://youtu.be/ttDvgZ6D9NE',
        thumbnail: 'https://i.ytimg.com/vi/ttDvgZ6D9NE/hqdefault.jpg',
        semester: 'Fall',
        year: 2020,
    },
    {
        title: 'Nu Nen',
        url: 'https://youtu.be/VAHC-5UoZPY',
        thumbnail: 'https://i.ytimg.com/vi/VAHC-5UoZPY/hqdefault.jpg',
        semester: 'Spring',
        year: 2021,
    },
    {
        title: 'Xi Xin',
        url: 'https://youtu.be/6cm_sYJfTB8',
        thumbnail: 'https://i.ytimg.com/vi/6cm_sYJfTB8/hqdefault.jpg',
        semester: 'Fall',
        year: 2021,
    },
];

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
            ? `radial-gradient(circle at left center, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.53) 70%, rgba(0, 212, 255, 0) 80%), url(${getHighResThumbnail(latestVideo.thumbnail)})`
            : `radial-gradient(circle at left center, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.53) 50%, rgba(0, 212, 255, 0) 70%), url(${getHighResThumbnail(latestVideo.thumbnail)})`,
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
                            Centennial Campus sets the stage. The wait is over. Months of work, loyalty, and brotherhood come down to this. No frills, no filters—just the reveal.
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
