// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import panel1 from '../assets/images/panel1.jpeg';
import panel2 from '../assets/images/panel2.jpg';
import panel3 from '../assets/images/panel3.jpeg';
import panel4 from '../assets/images/panel4.jpg';
import './Home.scss';
import StartupOverlay from '../components/startupoverlay/StartupOverlay';
import NavBarNew from '../components/navbar/NavBarNew';

function Home() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mobile 100vh fix
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Show overlay once per session
  useEffect(() => {
    const overlayShown = sessionStorage.getItem('overlayShown');
    if (!overlayShown) {
      setOverlayVisible(true);
      sessionStorage.setItem('overlayShown', 'true');
    } else {
      setLoading(false);
    }
  }, []);

  // Precise “touch-only (no mouse)” detection for always-on labels
  useEffect(() => {
    const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    const hasFinePointer = window.matchMedia('(any-pointer: fine)').matches;
    const isTouchOnly = hasTouch && !hasFinePointer; // phones/tablets without mouse/trackpad
    document.documentElement.classList.toggle('touch-only', isTouchOnly);
  }, []);

  const handleOverlayComplete = () => {
    setOverlayVisible(false);
    setLoading(false);
  };

  const handlePanelClick = (path) => {
    setIsFading(true);
    setTimeout(() => navigate(path), 500);
  };

  const handleImageLoad = (e) => e.target.classList.add('is-loaded');

  const navigationPanels = [
    { image: panel1, title: 'Recruitment', path: '/recruitment', size: 'large' },
    { image: panel3, title: 'Brothers',    path: '/brothers',    size: 'small' },
    { image: panel4, title: 'Legacy',      path: '/legacy',      size: 'small' },
    { image: panel2, title: 'Media',       path: '/media',       size: 'large' }
  ];

  return (
    <div className={`home ${isFading ? 'home--fade-out' : ''}`}>
      {overlayVisible && <StartupOverlay onComplete={handleOverlayComplete} />}
      {!loading && (
        <>
          <NavBarNew />
          <div className="home__container">
            <div className="home__grid">
              <div className="home__col home__col--left">
                {navigationPanels.slice(0, 2).map((panel) => (
                  <div
                    key={panel.title}
                    className={`home__card home__card--${panel.size}`}
                    onClick={() => handlePanelClick(panel.path)}
                  >
                    <img
                      src={panel.image}
                      alt={panel.title}
                      onLoad={handleImageLoad}
                      className="home__card-image"
                    />
                    <div className="home__card-title">{panel.title}</div>
                  </div>
                ))}
              </div>
              <div className="home__col home__col--right">
                {navigationPanels.slice(2).map((panel) => (
                  <div
                    key={panel.title}
                    className={`home__card home__card--${panel.size}`}
                    onClick={() => handlePanelClick(panel.path)}
                  >
                    <img
                      src={panel.image}
                      alt={panel.title}
                      onLoad={handleImageLoad}
                      className="home__card-image"
                    />
                    <div className="home__card-title">{panel.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
