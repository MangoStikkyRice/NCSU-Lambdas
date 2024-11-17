// AdvancedLoading.jsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './AdvancedLoading.scss';

const AdvancedLoading = () => {
  const loadingRef = useRef(null);

  useEffect(() => {
    const q = gsap.utils.selector(loadingRef);

    // Set initial properties
    gsap.set(q('.circle, .square, .triangle'), {
      transformOrigin: '50% 50%',
      opacity: 0,
    });

    // Create the animation timeline
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(q('.lambda'), {
      opacity: 1,
      scale: 1.2,
      duration: 1,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
    })
      .to(
        q('.phi'),
        {
          opacity: 1,
          rotation: 360,
          duration: 2,
          ease: 'power2.inOut',
          transformOrigin: '50% 50%',
          repeat: -1,
          
        },
        0
      )
      .to(
        q('.epsilon'),
        {
          opacity: 1,
          y: -20,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
        },
        0
      );
  }, []);

  return (
<div className="advanced-loading" ref={loadingRef}>
  <svg width="150" height="150" viewBox="0 0 100 100">
    <text
      className="shape lambda"
      x="19"
      y="50"
      fontSize="60"
      fill="#203c79"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      Λ
    </text>
    <text
      className="shape phi"
      x="50"
      y="43"
      fontSize="50"
      fill="#92aed8"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      Φ
    </text>
    <text
      className="shape epsilon"
      x="85"
      y="60"
      fontSize="60"
      fill="#203c79"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      Ε
    </text>
  </svg>

  <p>
  <b>Querying database</b>
        <span className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
      </p>
</div>

  );
};

export default AdvancedLoading;
