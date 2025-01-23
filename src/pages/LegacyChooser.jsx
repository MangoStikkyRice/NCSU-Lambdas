// src/pages/LegacyChooser.jsx
import React, { useEffect, useState } from 'react';
import Legacy from './Legacy';                 // Your fallback (mobile/touch) version
import LegacyRELOADED from './LegacyRELOADED'; // Your desktop (fine-pointer) version

const LegacyChooser = () => {
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    // Match media for devices that have a "fine" pointer (mouse, trackpad, etc.)
    const mediaQuery = window.matchMedia('(any-pointer: fine)');

    // Function to update state based on whether the query currently matches
    const updatePointerState = () => {
      setHasFinePointer(mediaQuery.matches);
    };

    // Initialize on mount
    updatePointerState();

    // Listen for changes to pointer capabilities
    mediaQuery.addEventListener('change', updatePointerState);

    // Cleanup on unmount
    return () => {
      mediaQuery.removeEventListener('change', updatePointerState);
    };
  }, []);

  return hasFinePointer ? <LegacyRELOADED /> : <Legacy />;
};

export default LegacyChooser;
