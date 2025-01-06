export default async function handler(req, res) {
  try {
    console.log('Handler started for LeBron James career totals...');

    // Fetching LeBron James' career stats from the NBA API
    const response = await fetch(
      "https://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=Totals&PlayerID=2544",
      {
        headers: {
          Referer: "https://www.nba.com/"
        },
      }
    );

    console.log('Data fetched from the NBA API for LeBron James...');
    if (!response.ok) {
      throw new Error(`NBA API returned status ${response.status}`);
    }

    // Parsing JSON response
    const data = await response.json();
    console.log('Data parsed from the NBA API response...');

    // Extracting result set
    const resultSet = data.resultSets.find((set) => set.name === "SeasonTotalsRegularSeason");
    if (!resultSet) {
      throw new Error('SeasonTotalsRegularSeason data not found in result sets.');
    }
    //console.log('Result set extracted:', resultSet);

    // Extracting career stats
    const headers = resultSet.headers;
    const rows = resultSet.rowSet;
    const careerTotals = rows.map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      return record;
    });

    //console.log('Career totals extracted:', careerTotals);
    const totalPoints = careerTotals.reduce((sum, season) => sum + season.PTS, 0);

    // Sending response
    res.status(200).json({
    totalPoints,
    });
    console.log('Response sent successfully.');
    console.log()
  } catch (error) {
    console.error('Error occurred:', error);

    // Sending error response
    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred.',
    });
  }
}
