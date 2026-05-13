const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

const favoriteAsteroids = [];

app.post('/asteroids/favorites', (req, res) => {
    const favoriteAsteroid = req.body;

    if (!favoriteAsteroid) {
        return res.json({message: "No favorite asteroid data provided."});
    }

    favoriteAsteroids.push(favoriteAsteroid);

    res.json({
        message: `${favoriteAsteroid.name} was added to the database.`,
        updatedArray: favoriteAsteroids
    });
});

app.get('/', (req, res) => {
    res.json({ message: "Houston, the Asteroid Tracker server is online!" });
});

app.get('/asteroids', async (req, res) => {
    const response = await fetch('https://api.nasa.gov/neo/rest/v1/feed?start_date=2026-05-11&end_date=2026-05-11&api_key=j7ASJZKYw91SaZmonl9HCLGACh586lgDAH0MoNYd');

    const data = await response.json();

    if (data.error) {
        return res.json({message: "API failed!", details: data.error.message});
    }

    const rawAsteroids = data.near_earth_objects["2026-05-11"];

    const cleanAsteroids = rawAsteroids.map((asteroid) => {
        return {
            name: asteroid.name,
            estimatedDiameter: asteroid.estimated_diameter.meters.estimated_diameter_max,
            potentiallyHazardous: asteroid.is_potentially_hazardous_asteroid
        };
    });

    res.json(cleanAsteroids);
});

app.get('/asteroids/search', async (req, res) => {
    const targetDate = req.query.date;

    if (!targetDate) {
        return res.json({message: "Please provide a date query, e.g., ?date=YYYY-MM-DD" });
    }

    try {
        
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${targetDate}&end_date=${targetDate}&api_key=j7ASJZKYw91SaZmonl9HCLGACh586lgDAH0MoNYd`);

        const data = await response.json();

        const rawAsteroids = data.near_earth_objects[targetDate];

        const cleanAsteroids = rawAsteroids.map((asteroid) => {
            return {
                name: asteroid.name,
                estimatedDiameter: asteroid.estimated_diameter.meters.estimated_diameter_max,
                potentiallyHazardous: asteroid.is_potentially_hazardous_asteroid
            };
        });

        res.json(cleanAsteroids);
    }
    catch (error) {
        res.json({error: "Failed to fetch today's asteroid data."});
    }
});

app.get('/asteroids/:id', async (req, res) => {
    const asteroidID = req.params.id;

    if (!asteroidID) {
        return res.json({error: "Mission aborted: No asteroid ID provided"});
    }
    
    try {

        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${asteroidID}?api_key=j7ASJZKYw91SaZmonl9HCLGACh586lgDAH0MoNYd`);

        const data = await response.json();

        res.json({
            name: data.name,
            absoluteMagnitudeH: data.absolute_magnitude_h,
            potentiallyHazardous: data.is_potentially_hazardous_asteroid
        });
    }
    catch (error) {
        res.json({error: "Failed to fetch specific asteroid data." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is orbiting on http://localhost:${PORT}'`);
});