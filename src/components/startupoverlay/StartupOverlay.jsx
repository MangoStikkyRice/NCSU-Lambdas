import React, { useEffect, useState } from 'react';
import './StartupOverlay.css';

import backgroundLogo from '../../assets/images/Crest.png';

function StartupOverlay({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 4000); // Adjust the time to match your animation duration

        return () => clearTimeout(timer);
    }, [onComplete]);

    useEffect(() => {
        const textSpans = document.querySelectorAll('.leaders-text span');
        textSpans.forEach((span, index) => {
            span.classList.add('fade-in');
            span.classList.add(`delay-${index + 1}`);
        });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach((span, index) => {
                        setTimeout(() => {
                            span.classList.add('zoom-out');
                            if (index === 2) { // Trigger after the third zoom-out animation
                                setTimeout(() => {
                                    document.querySelector('.startup-overlay').classList.add('color-transition');
                                }, 200); // Delay to start the background color change
                            }
                        }, index * 400); // Adjust the delay as needed
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const leadersText = document.querySelector('.leaders-text');
        const text = leadersText.textContent;
        leadersText.innerHTML = text.split(' ').map((word, index) => `<span class="delay-${index}">${word}</span>`).join(' ');
        observer.observe(leadersText);
    }, []);

    return (
        <div className={`startup-overlay ${!isVisible ? 'hide' : ''}`}>
            <div className="leaders-text">
                {Array.from('Leaders Among Men').map((char, index) => (
                    <span key={index}>{char}</span>
                ))}
            </div>

            {/* Lambda Phi Epsilon text instead of logo */}
            <div className="mt-3 logo-fade-in lambda-text" style={{ height: '40px', backgroundColor: 'transparent', fontFamily: 'Dotum'}}>
                LAMBDA PHI EPSILON
            </div>

            <div className="logo-since-container">
                <div className="mt-3 logo">NC State</div>
                <div className="chapter-text">Beta Eta Chapter</div>
            </div>

            <div className="since-text">Since 2016</div>

            <div className="full-page-logo" style={{ backgroundImage: `url(${backgroundLogo})` }}></div>
        </div>

    );
}

export default StartupOverlay;
