import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { getPosts } from '@/app/utils/utils'
import { AvatarGroup, Button, Flex, Heading, SmartImage, Text, SmartLink } from '@/once-ui/components'
import { baseURL, renderContent } from '@/app/resources';
import { routing } from '@/i18n/routing';
import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/app/utils/formatDate';
import ScrollToHash from '@/components/ScrollToHash';
import { HeadingLink } from '@/components';
import axios from 'axios';
import * as cheerio from 'cheerio';

const PLAYER_URL = "https://www.basketball-reference.com/players/j/jamesle01.html"; // LeBron James' page


interface WorkParams {
    params: {
        slug: string;
		locale: string;
    };
}

interface Team {
    teamName: string;
    teamCity: string;
    teamTricode: string;
  }
  
  interface Broadcaster {
    broadcasterDisplay: string;
  }
  
  interface Game {
    gameId: string;
    gameDateUTC: string;
    gameTimeUTC: string;
    gameDateTimeUTC: string;
    homeTeam: Team;
    awayTeam: Team;
    arenaName: string;
    arenaCity: string;
    broadcasters: {
      nationalBroadcasters: Broadcaster[];
    };
  }
  
  interface GameDate {
    games: Game[];
  }
  
  interface LeagueSchedule {
    gameDates: GameDate[];
  }
  
  interface ApiResponse {
    leagueSchedule: LeagueSchedule;
  }

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

export async function generateStaticParams(): Promise<{ slug: string; locale: string }[]> {
	const locales = routing.locales;
    
    // Create an array to store all posts from all locales
    const allPosts: { slug: string; locale: string }[] = [];

    // Fetch posts for each locale
    for (const locale of locales) {
        const posts = getPosts(['src', 'app', '[locale]', 'stats', 'projects', locale]);
        allPosts.push(...posts.map(post => ({
            slug: post.slug,
            locale: locale,
        })));
    }

    return allPosts;
}

export function generateMetadata({ params: { slug, locale } }: WorkParams) {
	let post = getPosts(['src', 'app', '[locale]', 'stats', 'projects', locale]).find((post) => post.slug === slug)
	
	if (!post) {
		return
	}

	let {
		title,
		publishedAt: publishedTime,
		summary: description,
		images,
		image,
		team,
		components,
	} = post.metadata
	let ogImage = image
		? `https://${baseURL}${image}`
		: `https://${baseURL}/og?title=${title}`;
	
	return {
		title,
		images,
		team,
		components,
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime,
			url: `https://${baseURL}/${locale}/stats/${post.slug}`,
			images: [
				{
					url: ogImage,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	}
}

const fetchCareerStats = async () => {
    const url = 'https://www.nbcsports.com/nba/lebron-james/9844/stats';

    try {
      // Fetch the HTML content of the page
      const { data } = await axios.get(url);
      
      // Load the HTML data into Cheerio
      const $ = cheerio.load(data);
  
      // Extract Career Stats (last row in <tfoot>)
      const careerStatsRow = $('tfoot tr').last();
  
      const careerStats = {
        games: careerStatsRow.find('td').eq(2).text().trim(), // G
        minutes: careerStatsRow.find('td').eq(3).text().trim(), // MIN
        points: careerStatsRow.find('td').eq(4).text().trim(), // PTS
        rebounds: careerStatsRow.find('td').eq(5).text().trim(), // REB
        offensiveRebounds: careerStatsRow.find('td').eq(6).text().trim(), // OREB
        assists: careerStatsRow.find('td').eq(7).text().trim(), // AST
        steals: careerStatsRow.find('td').eq(8).text().trim(), // STL
        blocks: careerStatsRow.find('td').eq(9).text().trim(), // BLK
        fouls: careerStatsRow.find('td').eq(10).text().trim(), // PF
        turnovers: careerStatsRow.find('td').eq(11).text().trim(), // TO
        fieldGoalsMade: careerStatsRow.find('td').eq(12).text().trim(), // FGM
        fieldGoalsAttempted: careerStatsRow.find('td').eq(13).text().trim(), // FGA
        fieldGoalPercentage: careerStatsRow.find('td').eq(14).text().trim(), // FG%
        threePointersMade: careerStatsRow.find('td').eq(15).text().trim(), // 3PTM
        threePointersAttempted: careerStatsRow.find('td').eq(16).text().trim(), // 3PTA
        threePointPercentage: careerStatsRow.find('td').eq(17).text().trim(), // 3PT%
        freeThrowsMade: careerStatsRow.find('td').eq(18).text().trim(), // FTM
        freeThrowsAttempted: careerStatsRow.find('td').eq(19).text().trim(), // FTA
        freeThrowPercentage: careerStatsRow.find('td').eq(20).text().trim(), // FT%
      };
  
      // Extract Current Season Stats (second row in <tfoot>)
      const currentSeasonStatsRow = $('tfoot tr').eq(1); // Second row
  
      const currentSeasonStats = {
        games: currentSeasonStatsRow.find('td').eq(2).text().trim(), // G
        minutes: currentSeasonStatsRow.find('td').eq(3).text().trim(), // MIN
        points: currentSeasonStatsRow.find('td').eq(4).text().trim(), // PTS
        rebounds: currentSeasonStatsRow.find('td').eq(5).text().trim(), // REB
        offensiveRebounds: currentSeasonStatsRow.find('td').eq(6).text().trim(), // OREB
        assists: currentSeasonStatsRow.find('td').eq(7).text().trim(), // AST
        steals: currentSeasonStatsRow.find('td').eq(8).text().trim(), // STL
        blocks: currentSeasonStatsRow.find('td').eq(9).text().trim(), // BLK
        fouls: currentSeasonStatsRow.find('td').eq(10).text().trim(), // PF
        turnovers: currentSeasonStatsRow.find('td').eq(11).text().trim(), // TO
        fieldGoalsMade: currentSeasonStatsRow.find('td').eq(12).text().trim(), // FGM
        fieldGoalsAttempted: currentSeasonStatsRow.find('td').eq(13).text().trim(), // FGA
        fieldGoalPercentage: currentSeasonStatsRow.find('td').eq(14).text().trim(), // FG%
        threePointersMade: currentSeasonStatsRow.find('td').eq(15).text().trim(), // 3PTM
        threePointersAttempted: currentSeasonStatsRow.find('td').eq(16).text().trim(), // 3PTA
        threePointPercentage: currentSeasonStatsRow.find('td').eq(17).text().trim(), // 3PT%
        freeThrowsMade: currentSeasonStatsRow.find('td').eq(18).text().trim(), // FTM
        freeThrowsAttempted: currentSeasonStatsRow.find('td').eq(19).text().trim(), // FTA
        freeThrowPercentage: currentSeasonStatsRow.find('td').eq(20).text().trim(), // FT%
      };
  
      // Return the extracted stats as a JSON response
      return {
        careerStats,
        currentSeasonStats
      };
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return null;
    }
};

const fetchRecentGames = async () => {
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
    return last5Games;
  } catch (error) {
    console.error('Error fetching LeBron\'s last 5 games:', error);
    return null;
  }
};

const fetchTeam = async () => {
    try {
            console.log("Fetching player profile from Basketball Reference...");
        
            // Fetch the HTML of the player profile page
            const response = await fetch(PLAYER_URL, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
              }, cache: "no-store"
            });
        
            if (!response.ok) {
              throw new Error(`Failed to fetch player profile: ${response.statusText}`);
            }
        
            // Load the HTML into Cheerio for parsing
            const html = await response.text();
            const $ = cheerio.load(html);
    
            // Extract other information
            const team = $("p:contains('Team') a").text().trim(); // Los Angeles Lakers
        
            console.log("Player team fetched successfully:", team);
        
            return team;
          } catch (error) {
            console.error("Error fetching player team:", (error as Error).message);
            return null;
          }
};

const fetchUpcomingGames = async (team) => {
      // Updated handler function
        try {
          const url = "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json";
      
          // Fetch data from the NBA API
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
              Accept: "application/json, text/plain, */*",
            },
          });
      
          if (!response.ok) {
            console.log("failed to fetch upcoming games");
            return null;
          }
      
          const data: ApiResponse = await response.json();

          const { leagueSchedule } = data;
          const { gameDates } = leagueSchedule;
      
          // Flatten games from all dates
          const allGames: Game[] = gameDates.flatMap((date: GameDate) => date.games);
          
          const extractLastWord = (name = "lakers") => (name || "lakers").trim().split(" ").pop()?.toLowerCase() || "";
          // Filter games for the specified team
          const filteredGames: Game[] = allGames.filter((game: Game) => {
            const homeTeam = game.homeTeam?.teamName?.toLowerCase();
            const awayTeam = game.awayTeam?.teamName?.toLowerCase();
            const searchTeam = extractLastWord(team); // Extract last word from input team name
      
            // Only include games if the team name is valid and matches

            return homeTeam === searchTeam || awayTeam === searchTeam;
          });
      
          // Get the current time and compare
          const currentDate = new Date();
      
          // Filter games for the future and sort by the full date-time
          const upcomingGames: Game[] = filteredGames
            .filter((game: Game) => {
              const gameDateTime = new Date(game.gameDateTimeUTC); // Combined date-time
              return gameDateTime > currentDate; // Only future games
            })
            .sort((a: Game, b: Game) => {
              const dateA = new Date(a.gameDateTimeUTC).getTime();
              const dateB = new Date(b.gameDateTimeUTC).getTime();
              return dateA - dateB; // Sort by combined date-time in milliseconds
            })
            .slice(0, 5); // Get the next 5 games
      
          // Format the response
          const formattedGames = upcomingGames.map((game: Game) => {
            // Convert UTC times to local time
            const localGameDate = new Date(game.gameDateUTC).toLocaleDateString();
            const localGameTime = new Date(game.gameTimeUTC).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
      
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
              broadcasters: game.broadcasters.nationalBroadcasters.map((b: Broadcaster) => b.broadcasterDisplay),
              localTime: `${localGameDate} ${localGameTime}`, // Combined local time
            };
          });
          return formattedGames;
        } catch (error) {
          console.error("Error fetching NBA schedule:", error);
          return null;
        }
};

async function FiveUpcomingGames() {
    // Fetch the team name
    const team = await fetchTeam();  // Assuming this function will return the team name (e.g., 'lakers')

    // Fetch the upcoming games for the team
    const games = await fetchUpcomingGames(team);  // Fetch the next 5 games
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        timeZoneName: 'short',
    });

    console.log(games);

    const gameCard = (game) => (
        <div style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'var(--color-surface-default)',
        }}>
            <h2 style={{
                marginBottom: '12px',
                color: 'var(--color-text-primary)',
            }}>
                <span style={{
                    fontWeight: 'bold',
                    color: 'var(--color-text-primary)',
                }}>
                    {game.homeTeam.city}
                </span>
                {' vs '}
                <span style={{
                    fontWeight: 'bold',
                    color: 'var(--color-text-primary)',
                }}>
                    {game.awayTeam.city}
                </span>
            </h2>
            <p style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                marginBottom: '6px',
            }}>
                <strong>{game.localTime}</strong>
            </p>
            <p style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                marginBottom: '6px',
            }}>
                Arena: {game.arena}, {game.city}
            </p>
            <p style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                marginBottom: '6px',
            }}>
                Broadcasters: {game.broadcasters.length ? game.broadcasters.join(', ') : 'No Broadcaster Information Available'}
            </p>
        </div>
    );

    return (
        <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-background-default)',
        }}>
            <h1 style={{
                marginBottom: '24px',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
            }}>
                Next 5 Upcoming Games
            </h1>
            <p style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginBottom: '32px',
            }}>
                Updated as of {formattedDate}
            </p>
            {games && games.length > 0 ? (
                games.map((game, index) => gameCard(game))
            ) : (
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No upcoming games available.</p>
            )}
        </div>
    );
}

async function LiveTotalStats() {
    let data = await fetchCareerStats();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const statsCard = (title, stats) => (
        <div style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 style={{
                marginBottom: '12px',
                color: 'var(--color-text-primary)'
            }}>
                {title}
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Object.entries(stats).map(([key, value]) => (
                    <li key={key} style={{
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'var(--color-text-secondary)',
                        fontSize: '14px'
                    }}>
                        <strong style={{ color: 'var(--color-text-primary)' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                        </strong>
                        <span>{(typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value) as React.ReactNode}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    // Extracted data for regular season stats (career and current season)
    const careerSeasonStats = {
        Points: data?.careerStats?.points ?? 0,
        Rebounds: data?.careerStats?.rebounds ?? 0,
        Assists: data?.careerStats?.assists ?? 0,
        Steals: data?.careerStats?.steals ?? 0,
        Blocks: data?.careerStats?.blocks ?? 0,
        "Games Played": data?.careerStats?.games ?? 0,
        "Field Goal Percentage": data?.careerStats?.fieldGoalPercentage ?? 0,
        "Three-Point Percentage": data?.careerStats?.threePointPercentage ?? 0,
        "Free Throw Percentage": data?.careerStats?.freeThrowPercentage ?? 0,
        Minutes: data?.careerStats?.minutes ?? 0,
    };
    
    const currentSeasonStats = {
        Points: data?.currentSeasonStats?.points ?? 0,
        Rebounds: data?.currentSeasonStats?.rebounds ?? 0,
        Assists: data?.currentSeasonStats?.assists ?? 0,
        Steals: data?.currentSeasonStats?.steals ?? 0,
        Blocks: data?.currentSeasonStats?.blocks ?? 0,
        "Games Played": data?.currentSeasonStats?.games ?? 0,
        "Field Goal Percentage": data?.currentSeasonStats?.fieldGoalPercentage ?? 0,
        "Three-Point Percentage": data?.currentSeasonStats?.threePointPercentage ?? 0,
        "Free Throw Percentage": data?.currentSeasonStats?.freeThrowPercentage ?? 0,
        Minutes: data?.currentSeasonStats?.minutes ?? 0,
    };

    return (
        <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-background-default)'
        }}>
            <h1 style={{
                marginBottom: '24px',
                color: 'var(--color-text-primary)',
                textAlign: 'center'
            }}>
                Career and Current Season Statistics
            </h1>
            <p style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginBottom: '32px'
            }}>
                Updated as of {formattedDate}
            </p>
            {statsCard("Career Season Totals", careerSeasonStats)}
            {statsCard("Current Season Totals", currentSeasonStats)}
        </div>
    );
}


async function LastFiveGamesStats() {
    let games = await fetchRecentGames();

    console.log("Games fetched:", games);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const gameCard = (game) => (
        <div style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'var(--color-surface-default)',
        }}>
            <h2 style={{
                marginBottom: '12px',
                color: 'var(--color-text-primary)',
            }}>
                <span style={{
                    fontWeight: 'bold',
                    color: 'var(--color-text-primary)',
                }}>
                    LeBron
                </span>
                {' vs '}
                <span style={{
                    fontWeight: 'bold',
                    color: 'var(--color-text-primary)',
                }}>
                    {game.opponent}
                </span>
            </h2>
            <h2 style={{
                marginBottom: '12px',
                color: 'var(--color-text-primary)',
            }}>
                <span style={{
                    fontWeight: 'bold',
                    color: 'var(--color-texx    t-primary)',
                }}>
                    {game.result}
                </span>
            </h2>
            <p style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                marginBottom: '6px',
            }}>
                <strong>{game.date}</strong>
            </p>
            
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '16px',
            }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Minutes Played:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.mp}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Field Goals:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.fg}/{game.fga} ({(parseFloat(game.fgPercent) * 100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>3-Point:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.threeP}/{game.threePA} ({(parseFloat(game.threePPercent) * 100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Free Throws:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.ft}/{game.fta} ({(parseFloat(game.ftPercent) * 100).toFixed(1)}%)</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Offensive Rebounds:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.orb}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Defensive Rebounds:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.drb}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Total Rebounds:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.trb}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Assists:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.ast}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Steals:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.stl}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Blocks:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.blk}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Turnovers:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.tov}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Personal Fouls:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.pf}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Points:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.pts}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-default)' }}><strong>Game Score:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid var(--color-border-default)' }}>{game.gmSc}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px' }}><strong>Plus/Minus:</strong></td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{game.plusMinus}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-background-default)',
        }}>
            <h1 style={{
                marginBottom: '24px',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
            }}>
                Last 5 Games Stats
            </h1>
            <p style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginBottom: '32px',
            }}>
                Updated as of {formattedDate}
            </p>
            {games && games.slice(0, 5).map(game => gameCard(game))}
        </div>
    );
}


export default async function Project({ params }: WorkParams) {
	unstable_setRequestLocale(params.locale);
	let post = getPosts(['src', 'app', '[locale]', 'stats', 'projects', params.locale]).find((post) => post.slug === params.slug)

	if (!post) {
		notFound()
	}

	const renderComponent = (componentName: string) => {
        switch (componentName) {
            case "LiveTotalStats":
                return <LiveTotalStats />;
            case "LastFiveGamesStats":
                return <LastFiveGamesStats />;
            case "FiveUpcomingGames":
                return <FiveUpcomingGames/>;
            default:
                return null;
        }
    };

	console.log (post.metadata);
	const { person } = renderContent();

	const avatars = post.metadata.team?.map((person) => ({
        src: person.avatar,
    })) || [];

	return (
		<Flex as="section"
			fillWidth maxWidth="m"
			direction="column" alignItems="center"
			gap="l">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.metadata.title,
						datePublished: post.metadata.publishedAt,
						dateModified: post.metadata.publishedAt,
						description: post.metadata.summary,
						image: post.metadata.image
							? `https://${baseURL}${post.metadata.image}`
							: `https://${baseURL}/og?title=${post.metadata.title}`,
							url: `https://${baseURL}/${params.locale}/stats/${post.slug}`,
						author: {
							'@type': 'Person',
							name: person.name,
						},
					}),
				}}
			/>
			<Flex
				fillWidth maxWidth="xs" gap="16"
				direction="column">
				<Button
					href={`/${params.locale}/stats`}
					variant="tertiary"
					size="s"
					prefixIcon="chevronLeft">
					Stats
				</Button>
				<Heading
					variant="display-strong-s">
					{post.metadata.title}
				</Heading>
			</Flex>
			{post.metadata.images.length > 0 && (
				<SmartImage
					aspectRatio="16 / 9"
					radius="m"
					alt="image"
					src={post.metadata.images[0]}/>
			)}
			<Flex style={{margin: 'auto'}}
				as="article"
				maxWidth="xs" fillWidth
				direction="column">
				<Flex
					gap="12" marginBottom="24"
					alignItems="center">
					{ post.metadata.team && (
						<AvatarGroup
							reverseOrder
							avatars={avatars}
							size="m"/>
					)}
					<Text
						variant="body-default-s"
						onBackground="neutral-weak">
						{formatDate(post.metadata.publishedAt)}
					</Text>
				</Flex>
				<CustomMDX source={post.content} />
				{post.metadata.components?.map((componentName: string) => (
    				<div key={componentName}>
        		{renderComponent(componentName)}
    </div>
))}
			</Flex>
			<ScrollToHash />
		</Flex>
	)
}