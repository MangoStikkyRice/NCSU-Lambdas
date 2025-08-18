// src/pages/LegacyChooser.jsx
import React, { useState, useEffect } from 'react';
import Legacy from './Legacy'; // Your mobile (coarse-pointer) version
import LegacyDesktop from './LegacyDesktop'; // Your desktop (fine-pointer) version

const LegacyChooser = () => {
    // Debug state for manual switching
    const [debugMode, setDebugMode] = useState(false);
    const [forceDesktop, setForceDesktop] = useState(false);
    
    // Check if the device has fine pointer capability (desktop/mouse)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    
    // Check if the device has coarse pointer capability (touch/mobile)
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    
    // Check screen size as a fallback
    const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
    
    // Determine which version to show
    // Prefer fine pointer (desktop) if available, otherwise fall back to screen size
    const shouldShowDesktop = debugMode ? forceDesktop : (hasFinePointer || (!hasCoarsePointer && isLargeScreen));
    
    // Debug keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Ctrl/Cmd + D to toggle debug mode
            if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
                event.preventDefault();
                setDebugMode(!debugMode);
                console.log('Debug mode:', !debugMode);
            }
            
            // Ctrl/Cmd + Shift + D to force desktop version
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                setForceDesktop(!forceDesktop);
                console.log('Force desktop:', !forceDesktop);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [debugMode, forceDesktop]);
    
    // Log the decision for debugging
    console.log('Legacy Chooser Debug:', {
        fine: hasFinePointer,
        coarse: hasCoarsePointer,
        largeScreen: isLargeScreen,
        debugMode: debugMode,
        forceDesktop: forceDesktop,
        showingDesktop: shouldShowDesktop,
        shortcuts: 'Ctrl/Cmd + D: Toggle debug, Ctrl/Cmd + Shift + D: Force desktop'
    });
    
    return (
        <>
            {/* Debug overlay */}
            {debugMode && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    zIndex: 9999,
                    fontFamily: 'monospace'
                }}>
                    <div><strong>DEBUG MODE</strong></div>
                    <div>Pointer: {hasFinePointer ? 'Fine' : hasCoarsePointer ? 'Coarse' : 'None'}</div>
                    <div>Screen: {isLargeScreen ? 'Large' : 'Small'}</div>
                    <div>Showing: {shouldShowDesktop ? 'Desktop' : 'Mobile'}</div>
                    <div>Force: {forceDesktop ? 'Desktop' : 'Auto'}</div>
                    <div style={{marginTop: '5px', fontSize: '10px'}}>
                        Ctrl/Cmd + D: Toggle debug<br/>
                        Ctrl/Cmd + Shift + D: Force desktop
                    </div>
                </div>
            )}
            
            {/* Render the appropriate component */}
            {shouldShowDesktop ? <LegacyDesktop /> : <Legacy />}
        </>
    );
};

export default LegacyChooser;
