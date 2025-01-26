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
                    PM: 'Tim Wu',
                    PD: 'Henry Lieu',
                    image: class2016BImage,
                },
            ],
        },
        {
            year: '2017',
            classes: [
                {
                    className: 'Alpha Ascension',
                    PM: 'David Chang',
                    PD: 'Terrance Touch',
                    image: class2017AImage,
                },
                {
                    className: 'Beta Battalion',
                    PM: 'RJ Javier',
                    PD: '[Term Void]',
                    image: class2017BImage,
                }
            ]
        },
        {
            year: '2018',
            classes: [
                {
                    className: 'Gamma Guardians',
                    PM: 'Timothy Wu',
                    PD: 'Brody Zhao',
                    image: class2018AImage,
                },
                {
                    className: 'Delta Dimension',
                    PM: 'Matthew Wright',
                    PD: 'Tarun Salian',
                    image: class2018BImage,
                },
            ],
        },
        {
            year: '2019',
            classes: [
                {
                    className: 'Epsilon Eclipse',
                    PM: 'Tye Rojanasoonthon',
                    PD: 'Ye Htet',
                    image: class2019AImage,
                },
                {
                    className: 'Zeta Zaibatsu',
                    PM: 'Alex Phan',
                    PD: '[Term Void]',
                    image: class2019BImage,
                },
            ],
        },
        {
            year: '2020',
            classes: [
                {
                    className: 'Eta Evolution',
                    PM: 'Tarun Salian',
                    PD: 'Benjamin Adams',
                    image: class2020AImage,
                },
            ],
        },
        {
            year: '2021',
            classes: [
                {
                    className: 'Theta Trinity',
                    PM: 'Jeremy Dela Paz',
                    PD: 'Miller Kahihu',
                    image: class2021AImage,
                },
                {
                    className: 'Iota Immortals',
                    PM: 'Michael Tran',
                    PD: '[Term Void]',
                    image: class2021BImage,
                },
            ],
        },
        {
            year: '2022',
            classes: [
                {
                    className: 'Kappa Kazoku',
                    PM: 'Charles Villazor',
                    PD: 'Jared Javier',
                    image: class2022AImage,
                },
                {
                    className: 'Mu Monarchs',
                    PM: 'Richard Ngo',
                    PD: 'Kunwoo Lee',
                    image: class2022BImage,
                },
            ],
        },
        {
            year: '2023',
            classes: [
                {
                    className: 'Nu Nen',
                    PM: 'Maaz Khan',
                    PD: 'Dylan Murray',
                    image: class2023BImage,
                },
            ],
        },
        {
            year: '2024',
            classes: [
                {
                    className: 'Xi Xin',
                    PM: 'Yucheng',
                    PD: 'Christoffer Villazor',
                    image: class2024AImage,
                },
                {
                    className: 'Omicron Okami',
                    PM: 'Austin Heyward',
                    PD: 'San Phyo',
                    image: class2024BImage,
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
                                    openOverlay={() => openOverlay(person.positions, person.name, person.image_url)}
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
                                                        <div className="PMPD">
                                                            <p>PM: {classEntry.PM}</p>
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
    {/* Country Map */ }
    const countryMap = {
        AF: { name: "Afghanistan", code: "af" },
        AL: { name: "Albania", code: "al" },
        DZ: { name: "Algeria", code: "dz" },
        AS: { name: "American Samoa", code: "as" },
        AD: { name: "Andorra", code: "ad" },
        AO: { name: "Angola", code: "ao" },
        AI: { name: "Anguilla", code: "ai" },
        AG: { name: "Antigua and Barbuda", code: "ag" },
        AR: { name: "Argentina", code: "ar" },
        AM: { name: "Armenia", code: "am" },
        AU: { name: "Australia", code: "au" },
        AT: { name: "Austria", code: "at" },
        AZ: { name: "Azerbaijan", code: "az" },
        BS: { name: "Bahamas", code: "bs" },
        BH: { name: "Bahrain", code: "bh" },
        BD: { name: "Bangladesh", code: "bd" },
        BB: { name: "Barbados", code: "bb" },
        BY: { name: "Belarus", code: "by" },
        BE: { name: "Belgium", code: "be" },
        BZ: { name: "Belize", code: "bz" },
        BJ: { name: "Benin", code: "bj" },
        BM: { name: "Bermuda", code: "bm" },
        BT: { name: "Bhutan", code: "bt" },
        BO: { name: "Bolivia", code: "bo" },
        BA: { name: "Bosnia and Herzegovina", code: "ba" },
        BW: { name: "Botswana", code: "bw" },
        BR: { name: "Brazil", code: "br" },
        BN: { name: "Brunei", code: "bn" },
        BG: { name: "Bulgaria", code: "bg" },
        BF: { name: "Burkina Faso", code: "bf" },
        BI: { name: "Burundi", code: "bi" },
        CV: { name: "Cabo Verde", code: "cv" },
        KH: { name: "Cambodia", code: "kh" },
        CM: { name: "Cameroon", code: "cm" },
        CA: { name: "Canada", code: "ca" },
        KY: { name: "Cayman Islands", code: "ky" },
        CF: { name: "Central African Republic", code: "cf" },
        TD: { name: "Chad", code: "td" },
        CL: { name: "Chile", code: "cl" },
        CN: { name: "China", code: "cn" },
        CO: { name: "Colombia", code: "co" },
        KM: { name: "Comoros", code: "km" },
        CG: { name: "Congo (Brazzaville)", code: "cg" },
        CD: { name: "Congo (Kinshasa)", code: "cd" },
        CR: { name: "Costa Rica", code: "cr" },
        HR: { name: "Croatia", code: "hr" },
        CU: { name: "Cuba", code: "cu" },
        CY: { name: "Cyprus", code: "cy" },
        CZ: { name: "Czech Republic", code: "cz" },
        DK: { name: "Denmark", code: "dk" },
        DJ: { name: "Djibouti", code: "dj" },
        DM: { name: "Dominica", code: "dm" },
        DO: { name: "Dominican Republic", code: "do" },
        EC: { name: "Ecuador", code: "ec" },
        EG: { name: "Egypt", code: "eg" },
        SV: { name: "El Salvador", code: "sv" },
        GQ: { name: "Equatorial Guinea", code: "gq" },
        ER: { name: "Eritrea", code: "er" },
        EE: { name: "Estonia", code: "ee" },
        SZ: { name: "Eswatini", code: "sz" },
        ET: { name: "Ethiopia", code: "et" },
        FJ: { name: "Fiji", code: "fj" },
        FI: { name: "Finland", code: "fi" },
        FR: { name: "France", code: "fr" },
        GA: { name: "Gabon", code: "ga" },
        GM: { name: "Gambia", code: "gm" },
        GE: { name: "Georgia", code: "ge" },
        DE: { name: "Germany", code: "de" },
        GH: { name: "Ghana", code: "gh" },
        GR: { name: "Greece", code: "gr" },
        GD: { name: "Grenada", code: "gd" },
        GT: { name: "Guatemala", code: "gt" },
        GN: { name: "Guinea", code: "gn" },
        GW: { name: "Guinea-Bissau", code: "gw" },
        GY: { name: "Guyana", code: "gy" },
        HT: { name: "Haiti", code: "ht" },
        HN: { name: "Honduras", code: "hn" },
        HU: { name: "Hungary", code: "hu" },
        IS: { name: "Iceland", code: "is" },
        IN: { name: "India", code: "in" },
        ID: { name: "Indonesia", code: "id" },
        IR: { name: "Iran", code: "ir" },
        IQ: { name: "Iraq", code: "iq" },
        IE: { name: "Ireland", code: "ie" },
        IL: { name: "Israel", code: "il" },
        IT: { name: "Italy", code: "it" },
        JM: { name: "Jamaica", code: "jm" },
        JP: { name: "Japan", code: "jp" },
        JO: { name: "Jordan", code: "jo" },
        KZ: { name: "Kazakhstan", code: "kz" },
        KE: { name: "Kenya", code: "ke" },
        KI: { name: "Kiribati", code: "ki" },
        KR: { name: "Korea, South", code: "kr" },
        KW: { name: "Kuwait", code: "kw" },
        KG: { name: "Kyrgyzstan", code: "kg" },
        LA: { name: "Laos", code: "la" },
        LV: { name: "Latvia", code: "lv" },
        LB: { name: "Lebanon", code: "lb" },
        LS: { name: "Lesotho", code: "ls" },
        LR: { name: "Liberia", code: "lr" },
        LY: { name: "Libya", code: "ly" },
        LI: { name: "Liechtenstein", code: "li" },
        LT: { name: "Lithuania", code: "lt" },
        LU: { name: "Luxembourg", code: "lu" },
        MG: { name: "Madagascar", code: "mg" },
        MW: { name: "Malawi", code: "mw" },
        MY: { name: "Malaysia", code: "my" },
        MV: { name: "Maldives", code: "mv" },
        ML: { name: "Mali", code: "ml" },
        MT: { name: "Malta", code: "mt" },
        MH: { name: "Marshall Islands", code: "mh" },
        MR: { name: "Mauritania", code: "mr" },
        MU: { name: "Mauritius", code: "mu" },
        MX: { name: "Mexico", code: "mx" },
        FM: { name: "Micronesia", code: "fm" },
        MD: { name: "Moldova", code: "md" },
        MC: { name: "Monaco", code: "mc" },
        MN: { name: "Mongolia", code: "mn" },
        ME: { name: "Montenegro", code: "me" },
        MA: { name: "Morocco", code: "ma" },
        MZ: { name: "Mozambique", code: "mz" },
        MM: { name: "Myanmar", code: "mm" },
        NA: { name: "Namibia", code: "na" },
        NR: { name: "Nauru", code: "nr" },
        NP: { name: "Nepal", code: "np" },
        NL: { name: "Netherlands", code: "nl" },
        NZ: { name: "New Zealand", code: "nz" },
        NI: { name: "Nicaragua", code: "ni" },
        NE: { name: "Niger", code: "ne" },
        NG: { name: "Nigeria", code: "ng" },
        MK: { name: "North Macedonia", code: "mk" },
        NO: { name: "Norway", code: "no" },
        OM: { name: "Oman", code: "om" },
        PK: { name: "Pakistan", code: "pk" },
        PW: { name: "Palau", code: "pw" },
        PS: { name: "Palestine", code: "ps" },
        PA: { name: "Panama", code: "pa" },
        PG: { name: "Papua New Guinea", code: "pg" },
        PY: { name: "Paraguay", code: "py" },
        PE: { name: "Peru", code: "pe" },
        PH: { name: "Philippines", code: "ph" },
        PL: { name: "Poland", code: "pl" },
        PT: { name: "Portugal", code: "pt" },
        QA: { name: "Qatar", code: "qa" },
        RO: { name: "Romania", code: "ro" },
        RU: { name: "Russia", code: "ru" },
        RW: { name: "Rwanda", code: "rw" },
        WS: { name: "Samoa", code: "ws" },
        SA: { name: "Saudi Arabia", code: "sa" },
        SN: { name: "Senegal", code: "sn" },
        RS: { name: "Serbia", code: "rs" },
        SC: { name: "Seychelles", code: "sc" },
        SL: { name: "Sierra Leone", code: "sl" },
        SG: { name: "Singapore", code: "sg" },
        SK: { name: "Slovakia", code: "sk" },
        SI: { name: "Slovenia", code: "si" },
        SB: { name: "Solomon Islands", code: "sb" },
        SO: { name: "Somalia", code: "so" },
        ZA: { name: "South Africa", code: "za" },
        ES: { name: "Spain", code: "es" },
        LK: { name: "Sri Lanka", code: "lk" },
        SD: { name: "Sudan", code: "sd" },
        SR: { name: "Suriname", code: "sr" },
        SE: { name: "Sweden", code: "se" },
        CH: { name: "Switzerland", code: "ch" },
        SY: { name: "Syria", code: "sy" },
        TW: { name: "Taiwan", code: "tw" },
        TJ: { name: "Tajikistan", code: "tj" },
        TZ: { name: "Tanzania", code: "tz" },
        TH: { name: "Thailand", code: "th" },
        TL: { name: "Timor-Leste", code: "tl" },
        TG: { name: "Togo", code: "tg" },
        TO: { name: "Tonga", code: "to" },
        TT: { name: "Trinidad and Tobago", code: "tt" },
        TN: { name: "Tunisia", code: "tn" },
        TR: { name: "Turkey", code: "tr" },
        TM: { name: "Turkmenistan", code: "tm" },
        TV: { name: "Tuvalu", code: "tv" },
        UG: { name: "Uganda", code: "ug" },
        UA: { name: "Ukraine", code: "ua" },
        AE: { name: "United Arab Emirates", code: "ae" },
        GB: { name: "United Kingdom", code: "gb" },
        US: { name: "United States", code: "us" },
        UY: { name: "Uruguay", code: "uy" },
        UZ: { name: "Uzbekistan", code: "uz" },
        VU: { name: "Vanuatu", code: "vu" },
        VE: { name: "Venezuela", code: "ve" },
        VN: { name: "Vietnam", code: "vn" },
        YE: { name: "Yemen", code: "ye" },
        ZM: { name: "Zambia", code: "zm" },
        ZW: { name: "Zimbabwe", code: "zw" }
    };

    // Sort nationalities alphabetically by country name
    const sortedNationalities = Array.isArray(nationalities)
        ? [...nationalities]
            .filter((code) => countryMap[code]) // Filter out invalid codes
            .sort((a, b) => {
                const nameA = countryMap[a]?.name?.toUpperCase() || ""; // Get country name or fallback to ""
                const nameB = countryMap[b]?.name?.toUpperCase() || "";
                return nameA.localeCompare(nameB); // Use localeCompare for safe string comparison
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

    const popupRef = useRef(null); // Reference to the popup
    const adjustPopupPosition = () => {
        const popup = popupRef.current;
        const card = cardRef.current;

        if (!popup || !card) return;

        // Get bounding rectangles
        const cardRect = card.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        // Check for overflows
        const isOverflowingRight = cardRect.right + popupRect.width > window.innerWidth;
        const isOverflowingLeft = cardRect.left - popupRect.width < 0;

        // Reset classes
        popup.classList.remove('popup-left', 'popup-right');

        if (isOverflowingRight) {
            popup.classList.add('popup-left'); // Align popup to the left
        } else if (isOverflowingLeft) {
            popup.classList.add('popup-right'); // Align popup to the right
        } else {
            popup.classList.add('popup-right'); // Default to right alignment
        }
    };

    useEffect(() => {
        adjustPopupPosition();
        window.addEventListener('resize', adjustPopupPosition);

        return () => {
            window.removeEventListener('resize', adjustPopupPosition);
        };
    }, []);


    useEffect(() => {
        // Adjust popup on mount and resize
        adjustPopupPosition();
        window.addEventListener('resize', adjustPopupPosition);

        return () => {
            window.removeEventListener('resize', adjustPopupPosition);
        };
    }, []);

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
                        <span className='NUM'>{person.id}</span>
                        <span className='line-name'>'{person.line_name}'</span>
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
                            </button>
                            <h5>'s Little</h5>
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
                                                className="related-link"
                                            >
                                                {displayName}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}


                    {/* New "View Positions" Button */}
                    <div className="view-positions-container">
                        <button
                            className="view-positions-button"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering card click
                                openOverlay(person.positions, person.name, person.image_url); // Pass image_url
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
                    <p>Status: <b>{person.status}</b></p>
                </div>


                {/* Nationality Flags */}
                <div className="flags-container" ref={flagsContainerRef}>
                    {Array.isArray(person.nationalities) && person.nationalities.length > 0 ? (
                        person.nationalities.map((code) => (
                            countryMap[code] ? (
                                <span
                                    key={countryMap[code].code}
                                    className={`fi fi-${countryMap[code].code.toLowerCase()} flag-icon`}
                                    aria-label={`${countryMap[code].name} flag`}
                                    title={countryMap[code].name}
                                ></span>
                            ) : null
                        ))
                    ) : (
                        <span
                            className="fi fi-un flag-icon"
                            aria-label="No nationality specified"
                            title="Unknown"
                        ></span>
                    )}
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
                <h3>{person.name}</h3>
                <p>{person.class_field}</p>
            </div>

        </div>
    );
};

export default Brothers;
