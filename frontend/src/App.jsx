import { useState, useEffect } from 'react';

function App() {
    const [asteroids, setAsteroids] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/asteroids')
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend:", data);
                setAsteroids(data);
            })
            .catch(err => console.error("Network error:", err));
    }, []);

    return (
        <div>
            <h1>Asteroid Dashboard</h1>

            <h2>Today's Asteroids</h2>

            {asteroids.map((asteroid) => (
                <div key={asteroid.name}>
                    <h2>{asteroid.name}</h2>
                    <p>Hazardous: {asteroid.potentiallyHazardous.toString()}</p>
                </div>
            ))}


        </div>
    )

}

export default App;