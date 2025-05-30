const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public')); // <== Serve frontend from /public

app.get('/api/matches', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Missing required date parameter (YYYY-MM-DD)' });
    }

    const url = `https://stats.nba.com/stats/scoreboardV2?DayOffset=0&LeagueID=00&gameDate=${date}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://www.nba.com/',
                'Origin': 'https://www.nba.com'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('NBA API fetch failed:', error);
        res.status(500).json({ error: 'Failed to fetch NBA data from stats.nba.com' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.listen(PORT, () => {
    console.log(`NBA API Proxy is running at http://localhost:${PORT}`);
});
