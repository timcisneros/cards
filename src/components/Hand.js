import React, { useState, useEffect } from 'react';
import Card from './Card';

// Define the preloadImages function here
function preloadImages(cards) {
    const promises = cards.map((card) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                resolve();
            };
            image.onerror = (error) => {
                reject(error);
            };
            image.src = card.imageURL;
        });
    });
    return Promise.all(promises);
}

const Hand = ({ cards = [] }) => {
    // Provide a default empty array for cards
    const minAngleIncrement = 5; // Minimum angle increment.
    const maxRadius = 20; // Maximum radius for the arc.
    const maxCards = 52; // Maximum number of cards before spacing stops increasing.

    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        // Call the preloadImages function and wait for images to load
        preloadImages(cards)
            .then(() => {
                // All card images are preloaded
                setImagesLoaded(true); // Set the state variable to true when images are loaded
            })
            .catch((error) => {
                console.error('Error preloading images:', error);
            });
    }, []); // Empty dependency array means this effect runs once when the component mounts

    // Ensure that cards are defined before calculating totalCards.
    const totalCards = cards ? Math.min(cards.length, maxCards) : 0;

    // Calculate angle increment based on maxRadius and the number of cards.
    const angleIncrement = Math.min(
        minAngleIncrement,
        (maxRadius * Math.PI) / (totalCards * 2 - 2)
    );

    // Calculate the total width of the hand based on the number of cards and angle increment.
    const totalWidth = totalCards * 20; // Adjust card width as needed.
    const cardWidth = 125; // Width of each card container.

    const [hoveredCard, setHoveredCard] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredCard(index);
    };

    const handleMouseLeave = () => {
        setHoveredCard(null);
    };

    const transitionDuration = '0.1s'; // Define the transition duration here.

    return (
        <div className="hands-container">
            {/* First Card Hand */}
            {imagesLoaded ? (
                <>
                    <div className="hand">
                        {cards &&
                            cards.map((card, index) => {
                                const rotation =
                                    (-angleIncrement * (totalCards - 1)) / 2 +
                                    index * angleIncrement;

                                // Calculate x position to evenly distribute the cards.
                                const x =
                                    (index / (totalCards - 1)) * totalWidth -
                                    totalWidth / 2;

                                // Determine the zIndex based on whether the card is hovered or not.
                                let zIndex;
                                if (hoveredCard === null) {
                                    // Initially, cards to the right have higher zIndex.
                                    zIndex = index + 1;
                                } else if (hoveredCard === index) {
                                    // When hovered, the card comes to the very front.
                                    zIndex = totalCards + 1;
                                } else {
                                    // Other cards are below the hovered card.
                                    zIndex = index;
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`card-container ${
                                            hoveredCard === index
                                                ? 'hovered'
                                                : ''
                                        }`}
                                        style={{
                                            transformOrigin: 'center', // Set rotation origin to the center of the card.
                                            transform: `rotate(${
                                                hoveredCard === index
                                                    ? 0
                                                    : rotation
                                            }deg) translate(${
                                                hoveredCard === index &&
                                                index !== cards.length - 1
                                                    ? x - cardWidth / 2
                                                    : // Center the card within its boundary except if it is the last card.
                                                      x
                                            }px, ${
                                                hoveredCard === index ? -30 : 0
                                            }px) `,
                                            zIndex: zIndex,
                                        }}
                                    >
                                        {/* Add a nested div for the card content with the box-shadow */}
                                        <div className="card-content">
                                            <Card card={card} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Second Card Hand (Duplicate) */}
                    <div className="hand-containers">
                        {cards &&
                            cards.map((card, index) => {
                                const rotation = 0;
                                // Calculate x position to evenly distribute the cards.
                                const x =
                                    (index / (totalCards - 1)) * totalWidth -
                                    totalWidth / 2;

                                // Determine the zIndex based on whether the card is hovered or not.
                                let zIndex;
                                if (hoveredCard === null) {
                                    // Initially, cards to the right have higher zIndex.
                                    zIndex = index + 1;
                                } else {
                                    // Other cards are below the hovered card.
                                    zIndex = index;
                                }

                                // Calculate the container height based on hover state.
                                const containerHeight =
                                    hoveredCard === index ? 230 : 181.5;

                                return (
                                    <div
                                        key={index}
                                        className={`card-container ${
                                            hoveredCard === index
                                                ? 'hovered'
                                                : ''
                                        }`}
                                        style={{
                                            transformOrigin: 'center', // Set rotation origin to the center of the card.
                                            transform: `rotate(${rotation}deg) translateX(${x}px)`,
                                            height: `${containerHeight + 15}px`,
                                            zIndex: 1000,
                                            // border: '1px solid blue',
                                        }}
                                        onMouseEnter={() =>
                                            handleMouseEnter(index)
                                        }
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {/* Add a nested div for the card content with the box-shadow */}
                                        <div className="card-content">
                                            {/* Adding 10 to give extra room for container */}
                                            <div
                                                style={{
                                                    width: cardWidth + 10,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </> // Display a loading spinner or message until images are loaded
            ) : (
                <div>Loading...</div>
            )}

            <style jsx>{`
                .hands-container {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column-reverse; /* Place the hands at the bottom */
                }

                .hand {
                    position: absolute;
                    bottom: 15px; /* Adjust the bottom position as needed. */
                    left: 0%; /* Center the entire hand horizontally. */
                    transform-origin: center bottom;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    width: 100%;
                }

                .hand-containers {
                    position: absolute;
                    bottom: 0; /* Adjust the bottom position as needed. */
                    left: 0%; /* Center the entire hand horizontally. */
                    transform-origin: center bottom;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    width: 100%;
                }

                .card-container {
                    cursor: pointer;
                    position: absolute;
                    transform-origin: bottom center;
                    transition: height ${transitionDuration} ease-out,
                        transform ${transitionDuration} ease-out;
                }

                .card-container.hovered {
                    opacity: 0.9;
                    transition: none; // Remove transitions for hovered cards.
                }
            `}</style>
        </div>
    );
};

export default Hand;
