import { getPosts } from '@/app/utils/utils'
import { baseURL, routes as routesConfig } from '@/app/resources'
import { routing } from '@/i18n/routing'

export default async function sitemap() {
    const locales = routing.locales;
    const includeLocalePrefix = locales.length > 1;

    let highlights = locales.flatMap((locale) => 
        getPosts(['src', 'app', '[locale]', 'highlights', 'posts', locale]).map((post) => ({
            url: `${baseURL}${includeLocalePrefix ? `/${locale}` : ''}/highlights/${post.slug}`,
            lastModified: post.metadata.publishedAt,
        }))
    );

    let stats = locales.flatMap((locale) => 
        getPosts(['public', 'projects', locale]).map((post) => ({
            url: `${baseURL}${includeLocalePrefix ? `/${locale}` : ''}/stats/${post.slug}`,
            lastModified: post.metadata.publishedAt,
        }))
    );

    const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route]);

    let routes = locales.flatMap((locale)=> 
        activeRoutes.map((route) => ({
            url: `${baseURL}${includeLocalePrefix ? `/${locale}` : ''}${route !== '/' ? route : ''}`,
            lastModified: new Date().toISOString().split('T')[0],
        }))
    );

    return [...routes, ...highlights, ...stats]
}