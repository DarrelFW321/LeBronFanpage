export default async function handler(req, res) {
    const url = "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json";
    const { team } = req.query; // Get the team name from query params

    if (!team) {
        return res.status(400).json({ error: "Team name is required" });
    }

    try {
        // Fetch data from the NBA API
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch: ${response.statusText}` });
        }

        const data = await response.json();
        const { leagueSchedule } = data;
        const { gameDates } = leagueSchedule;

        // Flatten games from all dates
        const allGames = gameDates.flatMap((date) => date.games);

        // Filter games for the specified team
        const filteredGames = allGames.filter((game) => {
            const homeTeam = game.homeTeam?.teamName?.toLowerCase();
            const awayTeam = game.awayTeam?.teamName?.toLowerCase();

            // Only include games if the team name is valid and matches
            return (
                (homeTeam && homeTeam === team.toLowerCase()) ||
                (awayTeam && awayTeam === team.toLowerCase())
            );
        });

        // Get the current time and compare
        const currentDate = new Date();
        
        // Filter games for the future and sort by the full date-time
        const upcomingGames = filteredGames
            .filter((game) => {
                const gameDate = new Date(game.gameDateUTC); // Game date in UTC
                const gameTime = new Date(game.gameTimeUTC); // Game time in UTC
                const gameDateTime = new Date(game.gameDateTimeUTC); // Combined date-time

                return gameDateTime > currentDate; // Only future games
            })
            .sort((a, b) => new Date(a.gameDateTimeUTC) - new Date(b.gameDateTimeUTC)) // Sort by combined date-time
            .slice(0, 5); // Get the next 5 games

        // Format the response
        const formattedGames = upcomingGames.map((game) => {
            // Convert UTC times to local time
            const localGameDate = new Date(game.gameDateUTC).toLocaleDateString();
            const localGameTime = new Date(game.gameTimeUTC).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            return {
                gameId: game.gameId,
                date: localGameDate, // Only date part
                time: localGameTime, // Local time
                homeTeam: {
                    name: game.homeTeam.teamName,
                    city: game.homeTeam.teamCity,
                    tricode: game.homeTeam.teamTricode,
                },
                awayTeam: {
                    name: game.awayTeam.teamName,
                    city: game.awayTeam.teamCity,
                    tricode: game.awayTeam.teamTricode,
                },
                arena: game.arenaName,
                city: game.arenaCity,
                broadcasters: game.broadcasters.nationalBroadcasters.map((b) => b.broadcasterDisplay),
                localTime: `${localGameDate} ${localGameTime}`, // Combined local time
            };
        });

        res.status(200).json({ team, games: formattedGames });
    } catch (error) {
        console.error("Error fetching NBA schedule:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

