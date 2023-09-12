import Image from 'next/image';
import React, { useState } from 'react';

const Card = ({ card, onClick, isHovered }) => {
    const [isEnlarged, setIsEnlarged] = useState(false);

    const handleMouseEnter = () => {
        setIsEnlarged(true);
    };

    const handleMouseLeave = () => {
        setIsEnlarged(false);
    };

    return (
        <div
            className={`card ${isEnlarged ? 'enlarged' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <Image
                src={`/cards/${card}.png`}
                alt={`Card ${card}`}
                width={125}
                height={181.5}
            />
        </div>
    );
};

export default Card;
