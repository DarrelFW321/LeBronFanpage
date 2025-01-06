import axios from 'axios';
import * as cheerio from 'cheerio';

interface GameData {
  date: string;
  team: string;
  opponent: string;
  result: string;
  mp: string;
  fg: string;
  fga: string;
  fgPercent: string;
  threeP: string;
  threePA: string;
  threePPercent: string;
  ft: string;
  fta: string;
  ftPercent: string;
  orb: string;
  drb: string;
  trb: string;
  ast: string;
  stl: string;
  blk: string;
  tov: string;
  pf: string;
  pts: string;
  gmSc: string;
  plusMinus: string;
}

export default async function handler(req, res) {
  try {
    // Step 1: Fetch the page content from LeBron's game log on Basketball Reference
    const response = await axios.get('https://www.basketball-reference.com/players/j/jamesle01.html');

    if (response.status !== 200) {
      throw new Error('Failed to fetch data from Basketball Reference');
    }

    // Step 2: Load the HTML content using Cheerio
    const $ = cheerio.load(response.data);

    // Step 3: Select the game log rows and map the last 5 games
    const last5Games: GameData[] = []; // Typed as GameData[]
    const rows = $('tr'); // Select all rows in the table

    // Iterate over rows and collect only game rows
    for (let i = 0; i < rows.length && last5Games.length < 5; i++) {
      const row = rows[i];
      const columns = $(row).find('td');

      // Check if row contains game data (skip non-game rows, headers, or empty rows)
      if (columns.length === 26) {
        const gameData: GameData = {
          date: $(row).find('[data-stat="date"] a').text(), // Game date
          team: $(row).find('[data-stat="team_name_abbr"] a').text(), // Team
          opponent: $(row).find('[data-stat="opp_name_abbr"] a').text(), // Opponent
          result: $(row).find('[data-stat="game_result"]').text(), // Result
          mp: $(columns[5]).text(), // Minutes Played
          fg: $(columns[6]).text(), // Field Goals Made
          fga: $(columns[7]).text(), // Field Goals Attempted
          fgPercent: $(columns[8]).text(), // Field Goal Percentage
          threeP: $(columns[9]).text(), // Three-Point Made
          threePA: $(columns[10]).text(), // Three-Point Attempts
          threePPercent: $(columns[11]).text(), // Three-Point Percentage
          ft: $(columns[12]).text(), // Free Throws Made
          fta: $(columns[13]).text(), // Free Throws Attempted
          ftPercent: $(columns[14]).text(), // Free Throw Percentage
          orb: $(columns[15]).text(), // Offensive Rebounds
          drb: $(columns[16]).text(), // Defensive Rebounds
          trb: $(columns[17]).text(), // Total Rebounds
          ast: $(columns[18]).text(), // Assists
          stl: $(columns[19]).text(), // Steals
          blk: $(columns[20]).text(), // Blocks
          tov: $(columns[21]).text(), // Turnovers
          pf: $(columns[22]).text(), // Personal Fouls
          pts: $(columns[23]).text(), // Points
          gmSc: $(columns[24]).text(), // Game Score
          plusMinus: $(columns[25]).text(), // Plus/Minus
        };

        last5Games.push(gameData);

        console.log(`Game ${last5Games.length}:`, gameData);
      }
    }

    // Step 4: Return the last 5 games data as a response
    res.status(200).json(last5Games);
  } catch (error) {
    console.error('Error fetching LeBron\'s last 5 games:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred.',
    });
  }
}
