import { useState, useEffect } from 'react';

function App() {
    const [asteroids, setAsteroids] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/asteroids')
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend (asteroids):", data);
                setAsteroids(data);
            })
            .catch(err => console.error("Network error:", err));
        
        fetch('http://localhost:3000/asteroids/favorites')
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend (favorites):", data);
                setFavorites(data);
            })
            .catch(err => console.error("Network error:", err));
    }, []);

    const handleSaveAsteroid = (asteroid) => {
        fetch('http://localhost:3000/asteroids/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: asteroid.name,
                potentiallyHazardous: asteroid.potentiallyHazardous
            })
        })
        .then(res => res.json())
        .then(data => console.log("Success! Server says: ", data))
        .then(setFavorites(prevFavorites => [...prevFavorites, asteroid]))
        .catch(err => console.error("Failed to add:", err));
    };

    return (
        <div>
            <h1>Asteroid Dashboard</h1>

            <h2>Today's Asteroids</h2>

            {asteroids.map((asteroid) => (
                <div key={asteroid.name}>
                    <h2>{asteroid.name}</h2>
                    <p>Hazardous: {asteroid.potentiallyHazardous.toString()}</p>

                    <button onClick={() => handleSaveAsteroid(asteroid)}>
                        Favorite
                    </button>
                </div>
            ))}

            <h2>My Favorite Asteroids</h2>

            {favorites.map((asteroid) => (
                <div key={asteroid.name}>
                    <h2>{asteroid.name}</h2>
                </div>
            ))}

        </div>
    )

}

export default App;