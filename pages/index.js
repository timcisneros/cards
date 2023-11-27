import React, { useState } from 'react';
import Hand from '../src/components/Hand';
import Head from 'next/head';

const deck = Array.from({ length: 52 }, (_, i) => i + 1);

export default function Home() {
    const [hand, setHand] = useState([]);

    const drawCard = () => {
        if (deck.length === 0) {
            alert('No more cards in the deck!');
            return;
        }

        const randomIndex = Math.floor(Math.random() * deck.length);
        const drawnCard = deck.splice(randomIndex, 1)[0];
        setHand([...hand, drawnCard]);
    };

    return (
        <>
            <Head>
                <title>Cards</title>
            </Head>
            <div className="container">
                <button onClick={drawCard}>Draw a Card</button>
                <Hand cards={hand} />
                <style jsx>{`
                    .container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-top: 20px;
                    }

                    button {
                        font-size: 18px;
                        padding: 10px 20px;
                        background-color: #0070f3;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                `}</style>
            </div>
        </>
    );
}
