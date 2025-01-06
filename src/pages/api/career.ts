
export default async function handler(req, res) {
  try {
    console.log("Fetching player data...");

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    // NBA Stats API URL for career stats
    const url = "https://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=Totals&PlayerID=2544"; // LeBron James' PlayerID

    // Fetch the data from the NBA Stats API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://www.nba.com/',
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch career totals: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract CareerTotalsRegularSeason fields
    const regularSeasonSet = data.resultSets.find(set => set.name === 'CareerTotalsRegularSeason');
    const postseasonSet = data.resultSets.find(set => set.name === 'CareerTotalsPostSeason');

    if (!regularSeasonSet) {
      throw new Error('CareerTotalsRegularSeason data not found');
    }

    if (!postseasonSet) {
      throw new Error('CareerTotalsPostSeason data not found');
    }

    // Map headers to rowSet values for Regular Season
    const regularSeasonHeaders = regularSeasonSet.headers;
    const regularSeasonRow = regularSeasonSet.rowSet[0];
    const careerTotalsRegular = regularSeasonHeaders.reduce((acc, header, index) => {
      acc[header] = regularSeasonRow[index];
      return acc;
    }, {});

    // Map headers to rowSet values for Post Season
    const postseasonHeaders = postseasonSet.headers;
    const postseasonRow = postseasonSet.rowSet[0];
    const careerTotalsPostSeason = postseasonHeaders.reduce((acc, header, index) => {
      acc[header] = postseasonRow[index];
      return acc;
    }, {});

    // Clean up the data to match the desired structure
    const cleanedData = {
      regularSeason: {
        points: careerTotalsRegular.PTS,
        rebounds: careerTotalsRegular.REB,
        assists: careerTotalsRegular.AST,
        steals: careerTotalsRegular.STL,
        blocks: careerTotalsRegular.BLK,
        gamesPlayed: careerTotalsRegular.GP,
        fieldGoalPercentage: careerTotalsRegular.FG_PCT,
        threePointPercentage: careerTotalsRegular.FG3_PCT,
        freeThrowPercentage: careerTotalsRegular.FT_PCT,
        minutes: careerTotalsRegular.MIN,
      },
      postSeason: {
        points: careerTotalsPostSeason.PTS,
        rebounds: careerTotalsPostSeason.REB,
        assists: careerTotalsPostSeason.AST,
        steals: careerTotalsPostSeason.STL,
        blocks: careerTotalsPostSeason.BLK,
        gamesPlayed: careerTotalsPostSeason.GP,
        fieldGoalPercentage: careerTotalsPostSeason.FG_PCT,
        threePointPercentage: careerTotalsPostSeason.FG3_PCT,
        freeThrowPercentage: careerTotalsPostSeason.FT_PCT,
        minutes: careerTotalsPostSeason.MIN,
      },
    };

    console.log("Player data fetched successfully:", cleanedData);

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error("Error fetching player data:", error);

    res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }
}
