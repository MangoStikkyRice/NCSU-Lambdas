import React, { useState } from 'react';
import { Loop, Stage, World, Body } from 'react-game-kit';
import Player from './Player'; // Custom player component
import Block from './Block'; // Custom block component

const RecruitmentRELOADED = () => {
    const [scene, setScene] = useState("outside"); // Track scene (outside or cave)

    // Switch to cave scene on player reaching a specific point
    const handleSceneTransition = (playerX) => {
        if (scene === "outside" && playerX > 700) { // Change condition based on map design
            setScene("cave");
        }
    };

    return (
        <Loop>
            <Stage width={800} height={400}>
                <World>
                    {/* Backgrounds for Outside and Cave scenes */}
                    {scene === "outside" && (
                        <div className="background-outside"></div>
                    )}
                    {scene === "cave" && (
                        <div className="background-cave"></div>
                    )}

                    {/* Player Component with Scene Transition */}
                    <Player onSceneTransition={handleSceneTransition} />

                    {/* Blocks that reveal FAQs */}
                    {scene === "outside" ? (
                        <>
                            <Block x={200} y={300} faqText="Welcome to the journey!" />
                            <Block x={400} y={250} faqText="Keep going to find the cave!" />
                        </>
                    ) : (
                        <>
                            <Block x={150} y={300} faqText="You found the cave!" />
                            <Block x={300} y={250} faqText="Explore deeper for more secrets." />
                        </>
                    )}
                </World>
            </Stage>
        </Loop>
    );
};

export default RecruitmentRELOADED;
