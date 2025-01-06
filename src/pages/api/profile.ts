interface PlayerData {
  FIRST_NAME: string;
  LAST_NAME: string;
  TEAM_NAME: string;
  JERSEY: string;
  POSITION: string;
  PPG: number;
  RPG: number;
  APG: number;
  PIE: number;
  HEIGHT: string;
  WEIGHT: string;
  COUNTRY: string;
  LAST_AFFILIATION: string;
  AGE: string;
  BIRTHDATE: string;
  DRAFT_YEAR?: string;
  DRAFT_ROUND?: string;
  DRAFT_NUMBER?: string;
  SEASON_EXP: string;
}

export default async function handler(req, res) {
  try {
    console.log("Fetching player data...");

    const response = await fetch(
      "https://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID=2544", // LeBron James' PlayerID
      {
        headers: {
          Referer: "https://www.nba.com/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NBA API returned status ${response.status}`);
    }

    const data = await response.json();
    const playerInfo = data.resultSets.find((set) => set.name === "CommonPlayerInfo");
    const playerStats = playerInfo.rowSet[0]; // Single row for LeBron's data
    const headers = playerInfo.headers;

    // Create a playerData object with Partial<PlayerData> to allow optional properties
    const playerData: Partial<PlayerData> = {}; 
    headers.forEach((header, index) => {
      playerData[header] = playerStats[index];
    });

    // Building a cleaned-up response object
    const cleanedData = {
      name: `${playerData.FIRST_NAME} ${playerData.LAST_NAME}`,
      team: playerData.TEAM_NAME,
      jersey: playerData.JERSEY,
      position: playerData.POSITION,
      ppg: playerData.PPG,
      rpg: playerData.RPG,
      apg: playerData.APG,
      pie: playerData.PIE,
      height: playerData.HEIGHT,
      weight: playerData.WEIGHT,
      country: playerData.COUNTRY,
      lastAttended: playerData.LAST_AFFILIATION,
      age: playerData.AGE,
      birthdate: playerData.BIRTHDATE,
      draft: playerData.DRAFT_YEAR
        ? `${playerData.DRAFT_YEAR} R${playerData.DRAFT_ROUND} Pick ${playerData.DRAFT_NUMBER}`
        : "Undrafted",
      experience: `${playerData.SEASON_EXP} Years`,
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