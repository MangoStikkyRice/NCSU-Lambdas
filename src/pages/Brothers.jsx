import React, { useState, useEffect } from 'react';
import './Brothers.css';
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
    { id: 48, name: 'Michael Tran', line_name: 'Carry the Titans', role: ['Alumni', 'Eta'], image: michaelt1 },
    { id: 49, name: 'Alex Kyu', line_name: 'Gears of Time', role: ['Alumni', 'Eta'], image: alexky1 },
    { id: 50, name: 'Kunwoo Lee', line_name: 'Knightmare', role: ['Alumni', 'Eta'], image: kunwoo1 },
    { id: 51, name: 'Alex Singleton', line_name: 'Neon Future', role: ['Alumni', 'Eta'], image: alexs1 },
    { id: 53, name: 'Richard Ngo', line_name: 'H.A.L.F', role: ['Alumni', 'Theta'], image: richard1 },
    { id: 54, name: 'Lee Willson', line_name: 'King of Currumpaw', role: ['Alumni', 'Theta'], image: lee1 },
    { id: 55, name: 'Mico Guevarra', line_name: 'MjolnHer', role: ['Alumni', 'Theta'], image: mico1 },
    { id: 56, name: 'Austin Heyward', line_name: 'Dragon of Resonance', role: ['Alumni', 'Iota'], image: austin1 },
    { id: 57, name: 'Yucheng Niu', line_name: 'Radiant', role: ['Alumni', 'Iota'], image: yucheng1 },
    { id: 58, name: 'Christoffer Villazor', line_name: 'Hachiman', role: ['Alumni', 'Iota'], image: christoffer1 },
    { id: 59, name: 'Dylan Murray', line_name: 'The Last Samurai', role: ['Active', 'Kappa'], image: dylan1 },
    { id: 60, name: 'Alex Kay', line_name: 'The Pursuit of HAPPYNESS', role: ['Alumni', 'Kappa'], image: alexk1 },
    { id: 62, name: 'Michael Ashe', line_name: 'SKYTHUNDER', role: ['Alumni', 'Kappa'], image: michaela1 },
    { id: 63, name: 'Cristian Mendoza', line_name: 'The Blue Spirit', role: ['Active', 'Mu'], image: cristian1 },
    { id: 64, name: 'Kenny Nguyen', line_name: 'Seraph of Courage', role: ['Active', 'Mu'], image: kenny1 },
    { id: 65, name: 'San Phyo', line_name: 'Leo', role: ['Active', 'Nu'], image: san1 },
    { id: 66, name: 'Jack Liu', line_name: 'The SailHer', role: ['Active', 'Nu'], image: jack1 },
    { id: 67, name: 'Jordan Miller', line_name: 'InterstellHer', role: ['Active', 'Nu'], image: jordanImg },
    { id: 68, name: 'Lex Chaffee', line_name: 'SubmarinHer', role: ['Active', 'Nu'], image: lex1 },
    { id: 69, name: 'Jaycee Wang', line_name: 'A Silent VOICE', role: ['Associate', 'Nu'], image: jaycee1 },
    { id: 70, name: 'Chris Kha', line_name: 'StarGazeHer', role: ['Active', 'Xi'], image: chrisk1 },
    { id: 71, name: 'Lam Nguyen', line_name: 'Humanity\'s Strongest Soldier', role: ['Active', 'Xi'], image: lam1 },
    { id: 72, name: 'Alonso Nolasco', line_name: 'TRAILBLAZER', role: ['Active', 'Xi'], image: alonso1 },
    { id: 73, name: 'Langston Sit', line_name: 'RIPTIDE', role: ['Active', 'Xi'], image: langston1 },
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
    useEffect(() => {
        const markers = document.querySelectorAll('.timeline-marker');

        const handleMouseEnter = (marker) => {
            const popup = marker.querySelector('.timeline-popup');
            const rect = marker.getBoundingClientRect();
            const popupRect = popup.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            // Reset popup positioning
            popup.style.left = '50%';
            popup.style.right = 'auto';
            popup.style.transform = 'translateX(-50%) translateY(20px)';

            // Check if the popup overflows on the left
            if (rect.left - popupRect.width / 2 < 0) {
                popup.style.left = '0';
                popup.style.transform = 'translateX(0) translateY(20px)';
            }

            // Check if the popup overflows on the right
            if (rect.right + popupRect.width / 2 > windowWidth) {
                popup.style.left = 'auto';
                popup.style.right = '0';
                popup.style.transform = 'translateX(0) translateY(20px)';
            }

            // For very small windows, center the popup fully
            if (windowWidth < popupRect.width) {
                popup.style.left = '0';
                popup.style.right = '0';
                popup.style.transform = 'translateX(0) translateY(20px)';
            }
        };

        markers.forEach(marker => {
            marker.addEventListener('mouseenter', () => handleMouseEnter(marker));
        });

        return () => {
            markers.forEach(marker => {
                marker.removeEventListener('mouseenter', () => handleMouseEnter(marker));
            });
        };
    }, []);

    const [filter, setFilter] = useState('All');

    const isInThirdColumn = (index) => (index + 1) % 3 === 0;

    const filteredHeadshots = filter === 'All'
        ? headshots
        : headshots.filter(person => person.role.includes(filter));

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

    return (
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

            <div className="color-box-headshots">
                <div className="headshot-grid">
                    {filteredHeadshots.map((person, index) => (
                        <div className="headshot-card" key={person.id}>
                            <img src={person.image} alt={person.name} />
                            <h3>{person.name}</h3>
                            <p>{person.role.join(', ')}</p>
                            <div className={`popup ${isInThirdColumn(index) ? 'popup-left' : 'popup-right'}`}>
                                <img src={person.image} alt={person.name} className="popup-image" />
                                <div className="popup-info">
                                    <h4>{person.line_name}</h4>
                                    <p>Role: {person.role.join(', ')}</p>
                                    <a href={`/brother/${person.id}`} className="popup-link">View Profile</a>
                                </div>
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
                                        <img src={entry.image} alt="Placeholder" className="timeline-image" />
                                    </div>
                                    <div className="popup-column">
                                        <h3>{entry.className}</h3>
                                        <h4>New Member Educators</h4>
                                        <p>{entry.PC}</p>
                                        <p>{entry.PD}</p>
                                        <img src={entry.image} alt="Placeholder" className="timeline-image" />
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
    );
};

export default Brothers;
