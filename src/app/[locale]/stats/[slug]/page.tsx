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

interface WorkParams {
    params: {
        slug: string;
		locale: string;
    };
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
    try {
        // Set the base URL based on the environment (local or production)
        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000' // Local development URL
            : process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL; // Production URL


            const url = `${baseUrl}/api/career`;
            console.log(url);
            // Call the API endpoint for fetching recent games
            const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch career stats: ${response.statusText}`);
        }

        // Parse the JSON data
        const data = await response.json();
		console.log(data);
        return data; // Return the career stats data
    } catch (error) {
        console.error('Error fetching career stats:', error);
        return null; // Return null in case of an error
    }
};

const fetchRecentGames = async () => {
    try {
        // Set the base URL based on the environment (local or production)
        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000' // Local development URL
            : process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL; // Production URL

        const url = `${baseUrl}/api/recentgames`;
        console.log(url);
        // Call the API endpoint for fetching recent games
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch recent games: ${response.statusText}`);
        }

        console.log('Raw Response:', response);

        // Parse the JSON data
        const data = await response.json();
        console.log(data);
        return data; // Return the recent games data
    } catch (error) {
        console.error('Error fetching recent games:', error);
        return null; // Return null in case of an error
    }
};

const fetchTeam = async () => {
    try {
        // Set the base URL based on the environment (local or production)
        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000' // Local development URL
            : process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL; // Production URL

        const url = `${baseUrl}/api/profile`;
        console.log(url);
        // Call the API endpoint
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        // Parse the JSON data
        const data = await response.json();
        console.log('team:', data.team);
        return data.team; // Return the profile data
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null; // Return null in case of an error
    }
};

const fetchUpcomingGames = async (team) => {
    try {
        // Set the base URL based on the environment (local or production)
        const baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000' // Local development URL
            : process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL; // Production URL


        const url = `${baseUrl}/api/upcoming?team=${team}`
        // Call the API endpoint with the team name
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        // Parse the JSON data
        const data = await response.json();

        if (!data || !data.games || data.games.length === 0) {
            throw new Error('No games found for this team.');
        }

        // Limit to next 5 games
        const upcomingGames = data.games.slice(0, 5);

        console.log('Upcoming Games:', upcomingGames);
        return upcomingGames; // Return the upcoming games

    } catch (error) {
        console.error('Error fetching upcoming games:', error);
        return null; // Return null in case of an error
    }
};

async function FiveUpcomingGames() {
    // Fetch the team name
    const teamdata = await fetchTeam();  // Assuming this function will return the team name (e.g., 'lakers')
    const team = teamdata.split(" ").pop();

    // Fetch the upcoming games for the team
    const games = await fetchUpcomingGames(team);  // Fetch the next 5 games

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        timeZoneName: 'short',
    });

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
                Broadcasters: {game.broadcasters.join(', ')}
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
        Points: data.careerStats.points,
        Rebounds: data.careerStats.rebounds,
        Assists: data.careerStats.assists,
        Steals: data.careerStats.steals,
        Blocks: data.careerStats.blocks,
        "Games Played": data.careerStats.games,
        "Field Goal Percentage": data.careerStats.fieldGoalPercentage,
        "Three-Point Percentage": data.careerStats.threePointPercentage,
        "Free Throw Percentage": data.careerStats.freeThrowPercentage,
        Minutes: data.careerStats.minutes,
    };

    const currentSeasonStats = {
        Points: data.currentSeasonStats.points,
        Rebounds: data.currentSeasonStats.rebounds,
        Assists: data.currentSeasonStats.assists,
        Steals: data.currentSeasonStats.steals,
        Blocks: data.currentSeasonStats.blocks,
        "Games Played": data.currentSeasonStats.games,
        "Field Goal Percentage": data.currentSeasonStats.fieldGoalPercentage,
        "Three-Point Percentage": data.currentSeasonStats.threePointPercentage,
        "Free Throw Percentage": data.currentSeasonStats.freeThrowPercentage,
        Minutes: data.currentSeasonStats.minutes,
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