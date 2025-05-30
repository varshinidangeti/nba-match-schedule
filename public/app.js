document.getElementById('load-btn').addEventListener('click', () => {
    const dateInput = document.getElementById('match-date').value;
    if (!dateInput) {
        alert('Please select a date.');
        return;
    }

    fetchMatches(dateInput);
});

const teamNames = {
    1610612737: "Atlanta Hawks", 1610612738: "Boston Celtics", 1610612751: "Brooklyn Nets",
    1610612766: "Charlotte Hornets", 1610612741: "Chicago Bulls", 1610612739: "Cleveland Cavaliers",
    1610612742: "Dallas Mavericks", 1610612743: "Denver Nuggets", 1610612765: "Detroit Pistons",
    1610612744: "Golden State Warriors", 1610612745: "Houston Rockets", 1610612754: "Indiana Pacers",
    1610612746: "LA Clippers", 1610612747: "Los Angeles Lakers", 1610612763: "Memphis Grizzlies",
    1610612748: "Miami Heat", 1610612749: "Milwaukee Bucks", 1610612750: "Minnesota Timberwolves",
    1610612740: "New Orleans Pelicans", 1610612752: "New York Knicks", 1610612760: "OKC Thunder",
    1610612753: "Orlando Magic", 1610612755: "Philadelphia 76ers", 1610612756: "Phoenix Suns",
    1610612757: "Portland Trail Blazers", 1610612758: "Sacramento Kings", 1610612759: "San Antonio Spurs",
    1610612761: "Toronto Raptors", 1610612762: "Utah Jazz", 1610612764: "Washington Wizards"
};

async function fetchMatches(date) {
    const loader = document.getElementById('loader');
    const container = document.getElementById('matches-container');
    const errorBox = document.getElementById('error-container');

    loader.style.display = 'block';
    container.innerHTML = '';
    errorBox.innerHTML = '';

    try {
        const response = await fetch(`/api/matches?date=${date}`);
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const gameSet = data.resultSets.find(set => set.name === 'GameHeader');
        const headers = gameSet.headers;
        const games = gameSet.rowSet;

        if (games.length === 0) {
            container.innerHTML = '<p>No games scheduled for this date.</p>';
        } else {
            const matches = games.map(row => {
                const obj = {};
                headers.forEach((h, i) => obj[h] = row[i]);

                return {
                    gameId: obj.GAME_ID,
                    homeTeamId: obj.HOME_TEAM_ID,
                    awayTeamId: obj.VISITOR_TEAM_ID,
                    homeScore: obj.PTS_HOME,
                    awayScore: obj.PTS_VISITOR,
                    gameTime: obj.GAME_STATUS_TEXT
                };
            });

            displayMatches(matches);
        }
    } catch (err) {
        console.error('Using sample data due to error:', err);
        errorBox.textContent = 'Unable to load live data. Showing sample data.';
        displayMatches(sampleMatches); // fallback to sampleMatches
    } finally {
        loader.style.display = 'none';
    }
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    container.innerHTML = '';

    matches.forEach(match => {
        const isLiveData = match.homeTeamId !== undefined;

        const homeTeam = isLiveData
            ? teamNames[match.homeTeamId] || match.homeTeamId
            : match.homeTeam;

        const awayTeam = isLiveData
            ? teamNames[match.awayTeamId] || match.awayTeamId
            : match.awayTeam;
        let scoreLine = '';
if (match.homeScore !== undefined && match.awayScore !== undefined) {
    scoreLine = `${match.awayScore} - ${match.homeScore}`;
} else if (match.gameTime.includes("Final")) {
    scoreLine = "Final score not available";
} else if (match.gameTime.includes("PM") || match.gameTime.includes("AM")) {
    scoreLine = "Game not started";
} else {
    scoreLine = match.gameTime; // fallback
}
 
        


        const div = document.createElement('div');
        div.className = 'match-card';
        div.innerHTML = `
            <h3>${awayTeam} @ ${homeTeam}</h3>
            <p><strong>Score:</strong> ${scoreLine}</p>
            <p><strong>Status:</strong> ${match.gameTime}</p>
        `;
        container.appendChild(div);
    });
}
