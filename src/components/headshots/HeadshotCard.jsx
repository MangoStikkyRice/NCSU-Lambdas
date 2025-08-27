import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import "./HeadshotCard.scss";

const HeadshotCard = ({
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
}) => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [currentCasualImageIndex, setCurrentCasualImageIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  // ============================================
  // REFS
  // ============================================
  const cardRef = useRef(null);
  const lineNameContainerRef = useRef(null);
  const lineNameTimeline = useRef(null);
  const positionDisplayRef = useRef(null);
  const popupRef = useRef(null);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  const bigBrother = getBig(person);
  const littles = getLittles(person);
  const isCardSelected = isSelected(person.id);
  
  // Get casual images array (filtered for existing images)
  const casualImages = ['casual_image1', 'casual_image2', 'casual_image3']
    .map(key => person[key])
    .filter(img => img);
  
  const currentCasualImage = casualImages[currentCasualImageIndex] || '/path/to/default/image.png';
  const hasCasualImages = casualImages.length > 0;

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  // Format date to season (Spring/Fall + Year)
  const formatSeason = (dateString) => {
    if (!dateString) return "Unknown";
    
    const [month, year] = dateString.split(" ");
    const springMonths = ["January", "February", "March", "April", "May", "June"];
    const fallMonths = ["July", "August", "September", "October", "November", "December"];
    
    if (springMonths.includes(month)) return `Spring ${year}`;
    if (fallMonths.includes(month)) return `Fall ${year}`;
    return dateString;
  };

  // Get latest position from positions array
  const getLatestPosition = () => {
    if (!person.positions || person.positions.length === 0) return null;
    
    return person.positions.sort((a, b) => {
      const dateA = new Date(`${a.start_month} ${a.start_year}`);
      const dateB = new Date(`${b.start_month} ${b.start_year}`);
      return dateB - dateA;
    })[0];
  };

  // Format display name (First L. format)
  const formatDisplayName = (name) => {
    if (!name) return '';
    return name.includes(' ')
      ? `${name.split(' ')[0]} ${name.split(' ')[1][0]}.`
      : name;
  };

  // ============================================
  // LINE NAME SCROLL ANIMATION
  // ============================================
  const startLineNameScroll = () => {
    const el = lineNameContainerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;

    if (!lineNameTimeline.current) {
      lineNameTimeline.current = gsap.timeline({
        delay: 1,
        repeat: -1,
        repeatDelay: 1,
        yoyo: true,
        ease: "linear",
      });
      lineNameTimeline.current.to(el, {
        scrollLeft: el.scrollWidth - el.clientWidth,
        duration: 3,
      });
    } else {
      lineNameTimeline.current.play();
    }
  };

  const resetLineNameScroll = () => {
    if (lineNameTimeline.current) {
      lineNameTimeline.current.kill();
      lineNameTimeline.current = null;
    }
    const el = lineNameContainerRef.current;
    if (el) {
      gsap.set(el, { scrollLeft: 0 });
    }
  };

  // ============================================
  // POPUP POSITION MANAGEMENT
  // ============================================
  const adjustPopupPosition = () => {
    const popup = popupRef.current;
    const card = cardRef.current;
    if (!popup || !card) return;

    const cardRect = card.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();

    // Remove existing classes
    popup.classList.remove('popup-left', 'popup-right');

    // Check positioning logic
    if (window.innerWidth - cardRect.right < 550 && cardRect.left > 550) {
      popup.classList.add('popup-left');
      return;
    }

    // Overflow handling
    const isOverflowingRight = cardRect.right + popupRect.width > window.innerWidth;
    const isOverflowingLeft = cardRect.left - popupRect.width < 0;
    
    if (isOverflowingRight) {
      popup.classList.add('popup-left');
    } else if (isOverflowingLeft) {
      popup.classList.add('popup-right');
    } else {
      popup.classList.add('popup-right'); // default
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  // Image carousel navigation
  const handlePrevCasualImage = () => {
    setCurrentCasualImageIndex(prev => 
      (prev - 1 + casualImages.length) % casualImages.length
    );
  };

  const handleNextCasualImage = () => {
    setCurrentCasualImageIndex(prev => 
      (prev + 1) % casualImages.length
    );
  };

  // Mouse interactions for 3D effect
  const handleMouseMove = (e) => {
    if (!isCardSelected) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const deadzone = 0.4 * Math.min(cardWidth, cardHeight) / 2;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < deadzone) {
      gsap.to(card, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power2.out",
      });
    } else {
      const rotateX = (deltaY / centerY) * -10;
      const rotateY = (deltaX / centerX) * 10;

      gsap.to(card, {
        duration: 0.3,
        rotateX: rotateX,
        rotateY: rotateY,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isCardSelected) return;
    
    gsap.to(cardRef.current, {
      duration: 0.5,
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
    });
  };

  const handleCardMouseEnter = () => {
    setHovered(true);
    startLineNameScroll();
  };

  const handleCardMouseLeave = () => {
    setHovered(false);
    if (!isCardSelected) {
      resetLineNameScroll();
    }
  };

  const handleCardClick = () => {
    handleHeadshotClick(person.id);
    startLineNameScroll();
  };

  // ============================================
  // EFFECTS
  // ============================================
  
  // 3D rotation reset when selection changes
  useEffect(() => {
    const card = cardRef.current;
    gsap.to(card, {
      duration: 0.5,
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
    });
  }, [isCardSelected]);

  // Auto-rotate casual images when selected
  useEffect(() => {
    if (!isCardSelected || !hasCasualImages) return;
    
    const interval = setInterval(handleNextCasualImage, 5000);
    return () => clearInterval(interval);
  }, [isCardSelected, hasCasualImages]);

  // Position display animation
  useEffect(() => {
    const positionDisplay = positionDisplayRef.current;
    gsap.killTweensOf(positionDisplay);

    if (hovered || isCardSelected) {
      gsap.to(positionDisplay, {
        duration: 1,
        y: '-140%',
        scale: 1.4,
        opacity: 1,
        ease: 'expo',
      });
    } else {
      gsap.to(positionDisplay, {
        duration: 0.5,
        y: '0%',
        scale: 1,
        opacity: 0,
        ease: 'expo',
      });
    }
  }, [hovered, isCardSelected]);

  // Popup position adjustments
  useEffect(() => {
    adjustPopupPosition();
    window.addEventListener('resize', adjustPopupPosition);
    return () => window.removeEventListener('resize', adjustPopupPosition);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(adjustPopupPosition, 50);
    return () => clearTimeout(timeoutId);
  }, [hobbyFilter, isCardSelected]);

  useEffect(() => {
    const timeoutId = setTimeout(adjustPopupPosition, 100);
    return () => clearTimeout(timeoutId);
  }, [index]);

  // ============================================
  // RENDER HELPERS
  // ============================================
  const latestPosition = getLatestPosition();

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      className={`headshot-card ${isCardSelected ? 'selected' : ''}`}
      ref={(el) => assignRef(person.id, el)}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      onClick={handleCardClick}
    >
      {/* Deselect instruction */}
      {isCardSelected && (
        <div className="deselect-instruction">
          Click again to defocus
        </div>
      )}

      {/* Position Display */}
      {latestPosition && (
        <div className="position-display" ref={positionDisplayRef}>
          <p>{latestPosition.title}</p>
        </div>
      )}

      {/* Popup Content */}
      <div className='popup' ref={popupRef}>
        {/* Casual Images Carousel */}
        <div className="popup-casual-carousel">
          {hasCasualImages && (
            <>
              <button
                className="carousel-button prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevCasualImage();
                }}
                aria-label={`Previous casual image for ${person.name}`}
              >
                &#10094;
              </button>
              
              <AnimatePresence mode='wait'>
                <motion.img
                  key={currentCasualImageIndex}
                  src={currentCasualImage}
                  alt={`${person.name} Casual ${currentCasualImageIndex + 1}`}
                  className="popup-casual-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              
              <button
                className="carousel-button next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextCasualImage();
                }}
                aria-label={`Next casual image for ${person.name}`}
              >
                &#10095;
              </button>
            </>
          )}
        </div>

        {/* Fixed Header */}
        <div className="popup-header">
          <h4>
            <span className="NUM">{person.id}</span>
            <span className="line-name-container" ref={lineNameContainerRef}>
              <span className="line-name">'{person.line_name}'</span>
            </span>
          </h4>
        </div>

        {/* Dynamic Content */}
        <div className="popup-info">
          {/* Big Brother */}
          {(bigBrother || person.bigExternalName) && (
            <div className="related-brothers big-brother">
              {bigBrother ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick(person.bigId);
                  }}
                  className="related-link"
                >
                  {formatDisplayName(bigBrother.name)}'s Little
                </button>
              ) : (
                <button
                  className="related-link"
                  onClick={(e) => e.stopPropagation()}
                  disabled
                  style={{ opacity: 0.9, cursor: 'default' }}
                >
                  {person.bigExternalName}'s Little
                </button>
              )}
            </div>
          )}

          {/* Little Brothers */}
          {littles.length > 0 && (
            <div className="related-brothers littles">
              <h5>Big brother of:</h5>
              <ul>
                {littles.map(little => (
                  <li key={little.id}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLinkClick(little.id);
                      }}
                      className="related-link-littles"
                    >
                      {formatDisplayName(little.name)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Major */}
          <p>
            {person.status === 'Alumni' ? 'Studied ' : 'Studies '}
            {person.major}
          </p>

          {/* Hobbies */}
          {person.hobbies?.length > 0 && (
            <div className="hobbies-section">
              <h5>Hobbies:</h5>
              <div className="hobbies-container">
                {person.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className={`hobby-bubble ${hobbyFilter === hobby ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHobbyFilter(hobby === hobbyFilter ? null : hobby);
                    }}
                    aria-label={`Filter by hobby: ${hobby}`}
                    role="button"
                    tabIndex="0"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setHobbyFilter(hobby === hobbyFilter ? null : hobby);
                      }
                    }}
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <p className='status'>
            Status: <b>{person.status}</b>
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div
        className="card-content"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="image-container">
          <img 
            src={person.image || '/path/to/default/image.png'} 
            alt={person.name} 
          />
        </div>
        <div className="text-container">
          <h3>{person.name}</h3>
          <p>{person.class_field}</p>
        </div>
      </div>
    </div>
  );
};

export default HeadshotCard;