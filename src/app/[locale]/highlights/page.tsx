import { Flex, Text, Heading } from '@/once-ui/components';
import { Mailchimp } from '@/components';
import { Posts } from '@/components/blog/Posts';
import { baseURL, renderContent } from '@/app/resources'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
	const { blog } = renderContent();

	const title = blog.title;
	const description = blog.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}/highlights`,
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

export default function Blog(
	{ params: {locale}}: { params: { locale: string }}
) {
	const { person, blog, newsletter } = renderContent();
    return (
        <Flex
			fillWidth maxWidth="s"
			direction="column">
            <script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Blog',
						headline: blog.title,
						description: blog.description,
						url: `https://${baseURL}/highlights`,
						image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
						author: {
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
            <Heading
                marginBottom="l"
                variant="display-strong-s">
                {blog.title}
            </Heading>
			<Text
                marginBottom="l"
                variant="body-default-m"
                onBackground="neutral-weak"
            >
                {blog.description}
            </Text>
			<Flex
				fillWidth flex={1} direction="column">
				<Posts range={[1,5]} locale={locale} thumbnail/>
			</Flex>
            {newsletter.display && (
                <Mailchimp newsletter={newsletter} />
            )}
        </Flex>
    );
}