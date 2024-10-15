// Brothers.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Brothers.scss';
import NavBarNew from './../components/navbar/NavBarNew';

// Import your images as before
import michaelt1 from '../assets/images/michaelt1.png';
import alexky1 from '../assets/images/alexky1.jpg';
import kunwoo1 from '../assets/images/kunwoo1.png';
import alexs1 from '../assets/images/alexs1.png';
import richard1 from '../assets/images/richard1.jpg';
import lee1 from '../assets/images/lee1.jpg';
import mico1 from '../assets/images/mico1.jpg';
import austin1 from '../assets/images/austin1.jpg';
import yucheng1 from '../assets/images/yucheng1.jpg';
import christoffer1 from '../assets/images/christoffer1.jpg';
import dylan1 from '../assets/images/dylan1.png';
import alexk1 from '../assets/images/alex1.jpg';
import michaela1 from '../assets/images/michael1.jpg';
import cristian1 from '../assets/images/cristian1.png';
import kenny1 from '../assets/images/kenny1.png';
import jordanImg from '../assets/images/jordan1.jpg';
import san1 from '../assets/images/san1.png';
import lex1 from '../assets/images/lex1.png';
import jaycee1 from '../assets/images/jaycee1.png';
import jack1 from '../assets/images/jack1.png';
import langston1 from '../assets/images/langston1.png';
import chrisk1 from '../assets/images/chrisk1.png';
import lam1 from '../assets/images/lam1.png';
import alonso1 from '../assets/images/alonso1.png';
import nureveal from '../assets/images/nureveal.jpg';

const headshots = [
    {
        id: 48,
        name: 'Michael Tran',
        line_name: 'Carry the Titans',
        status: 'Alumni',
        class: 'Eta Evolution',
        bigId: 12,
        littleIds: null,
        major: 'Electrical Engineering',
        hobbies: ['Dancing', 'Anime'],
        image: michaelt1
    },
    {
        id: 49,
        name: 'Alex Kyu',
        line_name: 'Gears of Time',
        status: 'Alumni',
        class: 'Eta Evolution',
        bigId: 36,
        littleIds: [56],
        major: 'Biomedical Engineering',
        hobbies: ['Guitar', 'Anime', 'Gaming'],
        image: alexky1
    },
    {
        id: 50,
        name: 'Kunwoo Lee',
        line_name: 'Knightmare',
        status: 'Alumni',
        class: 'Eta Evolution',
        bigId: null,
        littleIds: [54, 62],
        major: 'Biology',
        hobbies: '',
        image: kunwoo1
    },
    {
        id: 51,
        name: 'Alex Singleton',
        line_name: 'Neon Future',
        status: 'Alumni',
        class: 'Eta Evolution',
        bigId: null,
        littleIds: null,
        major: 'Accounting',
        hobbies: '',
        image: alexs1
    },
    {
        id: 53,
        name: 'Richard Ngo',
        line_name: 'H.A.L.F',
        status: 'Alumni',
        class: 'Theta Trinity',
        bigId: null,
        littleIds: [58],
        major: 'Business Administration: Marketing',
        hobbies: '',
        image: richard1
    },
    {
        id: 54,
        name: 'Lee Willson',
        line_name: 'King of Currumpaw',
        status: 'Alumni',
        class: 'Theta Trinity',
        bigId: 50,
        littleIds: null,
        major: 'Applied Mathematics',
        hobbies: ['Gaming', 'Working Out', 'Cooking'],
        image: lee1
    },
    {
        id: 55,
        name: 'Mico Guevarra',
        line_name: 'MjolnHer',
        status: 'Alumni',
        class: 'Theta Trinity',
        bigId: 27,
        littleIds: [66, 68],
        major: 'Computer Science',
        hobbies: ['Dancing', 'Photography', 'Anime'],
        image: mico1
    },
    {
        id: 56,
        name: 'Austin Heyward',
        line_name: 'Dragon of Resonance',
        status: 'Alumni',
        class: 'Iota Immortals',
        bigId: 49,
        littleIds: [64],
        major: 'Computer Science',
        hobbies: ['Singing', 'Gaming', 'Manga', 'Anime'],
        image: austin1
    },
    {
        id: 57,
        name: 'Yucheng Niu',
        line_name: 'Radiant',
        status: 'Alumni',
        class: 'Iota Immortals',
        bigId: 43,
        littleIds: null,
        major: 'Computer Science',
        hobbies: ['DPR Simp', 'Manga', 'Nature Walks'],
        image: yucheng1
    },
    {
        id: 58,
        name: 'Christoffer Villazor',
        line_name: 'Hachiman',
        status: 'Alumni',
        class: 'Iota Immortals',
        bigId: 53,
        littleIds: null,
        major: 'Animal Science',
        hobbies: ['Writing', 'Gaming', 'Smash Bros.', 'Anime'],
        image: christoffer1
    },
    {
        id: 59,
        name: 'Dylan Murray',
        line_name: 'The Last Samurai',
        status: 'Active',
        class: 'Kappa Kazoku',
        bigId: 42,
        littleIds: [63],
        major: 'Parks, Recreation, and Tourism',
        hobbies: ['Genshin Impact', 'Photography'],
        image: dylan1
    },
    {
        id: 60,
        name: 'Alex Kay',
        line_name: 'The Pursuit of HAPPYNESS',
        status: 'Alumni',
        class: 'Kappa Kazoku',
        bigId: 42,
        littleIds: null,
        major: 'Animal Science',
        hobbies: ['Music', 'Reading', 'Skateboarding', 'Drawing'],
        image: alexk1
    },
    {
        id: 62,
        name: 'Michael Ashe',
        line_name: 'SKYTHUNDER',
        status: 'Alumni',
        class: 'Kappa Kazoku',
        bigId: 50,
        littleIds: [72],
        major: 'Computer Science',
        hobbies: ['Gaming', 'Hiking'],
        image: michaela1
    },
    {
        id: 63,
        name: 'Cristian Mendoza',
        line_name: 'The Blue Spirit',
        status: 'Active',
        class: 'Mu Monarchs',
        bigId: 59,
        littleIds: null,
        major: 'Civil Engineering',
        hobbies: ['Painting', 'Skiing'],
        image: cristian1
    },
    {
        id: 64,
        name: 'Kenny Nguyen',
        line_name: 'Seraph of Courage',
        status: 'Active',
        class: 'Mu Monarchs',
        bigId: 56,
        littleIds: null,
        major: 'Electrical Engineering',
        hobbies: ['Skateboarding', 'LoL', 'Roblox'],
        image: kenny1
    },
    {
        id: 65,
        name: 'San Phyo',
        line_name: 'Leo',
        status: 'Active',
        class: 'Nu Nen',
        bigId: 34,
        littleIds: null,
        major: 'Business Administration: Finance',
        hobbies: ['Lifting', 'Boba'],
        image: san1
    },
    {
        id: 66,
        name: 'Jack Liu',
        line_name: 'The SailHer',
        status: 'Active',
        class: 'Nu Nen',
        bigId: 55,
        littleIds: null,
        major: 'Computer Science',
        hobbies: ['Sleeping', 'Coding'],
        image: jack1
    },
    {
        id: 67,
        name: 'Jordan Miller',
        line_name: 'InterstellHer',
        status: 'Active',
        class: 'Nu Nen',
        bigId: 44,
        littleIds: [70],
        major: 'Computer Science',
        hobbies: ['Saxophone', 'Gaming', 'DIY'],
        image: jordanImg
    },
    {
        id: 68,
        name: 'Lex Chaffee',
        line_name: 'SubmarinHer',
        status: 'Active',
        class: 'Nu Nen',
        bigId: 55,
        littleIds: null,
        major: 'Applied Mathematics',
        hobbies: ['Grilling', 'K-Pop', 'Dancing'],
        image: lex1
    },
    {
        id: 69,
        name: 'Jaycee Wang',
        line_name: 'A Silent VOICE',
        status: 'Associate',
        class: 'Nu Nen',
        bigId: 60,
        littleIds: null,
        major: 'Electrical Engineering',
        hobbies: ['Clubbing', 'K-Pop', 'Gaming'],
        image: jaycee1
    },
    {
        id: 70,
        name: 'Chris Kha',
        line_name: 'StarGazeHer',
        status: 'Active',
        class: 'Xi Xin',
        bigId: 67,
        littleIds: null,
        major: 'Sociology',
        hobbies: ['Gaming', 'Gymnastics', 'Asian Food'],
        image: chrisk1
    },
    {
        id: 71,
        name: 'Lam Nguyen',
        line_name: 'Humanity\'s Strongest Soldier',
        status: 'Active',
        class: 'Xi Xin',
        bigId: 64,
        littleIds: null,
        major: 'Electrical Engineering',
        hobbies: ['Gaming', 'Asian Outreach'],
        image: lam1
    },
    {
        id: 72,
        name: 'Alonso Nolasco',
        line_name: 'TRAILBLAZER',
        status: 'Active',
        class: 'Xi Xin',
        bigId: 62,
        littleIds: null,
        major: 'Animal Science',
        hobbies: ['Gaming', 'Mexican Food'],
        image: alonso1
    },
    {
        id: 73,
        name: 'Langston Sit',
        line_name: 'RIPTIDE',
        status: 'Active',
        class: 'Xi Xin',
        bigId: 45,
        littleIds: null,
        major: 'Industrial Engineering',
        hobbies: ['Traveling', 'Asian Food', 'K-Pop'],
        image: langston1
    },
];


const timelineData = [
    { year: '2016', className: 'Alpha Class', PC: 'John Doe', PD: 'Jane Smith' },
    { year: '2017', className: 'Beta Class', PC: 'Mike Johnson', PD: 'Emily Davis' },
    { year: '2018', className: 'Gamma Class', PC: 'David Lee', PD: 'Chris Evans' },
    { year: '2019', className: 'Gamma Class', PC: 'David Lee', PD: 'Chris Evans' },
    { year: '2020', className: 'Gamma Class', PC: 'David Lee', PD: 'Chris Evans' },
    { year: '2021', className: 'Gamma Class', PC: 'David Lee', PD: 'Chris Evans' },
    { year: '2022', className: 'Gamma Class', PC: 'David Lee', PD: 'Chris Evans' },
    { year: '2023', className: 'Gamma Class', PC: 'David Lee', PD: 'Chris Evans', image: nureveal },
    { year: '2024', className: 'Gamma Class', PC: 'David Lee', PD: 'Chris Evans' },
];

const Brothers = () => {
    // State to track the selected brother's ID
    const [selectedBrotherId, setSelectedBrotherId] = useState(null);

    // Refs for each headshot to enable scrolling
    const headshotRefs = useRef({});

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

    const [filter, setFilter] = useState('All');
    const [hobbyFilter, setHobbyFilter] = useState(null);

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

    const isInThirdColumn = (index) => (index + 1) % 3 === 0;

    const filteredHeadshots = headshots.filter(person => {
        // Status/Class Filter
        const statusMatch = filter === 'All' ||
            (filter === 'Eta' && person.class === 'Eta Evolution') ||
            (filter === 'Theta' && person.class === 'Theta Trinity') ||
            (filter === 'Iota' && person.class === 'Iota Immortals') ||
            (filter === 'Kappa' && person.class === 'Kappa Kazoku') ||
            (filter === 'Mu' && person.class === 'Mu Monarchs') ||
            (filter === 'Nu' && person.class === 'Nu Nen') ||
            (filter === 'Xi' && person.class === 'Xi Xin') ||
            (person.status === filter);

        // Hobby Filter
        const hobbyMatch = !hobbyFilter || (person.hobbies && person.hobbies.includes(hobbyFilter));

        return statusMatch && hobbyMatch;
    });


    const getTitle = () => {
        switch (filter) {
            case 'Active':
                return 'Active House';
            case 'Alumni':
                return 'Alumni';
            case 'Associate':
                return 'Associate Members';
            case 'Eta':
                return 'Eta Evolution';
            case 'Theta':
                return 'Theta Trinity';
            case 'Iota':
                return 'Iota Immortals';
            case 'Kappa':
                return 'Kappa Kazoku';
            case 'Mu':
                return 'Mu Monarchs';
            case 'Xi':
                return 'Xi Xin';
            case 'Nu':
                return 'Nu Nen';
            default:
                return 'All Brothers';
        }
    };

    // Function to get a member by ID
    const getMemberById = (id) => headshots.find(member => member.id === id);

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
            return headshots.filter(brother => member.littleIds.includes(brother.id));
        }
        return [];
    };


    return (
        <div className="includeHeader">
            <NavBarNew />
            <div className="brothers-page">
                <div className="legacy-title-container1">
                    <div className="blue-strip1"></div>
                    <h2 className="legacy-title">{getTitle()}</h2>
                </div>

                <div className="filter-container">
                    <div className='filter-box'>
                        <label htmlFor="roleFilter">Filter by:</label>
                        <select
                            id="roleFilter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Active">Active House</option>
                            <option value="Alumni">Alumni</option>
                            <option value="Associate">Associate</option>
                            <option value="Eta">Eta Evolution</option>
                            <option value="Theta">Theta Trinity</option>
                            <option value="Iota">Iota Immortals</option>
                            <option value="Kappa">Kappa Kazoku</option>
                            <option value="Mu">Mu Monarchs</option>
                            <option value="Nu">Nu Nen</option>
                            <option value="Xi">Xi Xin</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(filter !== 'All' || hobbyFilter) && (
                    <div className="active-filters">
                        {filter !== 'All' && (
                            <div className="active-filter">
                                <span>Filter by: {getTitle()}</span>
                                <button onClick={() => setFilter('All')}>Clear</button>
                            </div>
                        )}
                        {hobbyFilter && (
                            <div className="active-filter">
                                <span>Interested in: {hobbyFilter}</span>
                                <button onClick={() => setHobbyFilter(null)}>Clear</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="color-box-headshots">
                    <div className="headshot-grid">
                        {filteredHeadshots.map((person, index) => (
                            <div
                                className={`headshot-card ${isSelected(person.id) ? 'selected' : ''}`}
                                key={person.id}
                                ref={(el) => assignRef(person.id, el)}
                                onClick={() => handleHeadshotClick(person.id)} // Toggle selection on headshot click
                            >
                                <img src={person.image} alt={person.name} />
                                <h3>{person.name}</h3>
                                <p>{person.class}</p>
                                <div className={`popup ${isInThirdColumn(index) ? 'popup-left' : 'popup-right'}`}>
                                    <img src={person.image} alt={person.name} className="popup-image" />

                                    {/* Fixed Header (Non-Scrollable) */}
                                    <div className="popup-header">
                                        <h4>
                                            <span className='NUM'>{person.id}</span>
                                            <span className='line-name'>'{person.line_name}'</span>
                                        </h4>
                                    </div>

                                    {/* Static Content */}
                                    <div className="popup-info">

                                        {/* Big */}
                                        {getBig(person) && (
                                            <div className="related-brothers">
                                                <h>Little of </h>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLinkClick(person.bigId);
                                                    }}
                                                    className="related-link"
                                                >
                                                    {getBig(person).name}
                                                </button>
                                            </div>
                                        )}

                                        {/* Littles */}
                                        {getLittles(person).length > 0 && (
                                            <div className="related-brothers">
                                                <h5>Big brother of:</h5>
                                                <ul>
                                                    {getLittles(person).map(little => (
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

                                        {/* Course of study/Major label. !!Dependent on status!! */}
                                        <p>
                                            {person.status === 'Alumni'
                                                ? 'Studied ' : 'Studies '}
                                            {person.major}</p>

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

                                    {selectedBrotherId && (
                                        <div className="deselect-instruction">
                                            {isSelected(person.id) ? 'Click again to defocus' : ''}
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="timeline-section">
                    <div className="timeline-title"><h2>Chapter Timeline</h2></div>
                    <div className="timeline-container">
                        <div className="timeline-line"></div>
                        {timelineData.map((entry, index) => (
                            <div key={index} className="timeline-entry">
                                <div className="timeline-marker">
                                    <span className="timeline-year">{entry.year}</span>
                                    <div className="timeline-popup">
                                        <div className="popup-column">
                                            <h3>{entry.className}</h3>
                                            <h4>New Member Educators</h4>
                                            <p>{entry.PC}</p>
                                            <p>{entry.PD}</p>
                                            {entry.image && <img src={entry.image} alt="Placeholder" className="timeline-image" />}
                                        </div>
                                        <div className="popup-column">
                                            <h3>{entry.className}</h3>
                                            <h4>New Member Educators</h4>
                                            <p>{entry.PC}</p>
                                            <p>{entry.PD}</p>
                                            {entry.image && <img src={entry.image} alt="Placeholder" className="timeline-image" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="footer">
                    <div className="footer-content">
                        <p>&copy; 2024 NC State Lambda Phi Epsilon. All rights reserved.</p>
                        <p>Developed by <strong>InterstellHer</strong>.</p>
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

export default Brothers;
