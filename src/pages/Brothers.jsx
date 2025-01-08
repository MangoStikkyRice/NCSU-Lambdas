import React, { useState, useEffect, useRef } from 'react';
import './Brothers.scss';
import NavBarNew from './../components/navbar/NavBarNew';
import axios from 'axios'; // Import axios for HTTP requests
import nureveal from '../assets/images/nureveal.jpg';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger
import PositionsOverlay from './../components/PositionsOverlay';
import StatisticsOverlay from './../components/StatisticsOverlay';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

import class2016AImage from '../assets/images/panel2.jpg';
import class2016BImage from '../assets/images/panel2.jpg';
import class2017AImage from '../assets/images/panel2.jpg';
import class2017BImage from '../assets/images/panel2.jpg';

gsap.registerPlugin(ScrollTrigger);

const Brothers = () => {

    const [showStatistics, setShowStatistics] = useState(false);
    // Open statistics overlay
    const openStatistics = () => {
        setShowStatistics(true);
    };

    // Close statistics overlay
    const closeStatistics = () => {
        setShowStatistics(false);
    };

    useEffect(() => {
        const numGradients = 5;
        const colors = [
            'rgba(255, 0, 150, 0.5)',
            'rgba(0, 255, 150, 0.5)',
            'rgba(0, 150, 255, 0.5)',
            'rgba(255, 255, 0, 0.5)',
            'rgba(255, 0, 255, 0.5)',
            'rgba(0, 255, 255, 0.5)',
        ];

        for (let i = 1; i <= numGradients; i++) {
            animateGradient(i);
        }

        function animateGradient(i) {
            const vars = {
                [`--pos${i}-x`]: `${gsap.utils.random(0, 100)}%`,
                [`--pos${i}-y`]: `${gsap.utils.random(0, 100)}%`,
                [`--size${i}`]: `${gsap.utils.random(30, 80)}%`,
                [`--color${i}`]: colors[gsap.utils.random(0, colors.length - 1)],
            };

            gsap.to(document.documentElement, {
                duration: gsap.utils.random(10, 20),
                ...vars,
                ease: 'sine.inOut',
                onComplete: () => animateGradient(i),
            });
        }
    }, []);

    // States to hold brothers data
    const [brothers, setBrothers] = useState([]);
    const [selectedBrotherId, setSelectedBrotherId] = useState(null);
    const [overlayData, setOverlayData] = useState(null); // New state for overlay

    // Function to handle opening the overlay
    const openOverlay = (positions, name, imageUrl) => {
        setOverlayData({ positions, name, imageUrl }); // Store imageUrl
    };

    // Function to handle closing the overlay
    const closeOverlay = () => {
        setOverlayData(null);
    };

    // Refs for each brother's headshot to enable scrolling
    const headshotRefs = useRef({});

    // Fetch brothers data from API on component mount
    useEffect(() => {
        fetchBrothers();
    }, []);

    const fetchBrothers = async () => {
        try {
            const response = await axios.get('/.netlify/functions/get_brothers');
            console.log('API Response:', response.data); // Log the response
            setBrothers(response.data); // Assuming response.data is an array
        } catch (error) {
            console.error('Error fetching brothers data:', error);
            setBrothers([]); // Fallback to an empty array on error
        }
    };
    
    

    // Function to handle link clicks within popups
    const handleLinkClick = (targetId) => {
        if (selectedBrotherId === targetId) {

            // Deselect if the same brother is clicked again
            setSelectedBrotherId(null);
        } else {

            // Select the new brother
            setSelectedBrotherId(targetId);

            // Scroll to the target headshot smoothly
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

    // Checks the third column to assign a left-side popup instead of a right
    const isInThirdColumn = (index) => (index + 1) % 3 === 0;

    // Filter brothers based on selected filter and hobby
    const filteredBrothers = brothers.filter(person => {

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

    const timelineData = [
        {
            year: '2016',
            classes: [

                {
                    className: 'Charter Conquest',
                    PC: 'Mike Johnson',
                    PD: 'Emily Davis',
                    image: class2016BImage,
                },
            ],
        },
        {
            year: '2017',
            classes: [
                {
                    className: 'Alpha Ascension',
                    PC: 'David Lee',
                    PD: 'Chris Evans',
                    image: class2017AImage,
                },
                {
                    className: 'Beta Battalion',
                    PC: 'Sarah Miller',
                    PD: 'James Brown',
                    image: class2017BImage,
                },
            ],
        },
        {
            year: '2018',
            classes: [
                {
                    className: 'Gamma Guardians',
                    PC: 'John Doe',
                    PD: 'Jane Smith',
                    image: class2016AImage,
                },
                {
                    className: 'Delta Dimension',
                    PC: 'Mike Johnson',
                    PD: 'Emily Davis',
                    image: class2016BImage,
                },
            ],
        },
        {
            year: '2019',
            classes: [
                {
                    className: 'Zeta Zaibatsu',
                    PC: 'David Lee',
                    PD: 'Chris Evans',
                    image: class2017AImage,
                },
                {
                    className: 'Eta Evolution',
                    PC: 'Sarah Miller',
                    PD: 'James Brown',
                    image: class2017BImage,
                },
            ],
        },
        {
            year: '2020',
            classes: [
                {
                    className: 'Theta Trinity',
                    PC: 'John Doe',
                    PD: 'Jane Smith',
                    image: class2016AImage,
                },
                {
                    className: 'Iota Immortals',
                    PC: 'Mike Johnson',
                    PD: 'Emily Davis',
                    image: class2016BImage,
                },
            ],
        },
        {
            year: '2022',
            classes: [
                {
                    className: 'Kappa Kazoku',
                    PC: 'David Lee',
                    PD: 'Chris Evans',
                    image: class2017AImage,
                },
                {
                    className: 'Mu Monarchs',
                    PC: 'Sarah Miller',
                    PD: 'James Brown',
                    image: class2017BImage,
                },
            ],
        },
        {
            year: '2023',
            classes: [
                {
                    className: 'Nu Nen',
                    PC: 'David Lee',
                    PD: 'Chris Evans',
                    image: class2017AImage,
                },
            ],
        },
        {
            year: '2024',
            classes: [
                {
                    className: 'Xi Xin',
                    PC: 'Sarah Miller',
                    PD: 'James Brown',
                    image: class2017BImage,
                },
                {
                    className: 'Omicron Okami',
                    PC: 'David Lee',
                    PD: 'Chris Evans',
                    image: class2017AImage,
                },
            ],
        },
    ];

    // Refs for timeline
    const markersRef = useRef([]);
    const timelineRef = useRef(null);

    useEffect(() => {
        // Clear markersRef on re-render
        markersRef.current = [];

        // Initial animation for timeline markers
        gsap.fromTo(
            markersRef.current,
            {
                y: 50,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'expo',
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: 'top 80%',
                },
            }
        );
        // Cleanup function
        return () => {
            // Clear any GSAP instances if necessary
        };
    }, []);

    // Modify handleMarkerMouseEnter
    const handleMarkerMouseEnter = (index) => {
        const marker = markersRef.current[index];
        const popup = marker.querySelector('.timeline-popup');

        // Kill any ongoing tweens on marker and popup
        gsap.killTweensOf([marker, popup]);

        // Animate marker scaling
        gsap.to(marker, {
            scale: 1.2,
            duration: 0.5,
            ease: 'power2.out',
        });

        // Show the popup
        gsap.to(popup, {
            autoAlpha: 1,
            y: -20,
            duration: 0.3,
            ease: 'power2.out',
        });

        // Adjust popup position for first and last markers
        if (index === 0 || index === 1) {
            // First marker: Align popup to the left
            popup.style.left = '0%';
            popup.style.transform = 'translateX(0%)';
        } else if (index === timelineData.length - 1 || index === timelineData.length - 2) {
            // Last marker: Align popup to the right
            popup.style.left = '100%';
            popup.style.transform = 'translateX(-100%)';
        } else {
            // Other markers: Center the popup
            popup.style.left = '50%';
            popup.style.transform = 'translateX(-50%)';
        }
    };

    const handleMarkerMouseLeave = (index) => {
        const marker = markersRef.current[index];
        const popup = marker.querySelector('.timeline-popup');

        // Kill any ongoing tweens on marker and popup
        gsap.killTweensOf([marker, popup]);

        // Animate marker scaling back to normal
        gsap.to(marker, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.in',
        });

        // Hide the popup
        gsap.to(popup, {
            autoAlpha: 0,
            y: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                // Reset popup position after the animation completes
                popup.style.left = '';
                popup.style.transform = '';
            },
        });
    };



    // Set up the Brothers page
    return (

        // Container for the entire page, including the navbar.
        <div className="includeHeader">
            <NavBarNew />

            {/* Container for the entire page, excluding the navbar. */}
            <div className="brothers-page">
                <>

                    {/* Container for the title strip. */}
                    <div className="legacy-title-container1">
                        <div className="blue-strip1"></div>
                        <h2 className="legacy-title">{getTitle()}</h2>
                    </div>

                    {/* Container for filter and statistics button */}
                    <div className="filter-container">
                        <div className="filter-box">
                            {/* Filter Dropdown */}
                            <label htmlFor="roleFilter">Filter by:</label>
                            <select
                                id="roleFilter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all brothers">All</option>
                                <option value="Actives">Active House</option>
                                <option value="Alumni">Alumni</option>
                                <option value="Associates">Associate Members</option>
                                <option value="Etas">Eta Evolution</option>
                                <option value="Thetas">Theta Trinity</option>
                                <option value="Iotas">Iota Immortals</option>
                                <option value="Kappas">Kappa Kazoku</option>
                                <option value="Mus">Mu Monarchs</option>
                                <option value="Nus">Nu Nen</option>
                                <option value="Xis">Xi Xin</option>
                            </select>
                        </div>

                        {/* Button to trigger the statistics overlay */}
                        <button
                            onClick={openStatistics}
                            className="statistics-button"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                backgroundColor: '#203c79',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                marginLeft: '20px' // Space it nicely next to the dropdown
                            }}
                        >
                            View Statistics
                        </button>
                    </div>

                    {/* Render statistics overlay */}
                    {showStatistics && <StatisticsOverlay onClose={closeStatistics} brothers={brothers} />}

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

                    {/* Container for all headshots, including the grid. */}
                    <div className="color-box-headshots">

                        {/* Grid to map headshots pulled from database. */}
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
                                    isInThirdColumn={isInThirdColumn}
                                    // Pass image_url when opening the overlay
                                    openOverlay={() => openOverlay(person.positions || mockPositions, person.name, person.image_url)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="timeline-section">
                        <div className="timeline-title">
                            <h2>Chapter Timeline</h2>
                        </div>
                        <div className="timeline-container" ref={timelineRef}>
                            <div className="timeline-line"></div>
                            {timelineData.map((entry, index) => (
                                <div key={index} className="timeline-entry">
                                    <div
                                        className="timeline-marker"
                                        ref={(el) => (markersRef.current[index] = el)}
                                        onMouseEnter={() => handleMarkerMouseEnter(index)}
                                        onMouseLeave={() => handleMarkerMouseLeave(index)}
                                    >
                                        <span className="timeline-year">{entry.year}</span>
                                        <div
                                            className="timeline-popup"
                                            style={{ width: entry.classes.length === 1 ? '400px' : '800px' }}
                                        >
                                            <div className="popup-content">
                                                {entry.classes.map((classEntry, classIndex) => (
                                                    <div key={classIndex} className="class-entry">
                                                        <h3>{classEntry.className}</h3>
                                                        <h4>New Member Educators</h4>
                                                        <div className="PCPD">
                                                            <p>PC: {classEntry.PC}</p>
                                                            <p>PD: {classEntry.PD}</p>
                                                        </div>
                                                        {classEntry.image && (
                                                            <img
                                                                src={classEntry.image}
                                                                alt={`${classEntry.className} Image`}
                                                                className="timeline-image"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Positions Overlay */}
                    <AnimatePresence>
                        {overlayData && (
                            <PositionsOverlay
                                positions={overlayData.positions}
                                onClose={closeOverlay}
                                name={overlayData.name}
                                imageUrl={overlayData.imageUrl} // Pass imageUrl to PositionsOverlay
                            />
                        )}
                    </AnimatePresence>
                </>


                {/* Container to make space for the footer. */}
                <footer className="footer">
                    <div className="footer-content">
                        <p>&copy; 2024 NC State Lambda Phi Epsilon. All rights reserved.</p>
                        <p>Designed, Built, Tested by Jordan <strong>'InterstellHer'</strong> Miller.</p>
                        <nav className="footer-nav">
                            <ul>
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/contact">Contact</a></li>
                                <li><a href="/privacy">Privacy Policy</a></li>
                            </ul>
                        </nav>
                    </div>
                </footer>
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
    isInThirdColumn,
    openOverlay,
}) => {

    const mockPositions = [
        { title: 'President', description: 'Leads the chapter and oversees all activities.' },
        { title: 'Vice President', description: 'Assists the President and steps in when needed.' },
        { title: 'Treasurer', description: 'Manages the chapter\'s finances and budget.' },
        { title: 'Secretary', description: 'Keeps records of meetings and official documents.' },
        // Add more positions as needed
    ];

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

    // Ref for the flags container
    const flagsContainerRef = useRef(null);

    // Ref for the card content to apply tilt
    const cardContentRef = useRef(null);

    // Function to handle headshot hover (mouse enter)
    const handleCardMouseEnter = () => {
        setHovered(true);
        if (!isSelected(person.id) && flagsContainerRef.current) {

            const fromX = isInThirdColumn(index) ? 50 : -50;

            // Animate flags to scale up
            gsap.fromTo(
                flagsContainerRef.current.children,
                { x: fromX, opacity: 0, scale: 0.1, },
                {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "expo",
                    onComplete: () => {
                        flagsContainerRef.current.dataset.hasAnimated = true;
                    },
                }
            );
        }
    };

    // Function to handle headshot hover leave (mouse leave)
    const handleCardMouseLeave = () => {
        setHovered(false);
        if (!isSelected(person.id) && flagsContainerRef.current) {
            // Animate flags back to original scale
            gsap.to(flagsContainerRef.current.children, {
                scale: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.in',
            });
        }
    };

    // Get the big brother
    const bigBrother = getBig(person);

    // Get the littles
    const littles = getLittles(person);

    const { nationalities } = person;

    // Sort nationalities alphabetically by country name
    const sortedNationalities = Array.isArray(nationalities)
    ? [...nationalities].sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
    : [];

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



    const hobbies = Array.isArray(person.hobbies) ? person.hobbies : [];
    
    // Setup the individual headshot card.
    return (

        // Container for the entire card.
        <div
            className={`headshot-card ${isSelected(person.id) ? 'selected' : ''}`}
            ref={(el) => assignRef(person.id, el)}
            onClick={() => handleHeadshotClick(person.id)}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
        >

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
            <div className={`popup ${isInThirdColumn(index) ? 'popup-left' : 'popup-right'}`}>

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
                        <span className='NUM'>{person.id}</span>
                        <span className='line-name'>'{person.line_name}'</span>
                    </h4>
                </div>

                {/* Dynamic Content */}
                <div className="popup-info">

                    {/* Big */}
                    {bigBrother && (
                        <div className="related-brothers">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLinkClick(person.bigId);
                                }}
                                className="related-link"
                            >
                                {bigBrother.name}
                            </button>
                            <h>'s Little</h>
                        </div>
                    )}

                    {/* Littles */}
                    {littles.length > 0 && (
                        <div className="related-brothers">
                            <h5>Big brother of:</h5>
                            <ul>
                                {littles.map(little => (
                                    <li key={little.id}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLinkClick(little.id);
                                            }}
                                            className="related-link"
                                        >
                                            {little.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* New "View Positions" Button */}
                    <div className="view-positions-container">
                        <button
                            className="view-positions-button"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering card click
                                openOverlay(person.positions || mockPositions, person.name, person.image_url); // Pass image_url
                                handleHeadshotClick(person.id);
                            }}
                            aria-label={`View positions for ${person.name}`}
                        >
                            <h2>View Service Record</h2>
                        </button>
                    </div>


                    {/* Course of study/Major label */}
                    <p>
                        {person.status === 'Alumni'
                            ? 'Studied ' : 'Studies '}
                        {person.major}
                    </p>

                    {/* Hobbies Section */}
                    {person.hobbies && person.hobbies.length > 0 && (
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
                    <p>Status: <b>{person.status}</b></p>
                </div>

                {/* Nationality Flags */}
                <div className="flags-container" ref={flagsContainerRef}>
                    {sortedNationalities && sortedNationalities.length > 0 ? (
                        sortedNationalities.map((country) => (
                            <span
                                key={country.code}
                                className={`fi fi-${country.code.toLowerCase()} flag-icon`}
                                aria-label={`${country.name} flag`}
                                title={country.name}
                            ></span>
                        ))
                    ) : (
                        <span
                            className="fi fi-un flag-icon"
                            aria-label="No nationality specified"
                            title="Unknown"
                        ></span>
                    )}
                </div>

                {/* Show a message to deselect a headshot when selected. */}
                {isSelected(person.id) && (
                    <div className="deselect-instruction">
                        Click again to defocus
                    </div>
                )}
            </div>

            {/* Content Layer */}
            <div
                className="card-content"
                ref={cardRef}
                onMouseMove={handleMouseMove} // Keep the mouse move handler
                onMouseLeave={handleMouseLeave}
            >
                <div className="image-container">
                    <img src={person.image_url || '/path/to/default/image.png'} alt={person.name} />
                </div>
                <h3>{person.name}</h3>
                <p>{person.class_field}</p>
            </div>

        </div>
    );
};

export default Brothers;
