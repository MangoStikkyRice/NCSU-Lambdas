import React, { useState, useEffect, useRef } from 'react';
import './Brothers.scss';
import NavBarNew from './../components/navbar/NavBarNew';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Positions overlay removed for demo; layout preserved without it
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { YEAR_GRID_DATA } from '../constants/yearGridData';
import YearOverlay from '../components/brothers/YearOverlay';

// We'll use static yearbook pics for now. Add to DB later.
import class2016BImage from '../backend/media/class/charters.png';
import class2017AImage from '../backend/media/class/alphas.jpg';
import class2017BImage from '../backend/media/class/betas.jpg';
import class2018AImage from '../backend/media/class/gammas.jpg';
import class2018BImage from '../backend/media/class/deltas.jpg';
import class2019AImage from '../backend/media/class/epsilon.jpg';
import class2019BImage from '../backend/media/class/zetas.jpg';
import class2020AImage from '../backend/media/class/etas.jpg';
import class2021AImage from '../backend/media/class/thetas.jpg';
import class2021BImage from '../backend/media/class/iotas.png';
import class2022AImage from '../backend/media/class/kappas.png';
import class2022BImage from '../backend/media/class/mus.png';
import class2023BImage from '../backend/media/class/nus.png';
import class2024AImage from '../backend/media/class/xis.png';
import class2024BImage from '../backend/media/class/omicrons.jpg';
import dataBrothers from '../data/brothers.json';

gsap.registerPlugin(ScrollTrigger);

const Brothers = () => {

    axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => {
            return retryCount * 2000; // Exponential backoff: 2s, 4s, 6s
        },
        retryCondition: (error) => {
            // Retry on most 5xx errors and network issues
            return error.response && error.response.status >= 500;
        },
    });

    // States to hold brothers data
    const [brothers, setBrothers] = useState([]);
    const [selectedBrotherId, setSelectedBrotherId] = useState(null);

    // Refs for each brother's headshot to enable scrolling
    const headshotRefs = useRef({});

    // Load brothers statically from bundled JSON
    useEffect(() => {
        setBrothers(Array.isArray(dataBrothers) ? dataBrothers : []);
    }, []);

    // Function to handle link clicks within popups
    const handleLinkClick = (targetId) => {
        if (selectedBrotherId === targetId) {

            // Deselect if the same brother is clicked again
            setSelectedBrotherId(null);
        } else {

            // Select the new brother
            setSelectedBrotherId(targetId);

            // Scroll to the target headshot
            headshotRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Function to assign refs to each headshot
    const assignRef = (id, element) => {
        headshotRefs.current[id] = element;
    };

    // Function to determine if a brother is selected
    const isSelected = (id) => selectedBrotherId === id;

    // Function to handle clicking on a headshot (to toggle selection)
    const handleHeadshotClick = (id) => {
        if (selectedBrotherId === id) {
            // Deselect if the same headshot is clicked again
            setSelectedBrotherId(null);
        } else {
            // Select the new headshot
            setSelectedBrotherId(id);
            // Scroll to the selected headshot
            headshotRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Extend click functionality to deselect headshots when clicking anywhere on the page
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.headshot-card')) {
                setSelectedBrotherId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Default filter values on page load
    const [filter, setFilter] = useState('all brothers');
    const [hobbyFilter, setHobbyFilter] = useState(null);

    // Filter brothers based on selected filter and hobby
    const filteredBrothers = (Array.isArray(brothers) ? brothers : []).filter(person => {

        // Status/Class Filter
        const statusMatch = filter === 'all brothers' ||
            (filter === 'Etas' && person.class_field === 'Eta Evolution') ||
            (filter === 'Thetas' && person.class_field === 'Theta Trinity') ||
            (filter === 'Iotas' && person.class_field === 'Iota Immortals') ||
            (filter === 'Kappas' && person.class_field === 'Kappa Kazoku') ||
            (filter === 'Mus' && person.class_field === 'Mu Monarchs') ||
            (filter === 'Nus' && person.class_field === 'Nu Nen') ||
            (filter === 'Xis' && person.class_field === 'Xi Xin') ||
            (person.status === filter);

        // Hobby Filter
        const hobbyMatch = !hobbyFilter || (person.hobbies && person.hobbies.includes(hobbyFilter));

        return statusMatch && hobbyMatch;
    });


    // Gets the title for the banner based on active filter
    const getTitle = () => {
        switch (filter) {
            case 'Actives':
                return 'Active House';
            case 'Alumni':
                return 'Alumni';
            case 'Associates':
                return 'Associate Members';
            case 'Etas':
                return 'Eta Evolution';
            case 'Thetas':
                return 'Theta Trinity';
            case 'Iotas':
                return 'Iota Immortals';
            case 'Kappas':
                return 'Kappa Kazoku';
            case 'Mus':
                return 'Mu Monarchs';
            case 'Nus':
                return 'Nu Nen';
            case 'Xis':
                return 'Xi Xin';
            default:
                return 'All Brothers';
        }
    };

    // Function to get a member by ID
    const getMemberById = (id) => brothers.find(member => member.id === id);

    // Function to get a member's big
    const getBig = (member) => {
        if (member.bigId) {
            return getMemberById(member.bigId);
        }
        return null;
    };

    // Function to get a member's littles
    const getLittles = (member) => {
        if (member.littleIds && member.littleIds.length > 0) {
            return brothers.filter(brother => member.littleIds.includes(brother.id));
        }
        return [];
    };

    const yearGridData = YEAR_GRID_DATA;

    // Track which year is selected for overlay
    const [selectedYearData, setSelectedYearData] = useState(null);

    const openYearOverlay = (entry) => {
        setSelectedYearData(entry);
    };

    const closeYearOverlay = () => {
        setSelectedYearData(null);
    };

    // -----------
    // NEW STATE & HANDLER: Toggle Yearbooks
    // -----------
    const [showYearbooks, setShowYearbooks] = useState(false);
    const toggleYearbooks = () => {
        setShowYearbooks((prev) => !prev);
        // Also reset any selected brother if yearbooks are shown
        setSelectedBrotherId(null);
    };


    // Set up the Brothers page
    return (

        // Container for the entire page, including the navbar.
        <div className="includeHeader">
            <meta name="theme-color" content="#203c79" />
            <NavBarNew />

            {/* Container for the entire page, excluding the navbar. */}
            <div className="brothers-page">
                <>

                    {/* Container for the title strip. */}
                    <div className="legacy-title-container1">
                        <div className="blue-strip1"></div>
                        {/* If showYearbooks is true, show "Yearbooks", otherwise standard getTitle() */}
                        <h2 className="legacy-title">
                            {showYearbooks ? 'Yearbooks' : getTitle()}
                        </h2>
                    </div>

                    {/* Filter container */}
                    <div className="filter-container">
                        {/** 
           * Hide the entire filter box when `showYearbooks` is true 
           */}
                        {!showYearbooks && (
                            <div className="filter-box">
                                <label htmlFor="roleFilter">Filter by:</label>
                                <select
                                    id="roleFilter"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all brothers">All</option>
                                    <option value="Actives">Actives</option>
                                    <option value="Alumni">Alumni</option>
                                    <option value="Associates">Associates</option>
                                    <option value="Etas">Etas</option>
                                    <option value="Thetas">Thetas</option>
                                    <option value="Iotas">Iotas</option>
                                    <option value="Kappas">Kappas</option>
                                    <option value="Mus">Mus</option>
                                    <option value="Nus">Nus</option>
                                    <option value="Xis">Xis</option>
                                </select>
                            </div>
                        )}

                        {/* Yearbooks toggle button (always visible) */}
                        <button
                            onClick={toggleYearbooks}
                            className="statistics-button"
                            style={{ marginLeft: '20px' }}
                        >
                            <p>{showYearbooks ? 'Show Members' : 'Show Yearbooks'}</p>
                        </button>
                    </div>

                    {/* Render statistics overlay
                    {showStatistics && <StatisticsOverlay onClose={closeStatistics} brothers={brothers} />} */}

                    {/* Strip that shows the active filter whenever a hobby is selected. */}
                    {(hobbyFilter) && (
                        <div className="active-filters">
                            {hobbyFilter && (
                                <div className="active-filter">
                                    <span>Showing {filter} interested in {hobbyFilter}</span>
                                    <button onClick={() => setHobbyFilter(null)}>Clear</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- CONDITIONAL RENDERING --- */}
                    {/* If we are NOT showing yearbooks, display the headshots */}
                    {!showYearbooks && (
                        <div className="color-box-headshots">
                            <div className="headshot-grid">
                                {filteredBrothers.map((person, index) => (
                                    <HeadshotCard
                                        key={person.id}
                                        person={person}
                                        index={index}
                                        isSelected={isSelected}
                                        handleHeadshotClick={handleHeadshotClick}
                                        assignRef={assignRef}
                                        handleLinkClick={handleLinkClick}
                                        getBig={getBig}
                                        getLittles={getLittles}
                                        hobbyFilter={hobbyFilter}
                                        setHobbyFilter={setHobbyFilter}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* If we are showing yearbooks, display just the yearbook grid */}
                    {showYearbooks && (
                        <div
                            className="color-box-headshots yearbook"
                        >
                            <div className="headshot-grid">
                                {yearGridData.map((entry, idx) => (
                                    <div
                                        key={idx}
                                        className="headshot-card year-card"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => openYearOverlay(entry)}
                                    >
                                        <div className="card-content">
                                            <div className="image-container">
                                                <div className="year-container">
                                                    <h1>{entry.year.split(/0(.*)/s)[1]}</h1>
                                                </div>
                                                <div className="class-count-container">
                                                    <p>
                                                        {entry.classes.length} Class
                                                        {entry.classes.length !== 1 && 'es'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Simple Overlay for Year/Class Info */}
                    <AnimatePresence>
                        {selectedYearData && (
                            <YearOverlay
                                yearData={selectedYearData}
                                onClose={closeYearOverlay}
                            />
                        )}
                    </AnimatePresence>

                </>


                {/* Container to make space for the footer. */}
                <Footer />
            </div>
        </div>
    );


};

// Setup headshot card attributes.
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

    // Ref for the container wrapping the line name
    const lineNameContainerRef = useRef(null);
    const lineNameTimeline = useRef(null);

    // GSAP animation: Scroll the line name into view if it overflows.
    const startLineNameScroll = () => {
        const el = lineNameContainerRef.current;
        if (!el) return;
        // Only animate if the text overflows
        if (el.scrollWidth <= el.clientWidth) return;

        // If no timeline exists yet, create one
        if (!lineNameTimeline.current) {
            lineNameTimeline.current = gsap.timeline({
                delay: 1,           // 1-second delay before the first scroll starts
                repeat: -1,
                repeatDelay: 1,     // 1-second delay at the end of each cycle (optional)
                yoyo: true,
                ease: "linear",
            });
            lineNameTimeline.current.to(el, {
                scrollLeft: el.scrollWidth - el.clientWidth,
                duration: 3,
            });
        } else {
            // If the timeline exists but is paused, resume it.
            lineNameTimeline.current.play();
        }
    };

    const resetLineNameScroll = () => {
        // Kill the timeline if it exists and reset the scroll position.
        if (lineNameTimeline.current) {
            lineNameTimeline.current.kill();
            lineNameTimeline.current = null;
        }
        const el = lineNameContainerRef.current;
        if (el) {
            gsap.set(el, { scrollLeft: 0 });
        }
    };

    // State to track current casual image index
    const [currentCasualImageIndex, setCurrentCasualImageIndex] = useState(0);

    // Reference to the card for 3D rotations.
    const cardRef = useRef(null);

    // Apply rotation only when selected
    useEffect(() => {
        const card = cardRef.current;
        if (isSelected(person.id)) {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0, // Ensure no initial rotation
                rotateY: 0,
                ease: "power2.out",
            });
        } else {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: "power2.out",
            });
        }
    }, [isSelected(person.id), person.id]);

    // Set up interval for image shuffling on selection
    useEffect(() => {
        let interval;
        if (isSelected(person.id)) {
            interval = setInterval(() => {
                handleNextCasualImage();
            }, 5000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isSelected(person.id), person.id]);

    // Functions to handle image navigation
    const handlePrevCasualImage = () => {
        setCurrentCasualImageIndex(prevIndex => {
            const casualImages = ['casual_image1', 'casual_image2', 'casual_image3']
                .map(key => person[key])
                .filter(img => img);
            const newIndex = (prevIndex - 1 + casualImages.length) % casualImages.length;
            return newIndex;
        });
    };

    const handleNextCasualImage = () => {
        setCurrentCasualImageIndex(prevIndex => {
            const casualImages = ['casual_image1', 'casual_image2', 'casual_image3']
                .map(key => person[key])
                .filter(img => img);
            const newIndex = (prevIndex + 1) % casualImages.length;
            return newIndex;
        });
    };

    // Get the current casual image.
    const currentCasualImage =
        ['casual_image1', 'casual_image2', 'casual_image3']
            .map(key => person[key])
            .filter(img => img)[currentCasualImageIndex] ||
        '/path/to/default/image.png';

    // Handles 3D rotations on the headshot only when selected.
    const handleMouseMove = (e) => {
        if (!isSelected(person.id)) return; // Do nothing if not selected

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

        const rotateX = (deltaY / centerY) * -10; // Adjust the multiplier for desired effect
        const rotateY = (deltaX / centerX) * 10;

        const deadzone = 0.4 * Math.min(cardWidth, cardHeight) / 2;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < deadzone) {
            // Within deadzone: Reset rotation
            gsap.to(card, {
                duration: 0.3,
                rotateX: 0,
                rotateY: 0,
                ease: "power2.out",
            });
            return;
        } else {


            // Apply the rotation to the card
            gsap.to(card, {
                duration: 0.3,
                rotateX: rotateX,
                rotateY: rotateY,
                ease: "power2.out",
            });
        }
    };

    // Handles resetting rotation when mouse leaves the card
    const handleMouseLeave = () => {
        if (!isSelected(person.id)) return; // Only reset if selected
        const card = cardRef.current;
        gsap.to(card, {
            duration: 0.5,
            rotateX: 0,
            rotateY: 0,
            ease: "power2.out",
        });
    };

    // Ref for the card content to apply tilt
    const cardContentRef = useRef(null);

    // Function to handle headshot hover (mouse enter)
    const handleCardMouseEnter = () => {
        setHovered(true);
        if (!isSelected(person.id)) {

            let fromX = -50;
            if (popupRef.current.classList.contains('popup-left')) {
                fromX = 50;
            }
        }
        startLineNameScroll();
    };

    // Function to handle headshot hover leave (mouse leave)
    const handleCardMouseLeave = () => {
        setHovered(false);
        if (!isSelected(person.id)) {
            resetLineNameScroll();
        }
    };



    // Get the big brother
    const bigBrother = getBig(person);

    // Get the littles
    const littles = getLittles(person);

    const { nationalities } = person;

    // State to track hover status
    const [hovered, setHovered] = useState(false);

    // Reference to the position display div
    const positionDisplayRef = useRef(null);

    // GSAP animation for position display when hovered or selected
    useEffect(() => {
        const positionDisplay = positionDisplayRef.current;
        gsap.killTweensOf(positionDisplay); // Kill any existing tweens

        if (hovered || isSelected(person.id)) {
            // Pop out with GSAP
            gsap.to(positionDisplay, {
                duration: 1,
                y: '-140%',
                scale: 1.4,
                opacity: 1,
                ease: 'expo',
            });
        } else {
            // Hide with GSAP
            gsap.to(positionDisplay, {
                duration: 0.5,
                y: '0%',
                scale: 1,
                opacity: 0,
                ease: 'expo',
            });
        }
    }, [hovered, isSelected(person.id)]);

    // Helper function to parse month and determine "Fall" or "Spring"
    const formatSeason = (dateString) => {
        if (!dateString) return "Unknown";  // Return a default value if date is missing

        // Extract the month and year from the string
        const [month, year] = dateString.split(" ");

        // Define months for "Spring" and "Fall"
        const springMonths = ["January", "February", "March", "April", "May", "June"];
        const fallMonths = ["July", "August", "September", "October", "November", "December"];

        // Determine if the month is part of Spring or Fall
        if (springMonths.includes(month)) {
            return `Spring ${year}`;
        } else if (fallMonths.includes(month)) {
            return `Fall ${year}`;
        }

        // Default return if month is invalid
        return dateString;
    };

    const popupRef = useRef(null); // Reference to the popup
    const adjustPopupPosition = () => {
        const popup = popupRef.current;
        const card = cardRef.current;
        if (!popup || !card) return;

        const cardRect = card.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        // Only force left if the card's right edge is close to the viewport's right edge 
        // AND the card is not near the left edge (i.e. not in the first column)
        if (window.innerWidth - cardRect.right < 550 && cardRect.left > 550) {
            popup.classList.remove('popup-right');
            popup.classList.add('popup-left');
            return;
        }

        // Existing logic for overflow handling:
        const isOverflowingRight = cardRect.right + popupRect.width > window.innerWidth;
        const isOverflowingLeft = cardRect.left - popupRect.width < 0;
        popup.classList.remove('popup-left', 'popup-right');
        if (isOverflowingRight) {
            popup.classList.add('popup-left');
        } else if (isOverflowingLeft) {
            popup.classList.add('popup-right');
        } else {
            popup.classList.add('popup-right'); // default alignment
        }
    };


    useEffect(() => {
        adjustPopupPosition();
        window.addEventListener('resize', adjustPopupPosition);

        return () => {
            window.removeEventListener('resize', adjustPopupPosition);
        };
    }, []);

    // Also adjust popup position when filters change or when card is selected
    useEffect(() => {
        // Use a timeout to ensure the DOM has updated after filter changes
        const timeoutId = setTimeout(() => {
            adjustPopupPosition();
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [hobbyFilter, isSelected(person.id)]); // Re-run when hobby filter changes or selection changes

    // Additional position adjustment when the component updates (grid layout changes)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            adjustPopupPosition();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [index]); // Re-run when the card's position in the grid changes

    // Setup the individual headshot card.
    return (

        // Container for the entire card.
        <div
            className={`headshot-card ${isSelected(person.id) ? 'selected' : ''}`}
            ref={(el) => assignRef(person.id, el)}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            onClick={() => {
                handleHeadshotClick(person.id);
                // Also trigger the scroll on click if desired
                startLineNameScroll();
            }}
        >

            {/* Show a message to deselect a headshot when selected. */}
            {isSelected(person.id) && (
                <div className="deselect-instruction">
                    Click again to defocus
                </div>
            )}

            {/* Position Display */}
            {person.positions && person.positions.length > 0 && (
                <div className="position-display" ref={positionDisplayRef}>
                    <p>
                        {(() => {
                            // Sort positions by start date and get the latest
                            const latestPosition = person.positions.sort((a, b) => {
                                const dateA = new Date(`${a.start_month} ${a.start_year}`);
                                const dateB = new Date(`${b.start_month} ${b.start_year}`);
                                return dateB - dateA;
                            })[0];

                            // Format start and end dates for the latest position
                            const startFormatted = formatSeason(`${latestPosition.start_month} ${latestPosition.start_year}`);
                            const endFormatted = latestPosition.end_month && latestPosition.end_year
                                ? formatSeason(`${latestPosition.end_month} ${latestPosition.end_year}`)
                                : 'Present';

                            return `${latestPosition.title}`;
                        })()}
                    </p>
                </div>
            )}


            {/* Popup Content */}
            <div className='popup' ref={popupRef}>

                {/* Casual Images Carousel */}
                <div className="popup-casual-carousel">

                    {/* Casual images and Navigation buttons */}
                    {person.casual_image1 || person.casual_image2 || person.casual_image3 ? (
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
                    ) : null}
                </div>

                {/* Fixed Header (Non-Scrollable) */}
                <div className="popup-header">
                    <h4>
                        <span className="NUM">{person.id}</span>
                        {/* Wrap the line name in a container with a fixed width */}
                        <span className="line-name-container" ref={lineNameContainerRef}>
                            <span className="line-name">'{person.line_name}'</span>
                        </span>
                    </h4>
                </div>

                {/* Dynamic Content */}
                <div className="popup-info">

                    {/* Big */}
                    {bigBrother && (
                        <div className="related-brothers big-brother">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLinkClick(person.bigId);
                                }}
                                className="related-link"
                            >
                                {bigBrother.name.includes(' ')
                                    ? `${bigBrother.name.split(' ')[0]} ${bigBrother.name.split(' ')[1][0]}.`
                                    : bigBrother.name}
                                's Little
                            </button>
                        </div>
                    )}


                    {/* Littles */}
                    {littles.length > 0 && (
                        <div className="related-brothers littles">
                            <h5>Big brother of:</h5>
                            <ul>
                                {littles.map(little => {
                                    const [firstName, lastName] = little.name.split(' ');

                                    // Since Yucheng does not have his last name in the system, we must check if the name field is two names or one.
                                    const displayName = little.name.includes(' ')
                                        ? `${little.name.split(' ')[0]} ${little.name.split(' ')[1][0]}.`
                                        : little.name;

                                    return (
                                        <li key={little.id}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLinkClick(little.id);
                                                }}
                                                className="related-link-littles"
                                            >
                                                {displayName}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Course of study/Major label */}
                    <p>
                        {person.status === 'Alumni'
                            ? 'Studied ' : 'Studies '}
                        {person.major}
                    </p>

                    {/* Hobbies Section */}
                    {Array.isArray(person.hobbies) && person.hobbies.length > 0 && (
                        <div className="hobbies-section">
                            <h5>Hobbies:</h5>
                            <div className="hobbies-container">
                                {person.hobbies.map((hobby, index) => (
                                    <span
                                        key={index}
                                        className={`hobby-bubble ${hobbyFilter === hobby ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering other click events
                                            setHobbyFilter(hobby === hobbyFilter ? null : hobby); // Toggle hobby filter
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

                    {/* Graduation status (Alumni, Active, Associate) label. */}
                    <p className='status'>Status: <b>{person.status}</b></p>
                </div>
            </div>

            {/* Content Layer */}
            <div
                className="card-content"
                ref={cardRef}
                onMouseMove={handleMouseMove} // Keep the mouse move handler
                onMouseLeave={handleMouseLeave}
            >
                <div className="image-container">
                    <img src={person.image || '/path/to/default/image.png'} alt={person.name} />
                </div>
                <div className="text-container">
                    <h3>{person.name}</h3>
                    <p>{person.class_field}</p>
                </div>
            </div>

        </div>
    );
};



export default Brothers;
