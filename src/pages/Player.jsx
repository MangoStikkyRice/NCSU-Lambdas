import React, { useEffect, useRef } from 'react';
import { Body } from 'react-game-kit';

const Player = ({ onSceneTransition }) => {
    const playerRef = useRef(null);

    useEffect(() => {
        const updatePlayer = () => {
            const { position } = playerRef.current.body;
            onSceneTransition(position.x); // Pass player x position for scene transition
        };
        const interval = setInterval(updatePlayer, 50);
        return () => clearInterval(interval);
    }, [onSceneTransition]);

    return (
        <Body
            args={[50, 300, 50, 50]} // x, y, width, height
            ref={playerRef}
            options={{
                restitution: 0.5,
                friction: 0.8,
            }}
        >
            <div className="player" style={{ width: '50px', height: '50px', backgroundColor: 'red' }} />
        </Body>
    );
};

export default Player;
