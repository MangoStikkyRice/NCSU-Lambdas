import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import NavBarNew from './../components/navbar/NavBarNew';
import Footer from '../components/Footer';
import YearOverlay from '../components/brothers/YearOverlay';
import HeadshotCard from '../components/headshots/HeadshotCard';
import Yearbook3DCarousel from '../components/Yearbook3DCarousel'; // ADD THIS IMPORT

// Data & Constants
import dataBrothers from '../data/brothers.json';
import { YEAR_GRID_DATA } from '../constants/yearGridData';
import { loadClasses } from '../constants/classes';

// Styles
import './Brothers.scss';

const Brothers = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    // Core data
    const [brothers, setBrothers] = useState([]);
    const [selectedBrotherId, setSelectedBrotherId] = useState(null);

    // Filter states
    const [filter, setFilter] = useState('all brothers');
    const [hobbyFilter, setHobbyFilter] = useState(null);

    // View toggles
    const [showYearbooks, setShowYearbooks] = useState(false);
    const [selectedYearData, setSelectedYearData] = useState(null);

    // ============================================
    // REFS
    // ============================================
    const headshotRefs = useRef({});

    // ============================================
    // CONSTANTS & HELPERS
    // ============================================
    const classesCatalog = loadClasses();
    const classFilterLabel = (name) => `${name.split(' ')[0]}s`;
    const findClassByFilter = (f) => classesCatalog.find((c) => classFilterLabel(c.name) === f);

    // ============================================
    // DATA INITIALIZATION
    // ============================================
    useEffect(() => {
        setBrothers(Array.isArray(dataBrothers) ? dataBrothers : []);
    }, []);

    // ============================================
    // MEMBER UTILITY FUNCTIONS
    // ============================================
    const getMemberById = (id) => brothers.find(member => String(member.id) === String(id));

    const getBig = (member) => {
        if (member.bigId) {
            return getMemberById(member.bigId);
        }
        return null;
    };

    const getLittles = (member) => {
        if (!member.littleIds || member.littleIds.length === 0) return [];

        const littleIdSet = new Set(member.littleIds.map(String));
        return brothers.filter(brother => littleIdSet.has(String(brother.id)));
    };

    // ============================================
    // FILTER LOGIC
    // ============================================
    const filteredBrothers = useMemo(() => {
        return brothers.filter(person => {
            // Check class match
            const cls = findClassByFilter(filter);
            const classMatch = cls ? person.class_field === cls.name : false;

            // Check status match
            const isStatusTab = ['Actives', 'Alumni', 'Associates'].includes(filter);
            const statusMatch =
                filter === 'all brothers' ||
                (isStatusTab && person.status === filter) ||
                classMatch;

            // Check hobby match
            const hobbyMatch = !hobbyFilter || (person.hobbies && person.hobbies.includes(hobbyFilter));

            return statusMatch && hobbyMatch;
        });
    }, [brothers, filter, hobbyFilter]);

    // ============================================
    // UI HELPER FUNCTIONS
    // ============================================
    const getTitle = () => {
        const cls = findClassByFilter(filter);
        if (cls) return cls.name;
        if (filter === 'Actives') return 'Active House';
        if (filter === 'Alumni') return 'Alumni';
        if (filter === 'Associates') return 'Associate Members';
        return 'All Brothers';
    };

    // ============================================
    // EVENT HANDLERS
    // ============================================

    // Handle clicking on brother links
    const handleLinkClick = useCallback((targetId) => {
        setSelectedBrotherId(prev => (prev === targetId ? null : targetId));
        headshotRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    // Handle clicking on headshot cards
    const handleHeadshotClick = useCallback((id) => {
        setSelectedBrotherId(prev => (prev === id ? null : id));
        headshotRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    // Assign refs to headshot elements
    const assignRef = useCallback((id, element) => {
        headshotRefs.current[id] = element;
    }, []);

    // Check if a brother is selected
    const isSelected = useCallback((id) => selectedBrotherId === id, [selectedBrotherId]);

    // Toggle yearbook view
    const toggleYearbooks = () => {
        setShowYearbooks(prev => !prev);
        setSelectedBrotherId(null); // Reset selection when switching views
    };

    // Year overlay handlers
    const openYearOverlay = (entry) => {
        setSelectedYearData(entry);
    };

    const closeYearOverlay = () => {
        setSelectedYearData(null);
    };

    // ============================================
    // CLICK OUTSIDE HANDLER
    // ============================================
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!(event.target instanceof Element)) return;
            if (!event.target.closest('.headshot-card')) {
                setSelectedBrotherId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="includeHeader">
            <meta name="theme-color" content="#203c79" />
            <NavBarNew />

            <div className={`brothers-page ${showYearbooks ? 'is-yearbooks' : ''}`}>
                {/* Title Section */}
                <div className="legacy-title-container1">
                    <div className="blue-strip1"></div>
                    <h2 className="legacy-title">
                        {showYearbooks ? 'Yearbooks' : getTitle()}
                    </h2>
                </div>

                {/* Filter Controls */}
                <div className="filter-container">
                    {/* Filter dropdown - hidden when showing yearbooks */}
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
                                {classesCatalog.map((c) => (
                                    <option key={c.id} value={classFilterLabel(c.name)}>
                                        {classFilterLabel(c.name)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Yearbook toggle button */}
                    <button
                        onClick={toggleYearbooks}
                        className="statistics-button"
                        style={{ marginLeft: '20px' }}
                    >
                        <p>{showYearbooks ? 'Show Members' : 'Show Yearbooks'}</p>
                    </button>
                </div>

                {/* Active hobby filter indicator */}
                {hobbyFilter && (
                    <div className="active-filters">
                        <div className="active-filter">
                            <span>Showing {filter} interested in {hobbyFilter}</span>
                            <button onClick={() => setHobbyFilter(null)}>Clear</button>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                {!showYearbooks ? (
                    // Brothers Grid View
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
                ) : (
                    // REPLACE THE YEARBOOK GRID WITH THE 3D CAROUSEL
                    <Yearbook3DCarousel
                        yearData={YEAR_GRID_DATA}
                        onYearSelect={openYearOverlay}
                    />
                )}

                {/* Year Overlay Modal */}
                <AnimatePresence>
                    {selectedYearData && (
                        <YearOverlay
                            yearData={selectedYearData}
                            onClose={closeYearOverlay}
                        />
                    )}
                </AnimatePresence>

                <Footer />
            </div>
        </div>
    );
};

export default Brothers;