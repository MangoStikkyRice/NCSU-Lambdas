import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import panel1 from '../assets/images/panel1.jpeg';
import panel2 from '../assets/images/panel2.jpg';
import panel3 from '../assets/images/panel3.jpeg';
import panel4 from '../assets/images/panel4.png';
import './Home.css';
import StartupOverlay from '../components/startupoverlay/StartupOverlay';
import NavBarNew from '../components/navbar/NavBarNew';

function Home() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [loading, setLoading] = useState(true); // New state for loading
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the overlay has been shown in this session
        const overlayShown = sessionStorage.getItem('overlayShown');
        if (!overlayShown) {
            // Show overlay if it hasn't been shown in this session
            setOverlayVisible(true);
            sessionStorage.setItem('overlayShown', 'true'); // Mark overlay as shown
        } else {
            setLoading(false); // Directly show content if the overlay has already been shown
        }
    }, []);

    const handleOverlayComplete = () => {
        setOverlayVisible(false);

    };

    // Function to handle fade out and navigation
    const handlePanelClick = (path) => {
        setIsFading(true); // Trigger fade-out effect
        setTimeout(() => {
            navigate(path); // Navigate to the new page after fade-out
        }, 500); // Match timeout with the duration of the fade-out animation
    };

    // Helper function to add the 'loaded' class after the image loads
    const handleImageLoad = (event) => {
        event.target.classList.add('loaded');
    };

    return (
        <div id="home" className={isFading ? 'fade-out' : ''}>
            {overlayVisible && <StartupOverlay onComplete={handleOverlayComplete} />}
            {!loading && ( // Hide content while the overlay is active
                <div>
                    <NavBarNew />
                    <div className="custom-container">
                        <div className="image-grid">
                            <div className="left-column">
                                <div className="image-card large-card" onClick={() => handlePanelClick('/recruitment')}>
                                    <img src={panel1} alt="Recruitment" onLoad={handleImageLoad} />
                                    <div className="card-title">Recruitment</div>
                                </div>
                                <div className="image-card small-card" onClick={() => handlePanelClick('/brothers')}>
                                    <img src={panel3} alt="Brothers" onLoad={handleImageLoad} />
                                    <div className="card-title">Brothers</div>
                                </div>
                            </div>
                            <div className="right-column">
                                <div className="image-card small-card" onClick={() => handlePanelClick('/legacy')}>
                                    <img src={panel4} alt="Legacy" onLoad={handleImageLoad} />
                                    <div className="card-title">Legacy</div>
                                </div>
                                <div className="image-card large-card" onClick={() => handlePanelClick('/media')}>
                                    <img src={panel2} alt="Media" onLoad={handleImageLoad} />
                                    <div className="card-title">Media</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
