import { Avatar, Button, Flex, Heading, Icon, IconButton, SmartImage, Tag, Text } from '@/once-ui/components';
import { baseURL, renderContent } from '@/app/resources';
import TableOfContents from '@/components/about/TableOfContents';
import styles from '@/components/about/about.module.scss'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

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
        // Set the base URL based on the environment (local or production)
        // const baseUrl = process.env.NODE_ENV === 'development'
        //     ? 'http://localhost:3000' // Local development URL
        //     : process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL; // Production URL

        const baseUrl = 'http://localhost:3000';
        console.log("Base URL being used:", baseUrl); // Log base URL for debugging
            
        // Call the API endpoint
        const response = await fetch(`${baseUrl}/api/profile`, {
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
        console.log('Profile data:', data);
        return data; // Return the profile data
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null; // Return null in case of an error
    }
};

export default async function Profile(
    { params: {locale}}: { params: { locale: string }}
) {
    let profile = await fetchProfile();
    const date = new Date(profile.birthdate);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
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

                    { about.intro.display && (
                        <Flex
                            direction="column"
                            textVariant="body-default-l"
                            fillWidth gap="m" marginBottom="xl">
                            {about.intro.description}
                        </Flex>
                    )}

                    { about.studies.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.studies.title}
                                variant="display-strong-s"
                                marginBottom="m">
                                {about.studies.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l" marginBottom="40">
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Experience"
                                            variant="heading-strong-l">
                                            Birth Date
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {formattedDate}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Current Team"
                                            variant="heading-strong-l">
                                            Current Team
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.team}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Jersey"
                                            variant="heading-strong-l">
                                            Jersey
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.jersey}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Position"
                                            variant="heading-strong-l">
                                            Position
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.position}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Height"
                                            variant="heading-strong-l">
                                            Height
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.height}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Weight"
                                            variant="heading-strong-l">
                                            Weight
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.weight}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Country"
                                            variant="heading-strong-l">
                                            Country
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.country}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Highest Education"
                                            variant="heading-strong-l">
                                            Highest Education
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.lastAttended}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Draft"
                                            variant="heading-strong-l">
                                            Draft
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.draft}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        fillWidth
                                        gap="4"
                                        direction="column">
                                        <Text
                                            id="Experience"
                                            variant="heading-strong-l">
                                            Experience
                                        </Text>
                                        <Text
                                            variant="heading-default-xs"
                                            onBackground="neutral-weak">
                                            {profile.experience}
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
