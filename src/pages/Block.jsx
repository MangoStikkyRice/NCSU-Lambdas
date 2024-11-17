import React from 'react';
import { Body } from 'react-game-kit';

const Block = ({ x, y, faqText }) => {
    const handleCollision = () => {
        alert(faqText); // Replace with modal or in-game display for better UX
    };

    return (
        <Body
            args={[x, y, 50, 50]} // Block position and size
            onCollision={handleCollision}
            options={{
                isStatic: true,
                restitution: 0.5,
            }}
        >
            <div className="mario-block" style={{ width: '50px', height: '50px', backgroundColor: 'gold' }}>
                ?
            </div>
        </Body>
    );
};

export default Block;
