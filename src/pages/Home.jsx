import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import panel1 from '../assets/images/panel1.jpeg';
import panel2 from '../assets/images/panel2.jpg';
import panel3 from '../assets/images/panel3.jpeg';
import panel4 from '../assets/images/panel4.jpg';
import './Home.css';
import StartupOverlay from '../components/startupoverlay/StartupOverlay';
import NavBarNew from '../components/navbar/NavBarNew';

function Home() {
    // State management
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Set viewport height CSS variable for mobile compatibility
    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVh();
        window.addEventListener('resize', setVh);

        return () => window.removeEventListener('resize', setVh);
    }, []);

    // Handle startup overlay display logic
    useEffect(() => {
        const overlayShown = sessionStorage.getItem('overlayShown');
        if (!overlayShown) {
            setOverlayVisible(true);
            sessionStorage.setItem('overlayShown', 'true');
        } else {
            setLoading(false);
        }
    }, []);

    // Event handlers
    const handleOverlayComplete = () => {
        setOverlayVisible(false);
        setLoading(false);
    };

    const handlePanelClick = (path) => {
        setIsFading(true);
        setTimeout(() => {
            navigate(path);
        }, 500);
    };

    const handleImageLoad = (event) => {
        event.target.classList.add('loaded');
    };

    // Navigation panel data
    const navigationPanels = [
        {
            image: panel1,
            title: 'Recruitment',
            path: '/recruitment',
            className: 'large-card'
        },
        {
            image: panel3,
            title: 'Brothers',
            path: '/brothers',
            className: 'small-card'
        },
        {
            image: panel4,
            title: 'Legacy',
            path: '/legacy',
            className: 'small-card'
        },
        {
            image: panel2,
            title: 'Media',
            path: '/media',
            className: 'large-card'
        }
    ];

    return (
        <div id="home" className={isFading ? 'fade-out' : ''}>
            {overlayVisible && <StartupOverlay onComplete={handleOverlayComplete} />}
            
            {!loading && (
                <div>
                    <NavBarNew />
                    <div className="custom-container">
                        <div className="image-grid">
                            {/* Left column: Recruitment (large) and Brothers (small) */}
                            <div className="left-column">
                                {navigationPanels.slice(0, 2).map((panel, index) => (
                                    <div 
                                        key={panel.title}
                                        className={`image-card ${panel.className}`} 
                                        onClick={() => handlePanelClick(panel.path)}
                                    >
                                        <img 
                                            src={panel.image} 
                                            alt={panel.title} 
                                            onLoad={handleImageLoad} 
                                        />
                                        <div className="card-title">{panel.title}</div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Right column: Legacy (small) and Media (large) */}
                            <div className="right-column">
                                {navigationPanels.slice(2).map((panel, index) => (
                                    <div 
                                        key={panel.title}
                                        className={`image-card ${panel.className}`} 
                                        onClick={() => handlePanelClick(panel.path)}
                                    >
                                        <img 
                                            src={panel.image} 
                                            alt={panel.title} 
                                            onLoad={handleImageLoad} 
                                        />
                                        <div className="card-title">{panel.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
