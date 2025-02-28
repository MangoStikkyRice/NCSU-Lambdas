import React, { useEffect, useRef, useState } from 'react';
import './Media.scss';
import NavBarNew from '../components/navbar/NavBarNew';
import WebGLBackgroung from './WebGLBackgroung'; // Adjust the path as needed

// Gallery Photos: At least 3 members
import all1 from '../assets/images/LEG.jpg';
import all2 from '../assets/images/VISION.jpg';
import all3 from '../assets/images/tarunsalian4.jpg';

// Gallery Photos: Singles, duos, and trios
import tye1 from '../assets/images/tyerojanasoonthan4.jpg';
import jordan1 from '../assets/images/CORE_VALUES.jpg';
import brody1 from '../assets/images/brodyzhao2.jpg';
import dom1 from '../assets/images/domrivero3.jpg';
import charles1 from '../assets/images/charlesvillazor4.jpg';
import dylan1 from '../assets/images/dylanmurray3.jpg';

// YouTube Videos Data
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
  // Refs for video row and photo gallery
  const scrollRowRef = useRef(null);
  const photoGalleryRef = useRef(null);

  // State for the lightbox overlay (photo gallery)
  const [selectedImage, setSelectedImage] = useState(null);

  // State to control animation trigger
  const [animate, setAnimate] = useState(false);

  // Setup image arrays
  const imageUrls = [
    all1,
    all2,
    all3,
    tye1,
    jordan1,
    brody1,
    dom1,
    charles1,
    dylan1,
  ];
  // Repeat images to create an "infinite" effect
  const repeatedImages = [...imageUrls, ...imageUrls, ...imageUrls];

  // Identify the "latest" reveal for the hero section
  const latestVideo = youtubeVideos[youtubeVideos.length - 1];
  const otherVideos = youtubeVideos.slice(0, youtubeVideos.length - 1);

  // Helper to get higher-res thumbnail when available
  const getHighResThumbnail = (thumbnailUrl) => {
    if (thumbnailUrl.includes('hqdefault')) {
      return thumbnailUrl.replace('hqdefault', 'maxresdefault');
    }
    return thumbnailUrl;
  };

  // Scroll amount for arrow navigation
  const scrollAmount = 300;

  // Arrow click handlers for video row carousel
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

  // Arrow click handlers for photo gallery carousel
  const handleGalleryLeftClick = () => {
    if (photoGalleryRef.current) {
      photoGalleryRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  const handleGalleryRightClick = () => {
    if (photoGalleryRef.current) {
      photoGalleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Throttle function to limit how often a function is called
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

  // Convert vertical scroll into horizontal scrolling for both carousels
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (scrollRowRef.current) {
        scrollRowRef.current.scrollLeft += e.deltaY;
      }
      if (photoGalleryRef.current) {
        photoGalleryRef.current.scrollLeft += e.deltaY;
      }
    };

    const throttledWheel = throttle(handleWheel, 50);

    if (scrollRowRef.current) {
      scrollRowRef.current.addEventListener('wheel', throttledWheel, { passive: false });
    }
    if (photoGalleryRef.current) {
      photoGalleryRef.current.addEventListener('wheel', throttledWheel, { passive: false });
    }

    return () => {
      if (scrollRowRef.current) {
        scrollRowRef.current.removeEventListener('wheel', throttledWheel);
      }
      if (photoGalleryRef.current) {
        photoGalleryRef.current.removeEventListener('wheel', throttledWheel);
      }
    };
  }, []);

  // Trigger CSS fade-in animations after mount
  useEffect(() => {
    // Slight delay to ensure all elements are mounted before animating
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const [showWebGL, setShowWebGL] = useState(false);
  const [fadeWebGL, setFadeWebGL] = useState(false);

  useEffect(() => {
    // Delay render by 1000ms
    const timer = setTimeout(() => {
      setShowWebGL(true);
      // Give a short delay so the element mounts before fading in
      setTimeout(() => {
        setFadeWebGL(true);
      }, 50);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  // Check window width to determine if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine the style based on screen size
  const heroBackgroundStyle = {
    backgroundImage: isMobile
      ? `
          radial-gradient(circle at left center, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.53) 70%, rgba(0, 212, 255, 0) 80%), 
          url(${getHighResThumbnail(latestVideo.thumbnail)})`
      : `
          radial-gradient(circle at left center, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.53) 50%, rgba(0, 212, 255, 0) 70%), 
          url(${getHighResThumbnail(latestVideo.thumbnail)})`,
    backgroundSize: 'cover',
    backgroundPosition: isMobile ? 'center' : 'top',
    backgroundRepeat: 'no-repeat',
  };
  
  return (
    <div className="media-page">
      {/* Other content goes here */}
      {showWebGL && (
        <div className={`webgl-container ${fadeWebGL ? 'fade' : ''}`}>
          <WebGLBackgroung />
        </div>
      )}
      <NavBarNew />

      {/* HERO Section with separate background element */}
      <div className={`hero ${animate ? 'animate' : ''}`}>
        <div
          className="hero-background"
          style={heroBackgroundStyle}
        ></div>
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

      {/* Video Carousel */}
      <div className="video-row-title">
        <h2>Previous Reveal Videos</h2>
        <div className="carousel-container">
          <div className="arrow left-arrow" onClick={handleVideoLeftClick}>
            &#10094;
          </div>
          <div className="video-row" ref={scrollRowRef}>
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

      {/* Photo Gallery Carousel */}
      <div className="gallery-wrapper">
        <h2>Behind the Scenes</h2>
        <div className="carousel-container">
          <div className="arrow left-arrow" onClick={handleGalleryLeftClick}>
            &#10094;
          </div>
          <div className="infinite-gallery" ref={photoGalleryRef}>
            {repeatedImages.map((url, index) => (
              <div
                className={`image-card-media ${animate ? 'animate' : ''}`}
                key={index}
                onClick={() => setSelectedImage(url)}
              >
                <img src={url} alt={`Gallery ${index}`} />
              </div>
            ))}
          </div>
          <div className="arrow right-arrow" onClick={handleGalleryRightClick}>
            &#10095;
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div className="overlay" onClick={() => setSelectedImage(null)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged" />
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 NC State Lambda Phi Epsilon. All rights reserved.</p>
          <p>
            Designed, Built, Tested by Jordan <strong>'InterstellHer'</strong> Miller.
          </p>
          <nav className="footer-nav">
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Media;
