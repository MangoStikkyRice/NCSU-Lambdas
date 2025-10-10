import React, { useEffect, useState } from 'react';
import './StartupOverlay.css';

import backgroundLogo from '../../assets/images/Crest.png';

function StartupOverlay({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 6500); // total display time to let all text finish animating
      return () => clearTimeout(timer);
    }, [onComplete]);
    
    useEffect(() => {
      const leadersTextDiv = document.querySelector('.leaders-text');
      if (!leadersTextDiv) return;
    
      const text = 'Leaders Among Men';
      leadersTextDiv.innerHTML = '';
      text.split(' ').forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word + ' ';
        leadersTextDiv.appendChild(wordSpan);
      });
    }, []);
    
  
    // IntersectionObserver for the word-based spans
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('span');
            spans.forEach((span, index) => {
              setTimeout(() => {
                span.classList.add('zoom-out');
                if (index === 2) {
                  setTimeout(() => {
                    document.querySelector('.startup-overlay')
                            ?.classList.add('color-transition');
                  }, 200);
                }
              }, index * 400);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
  
      const leadersTextDiv = document.querySelector('.leaders-text');
      observer.observe(leadersTextDiv);
  
      return () => observer.disconnect();
    }, []);
  
    return (
      <div className={`startup-overlay ${!isVisible ? 'hide' : ''}`}>
        {/* Container that we'll populate in the effect */}
        <div className="leaders-text" />
        
        {/* Next elements... */}
        <div className="mt-3 logo-fade-in lambda-text">
          LAMBDA PHI EPSILON
        </div>
        <div className="logo-since-container">
          <div className="mt-3 logo">NC State</div>
          <div className="chapter-text">Beta Eta Chapter</div>
        </div>
        <div className="since-text">Since 2016</div>
        <div className="full-page-logo" 
             style={{ backgroundImage: `url(${backgroundLogo})` }} />
      </div>
    );
  }
  

export default StartupOverlay;
