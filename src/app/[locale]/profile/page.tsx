import { Avatar, Button, Flex, Heading, Icon, IconButton, SmartImage, Tag, Text } from '@/once-ui/components';
import { baseURL, renderContent } from '@/app/resources';
import TableOfContents from '@/components/about/TableOfContents';
import styles from '@/components/about/about.module.scss'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import * as cheerio from "cheerio";

const PLAYER_URL = "https://www.basketball-reference.com/players/j/jamesle01.html"; // LeBron James' page

interface PlayerProfile {
    name: string;
    team: string;
    position: string;
    height: string;
    weight: string;
    height_metric: string;
    weight_metric: string;
    country: string;
    birthdate: string;
    draft: string;
    experience: string;
    shootingHand: string;
    lastAttended: string;
  }

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string }}
) {
    const {person, about, social } = renderContent();
	const title = about.title;
	const description = about.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}/about`,
			images: [
				{
					url: ogImage,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}


const fetchProfile = async () => {
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
    
        // Extract required data using Cheerio selectors
        const name = $("h1 span").text().trim(); // LeBron James
    
        // Extract position and clean up extra spaces (removes "▪ Shoots")
        const positionText = $("p:contains('Position')").text().split(":")[1]?.trim() ?? "";
        const position = positionText.replace(/\s+/g, " ").replace('▪ Shoots', '').trim();
    
        // Dynamically extract height and weight from the p tag
        const heightWeightText = $("p:contains('Position') + p").text().trim(); // This is the paragraph after "Position"
        
        // Dynamically extract height (in format 6-9) and weight (in format 250lb)
        const heightMatch = heightWeightText.match(/(\d{1,2}-\d{1,2})/); // For height like "6-9"
        const weightMatch = heightWeightText.match(/(\d{3}lb)/); // For weight like "250lb"
    
        const height = heightMatch ? heightMatch[0].replace(/\s+/g, ' ') : "";
        const weight = weightMatch ? weightMatch[0].replace(/\s+/g, ' ') : "";
    
        // Extract metric values from the text in parentheses (e.g., "206cm, 113kg")
        const metricMatch = heightWeightText.match(/\((\d{3}cm),\s*(\d{3}kg)\)/);
        const height_metric = metricMatch ? metricMatch[1] : "";
        const weight_metric = metricMatch ? metricMatch[2] : "";
    
        // Extract other information
        const team = $("p:contains('Team') a").text().trim(); // Los Angeles Lakers
        const country = $("p:contains('Born') span").last().text().trim(); // Country
        const birthdate = $("p:contains('Born') span").first().text().trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(); // Clean up newline and extra spaces
        const draftText = $("p:contains('Draft')").text().split(":")[1]?.trim() ?? "Undrafted"; // Draft info
    
        // Fix the draft dynamic part
        const draft = draftText.replace(/LeBron James was drafted by.*/i, "").trim();
    
        const experience = $("p:contains('Experience')").text().split(":")[1]?.trim() ?? ""; // Experience
        
        // Add shooting hand info (assumed from "Shoots" text)
        const shootingHand = $("p:contains('Shoots')").text().includes("Right") ? "Right Handed" : "Left Handed";
    
        // Extract last attended (High School)
        const lastAttended = $("p:contains('High School')").text().split(":")[1]?.trim() ?? "";
    
        // Clean up and format the data properly
        const playerProfile: PlayerProfile = {
          name,
          team,
          position,
          height,
          weight,
          height_metric,
          weight_metric,
          country,
          birthdate,
          draft,
          experience,
          shootingHand,
          lastAttended,
        };
    
        console.log("Player profile fetched successfully:", playerProfile);
    
        return playerProfile;
      } catch (error) {
        console.error("Error fetching player profile:", (error as Error).message);
        return null;
      }
};

export default async function Profile(
    { params: {locale}}: { params: { locale: string }}
) {
    let profile = await fetchProfile();
    unstable_setRequestLocale(locale);
    const {person, about, social } = renderContent();
    const structure = [
        { 
            title: about.intro.title,
            display: about.intro.display,
            items: []
        },
        { 
            title: about.work.title,
            display: about.work.display,
            items: about.work.experiences.map(experience => experience.company)
        },
        { 
            title: about.studies.title,
            display: about.studies.display,
            items: about.studies.institutions.map(institution => institution.name)
        },
        { 
            title: about.technical.title,
            display: about.technical.display,
            items: about.technical.skills.map(skill => skill.title)
        },
    ]
    return (
        <Flex
            fillWidth maxWidth="m"
            direction="column">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: person.name,
                        jobTitle: person.role,
                        description: about.intro.description,
                        url: `https://${baseURL}/about`,
                        image: `${baseURL}/images/${person.avatar}`,
                        sameAs: social
                            .filter((item) => item.link && !item.link.startsWith('mailto:')) // Filter out empty links and email links
                            .map((item) => item.link),
                        worksFor: {
                            '@type': 'Organization',
                            name: about.work.experiences[0].company || ''
                        },
                    }),
                }}
            />
            { about.tableOfContent.display && (
                <Flex
                    style={{ left: '0', top: '50%', transform: 'translateY(-50%)' }}
                    position="fixed"
                    paddingLeft="24" gap="32"
                    direction="column" hide="s">
                    <TableOfContents
                        structure={structure}
                        about={about} />
                </Flex>
            )}
            <Flex
                fillWidth
                mobileDirection="column" justifyContent="center">
                { about.avatar.display && (
                    <Flex
                        className={styles.avatar}
                        minWidth="160" paddingX="l" paddingBottom="xl" gap="m"
                        flex={3} direction="column" alignItems="center">
                        <Avatar
                            src={person.avatar}
                            size="xl"/>
                        <Flex
                            gap="8"
                            alignItems="center">
                            <Icon
                                onBackground="accent-weak"
                                name="globe"/>
                            Akron, Ohio
                        </Flex>
                        { person.languages.length > 0 && (
                            <Flex
                                wrap
                                gap="8">
                                {person.languages.map((language, index) => (
                                    <Tag
                                        key={index}
                                        size="l">
                                        {language}
                                    </Tag>
                                ))}
                            </Flex>
                        )}
                    </Flex>
                )}
                <Flex
                    className={styles.blockAlign}
                    fillWidth flex={9} maxWidth={40} direction="column">
                    <Flex
                        id={about.intro.title}
                        fillWidth minHeight="160"
                        direction="column" justifyContent="center"
                        marginBottom="32">
                        {about.calendar.display && (
                            <Flex
                                className={styles.blockAlign}
                                style={{
                                    backdropFilter: 'blur(var(--static-space-1))',
                                    border: '1px solid var(--brand-alpha-medium)',
                                    width: 'fit-content'
                                }}
                                alpha="brand-weak" radius="full"
                                fillWidth padding="4" gap="8" marginBottom="m"
                                alignItems="center">
                                <Flex paddingLeft="12">
                                    <Icon
                                        name="calendar"
                                        onBackground="brand-weak"/>
                                </Flex>
                                <Flex
                                    paddingX="8">
                                    Schedule a call
                                </Flex>
                                <IconButton
                                    href={about.calendar.link}
                                    data-border="rounded"
                                    variant="tertiary"
                                    icon="chevronRight"/>
                            </Flex>
                        )}
                        <Heading
                            className={styles.textAlign}
                            variant="display-strong-xl">
                            {person.name}
                        </Heading>
                        <Text
                            className={styles.textAlign}
                            variant="display-default-xs"
                            onBackground="neutral-weak">
                            {person.role}
                        </Text>
                        {social.length > 0 && (
                            <Flex
                                className={styles.blockAlign}
                                paddingTop="20" paddingBottom="8" gap="8" wrap>
                                {social.map((item) => (
                                    item.link && (
                                        <Button
                                            key={item.name}
                                            href={item.link}
                                            prefixIcon={item.icon}
                                            label={item.name}
                                            size="s"
                                            variant="tertiary"/>
                                    )
                                ))}
                            </Flex>
                        )}
                    </Flex>

                    {about.studies.display && (
                        <>
                            <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="m">
                                {about.studies.title}
                            </Heading>
                            <Flex direction="column" fillWidth gap="l" marginBottom="40">
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Birthdate" variant="heading-strong-l">
                                        Birthdate
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.birthdate ?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Current Team" variant="heading-strong-l">
                                        Current Team
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.team ?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Position" variant="heading-strong-l">
                                        Position
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.position?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Height" variant="heading-strong-l">
                                        Height
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.height ?? "N/A"} {profile?.height_metric ?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Weight" variant="heading-strong-l">
                                        Weight
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.weight ?? "N/A"} {profile?.weight_metric ?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Country" variant="heading-strong-l">
                                        Country
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.country.toUpperCase() ?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Highest Education" variant="heading-strong-l">
                                        Highest Education
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.lastAttended ?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Draft" variant="heading-strong-l">
                                        Draft
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.draft ?? "N/A"}
                                    </Text>
                                </Flex>
                                <Flex fillWidth gap="4" direction="column">
                                    <Text id="Experience" variant="heading-strong-l">
                                        Experience
                                    </Text>
                                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                                        {profile?.experience ?? "N/A"}
                                    </Text>
                                </Flex>
                            </Flex>
                        </>
                    )}

                    { about.work.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.work.title}
                                variant="display-strong-s"
                                marginBottom="m">
                                {about.work.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l" marginBottom="40">
                                {about.work.experiences.map((experience, index) => (
                                    <Flex
                                        key={`${experience.company}-${experience.role}-${index}`}
                                        fillWidth
                                        direction="column">
                                        <Flex
                                            fillWidth
                                            justifyContent="space-between"
                                            alignItems="flex-end"
                                            marginBottom="4">
                                            <Text
                                                id={experience.company}
                                                variant="heading-strong-l">
                                                {experience.company}
                                            </Text>
                                            <Text
                                                variant="heading-default-xs"
                                                onBackground="neutral-weak">
                                                {experience.timeframe}
                                            </Text>
                                        </Flex>
                                        <Text
                                            variant="body-default-s"
                                            onBackground="brand-weak"
                                            marginBottom="m">
                                            {experience.role}
                                        </Text>
                                        <Flex as="ul" direction="column" gap="16">
                                            {experience.achievements.map((achievement, index) => (
                                                <Text
                                                    as="li"
                                                    variant="body-default-m"
                                                    key={`${experience.company}-${index}`}
                                                >
                                                    {achievement} {/* Directly pass the string */}
                                                </Text>
                                            ))}
                                        </Flex>
                                        {experience.images.length > 0 && (
                                            <Flex
                                                fillWidth paddingTop="m" paddingLeft="40"
                                                wrap>
                                                {experience.images.map((image, index) => (
                                                    <Flex
                                                        key={index}
                                                        border="neutral-medium"
                                                        borderStyle="solid-1"
                                                        radius="m"
                                                        minWidth={image.width} height={image.height}>
                                                        <SmartImage
                                                            enlarge
                                                            radius="m"
                                                            sizes={image.width.toString()}
                                                            alt={image.alt}
                                                            src={image.src}/>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        )}
                                    </Flex>
                                ))}
                            </Flex>
                        </>
                    )}

                    { about.technical.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.technical.title}
                                variant="display-strong-s" marginBottom="40">
                                {about.technical.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l">
                                {about.technical.skills.map((skill, index) => (
                                    <Flex
                                        key={`${skill}-${index}`}
                                        fillWidth gap="4"
                                        direction="column">
                                        <Text
                                            variant="heading-strong-l">
                                            {skill.title}
                                        </Text>
                                        <Text
                                            variant="body-default-m"
                                            onBackground="neutral-weak">
                                            {skill.description}
                                        </Text>
                                        {skill.images && skill.images.length > 0 && (
                                            <Flex
                                                fillWidth paddingTop="m" gap="12"
                                                wrap>
                                                {skill.images.map((image, index) => (
                                                    <Flex
                                                        key={index}
                                                        border="neutral-medium"
                                                        borderStyle="solid-1"
                                                        radius="m"
                                                        minWidth={image.width} height={image.height}>
                                                        <SmartImage
                                                            enlarge
                                                            radius="m"
                                                            sizes={image.width.toString()}
                                                            alt={image.alt}
                                                            src={image.src}/>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        )}
                                    </Flex>
                                ))}
                            </Flex>
                        </>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}
