import React from 'react';

import { Heading, Flex, Text, Button,  Avatar, RevealFx, Arrow } from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';
import { InlineCode } from "@/once-ui/components";

import { baseURL, routes, renderContent } from '@/app/resources'; 
import { Mailchimp } from '@/components';
import { Posts } from '@/components/blog/Posts';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import * as cheerio from 'cheerio';


export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
    const { home } = renderContent();
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}`,
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

const fetchPlayerStats = async () => {
    const url = 'https://www.nbcsports.com/nba/lebron-james/9844/stats';

    try {
      // Fetch the HTML content of the page
      const { data } = await axios.get(url);
      
      // Load the HTML data into Cheerio
      const $ = cheerio.load(data);
  
      // Extract Career Stats (last row in <tfoot>)
      const careerStatsRow = $('tfoot tr').last();

      const careerpoints = careerStatsRow.find('td').eq(4).text().trim(); // PTS

	  return careerpoints;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return null;
    }
};

function formatNumberWithCommas(number) {
		if (number == null) return ''; // Handle undefined or null
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default async function Home(
	{ params: {locale}}: { params: { locale: string }}
) {
	unstable_setRequestLocale(locale);
	let data = await fetchPlayerStats();
	const { home, about, person, newsletter } = renderContent();
	return (
		<Flex
			maxWidth="m" fillWidth gap="xl"
			direction="column" alignItems="center">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}`,
						image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
							'@type': 'Person',
							name: person.name,
							image: {
								'@type': 'ImageObject',
								url: `${baseURL}${person.avatar}`,
							},
						},
					}),
				}}
			/>
			<Flex
				fillWidth
				direction="column"
				paddingY="l" gap="m">
					<Flex
						direction="column"
						fillWidth maxWidth="s">
						<RevealFx
							translateY="4" fillWidth justifyContent="flex-start" paddingBottom="m">
							<Heading
								wrap="balance"
								variant="display-strong-l">
								The King’s Court: Dive into LeBron's Dominances.
							</Heading>
						</RevealFx>
						<RevealFx
							translateY="8" delay={0.2} fillWidth justifyContent="flex-start" paddingBottom="m">
							<Text
								wrap="balance"
								onBackground="neutral-weak"
								variant="heading-default-xl">
								LeBron James Fanpage<br/> Points and His Legacy<br/>{home.subline}
							</Text>
						</RevealFx>	
					</Flex>
				
			</Flex>
			<RevealFx translateY="16" delay={0.6}>
				<Projects range={[1,1]} locale={locale}/>
			</RevealFx>
			{routes['/blog'] && (
				<Flex
					fillWidth gap="24"
					mobileDirection="column">
					<Flex flex={1} paddingLeft="l">
						<Heading
							as="h2"
							variant="display-strong-xs"
							wrap="balance">
							Latest from the blog
						</Heading>
					</Flex>
					<Flex
						flex={3} paddingX="20">
						<Posts range={[1,2]} columns="2" locale={locale}/>
					</Flex>
				</Flex>
			)}
			<Projects range={[2]} locale={locale}/>	
			<Flex direction="column" fillWidth maxWidth="s">
				<RevealFx
					translateY="4" fillWidth justifyContent="flex-start" paddingBottom="m">
					<Heading
						wrap="balance"
						variant="display-strong-l">
						{formatNumberWithCommas(data)} Points and Counting...
					</Heading>
				</RevealFx>
			</Flex>
			{ newsletter.display &&
				<Mailchimp newsletter={newsletter} />
			}
		</Flex>
	);
}
