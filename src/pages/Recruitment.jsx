import React, { useEffect, useState, useRef } from 'react';
import './RecruitmentRELOADED.scss';
import NavBarNew from '../components/navbar/NavBarNew';
import heroImage from '../assets/images/rec.jpg'; // Ensure this path is correct
import faqs from './faqsData'; // We'll create this data separately

const RecruitmentRELOADED = () => {
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const gameAreaRef = useRef(null);
    const gravity = 0.5;
    const friction = 0.8;

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                setVelocity((prev) => ({ ...prev, x: -5 }));
            }
            if (e.key === 'ArrowRight') {
                setVelocity((prev) => ({ ...prev, x: 5 }));
            }
            if (e.key === 'ArrowUp') {
                if (!isJumping) {
                    setVelocity((prev) => ({ ...prev, y: -10 }));
                    setIsJumping(true);
                }
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                setVelocity((prev) => ({ ...prev, x: 0 }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isJumping]);

    // Game loop
    useEffect(() => {
        const interval = setInterval(() => {
            setPlayerPosition((prev) => {
                let newX = prev.x + velocity.x;
                let newY = prev.y + velocity.y;

                // Apply gravity
                setVelocity((prevV) => ({ ...prevV, y: prevV.y + gravity }));

                // Ground collision
                if (newY >= 300) {
                    newY = 300;
                    setVelocity((prevV) => ({ ...prevV, y: 0 }));
                    setIsJumping(false);
                }

                // Boundary conditions
                if (newX < 0) newX = 0;
                if (newX > 800 - 50) newX = 800 - 50; // Assuming game area width is 800px

                return { x: newX, y: newY };
            });

            // Collision detection with blocks
            faqs.forEach((faq, index) => {
                const block = document.getElementById(`block-${index}`);
                if (block) {
                    const blockRect = block.getBoundingClientRect();
                    const playerRect = {
                        left: playerPosition.x,
                        right: playerPosition.x + 50,
                        top: playerPosition.y,
                        bottom: playerPosition.y + 50,
                    };

                    if (
                        playerRect.right > blockRect.left &&
                        playerRect.left < blockRect.right &&
                        playerRect.bottom > blockRect.top &&
                        playerRect.top < blockRect.bottom
                    ) {
                        setSelectedFaq(faq);
                    }
                }
            });
        }, 20); // 50 FPS

        return () => clearInterval(interval);
    }, [velocity, playerPosition]);

    const closeModal = () => {
        setSelectedFaq(null);
    };

    return (
        <div className='recruitment-reloaded-body'>
            <NavBarNew />
            {/* Hero Image Section */}
            <div className="hero-image-reloaded" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-text-reloaded">
                    <h1>RUSH LPhiE</h1>
                    <p>Discover Brotherhood, Leadership, and Legacy</p>
                </div>
            </div>

            {/* Platformer Game Area */}
            <div className="game-area" ref={gameAreaRef}>
                {/* Ground */}
                <div className="ground"></div>

                {/* Blocks */}
                {faqs.map((faq, index) => (
                    <div key={index} id={`block-${index}`} className="mario-block">
                        <span className="block-icon">?</span>
                    </div>
                ))}

                {/* Player */}
                <div
                    className="player"
                    style={{
                        left: `${playerPosition.x}px`,
                        top: `${playerPosition.y}px`,
                    }}
                ></div>
            </div>

            {/* Modal for FAQ Content */}
            {selectedFaq && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedFaq.title}</h2>
                        <p>{selectedFaq.content}</p>
                        <button onClick={closeModal} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruitmentRELOADED;
