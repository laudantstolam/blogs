import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getUrl } from '../utils/url';

export async function GET(context) {
	const posts = await getCollection('blog', ({ data }) => {
		return data.publish !== false;
	});

	posts.sort((a, b) => (b.data.created_date?.valueOf() ?? 0) - (a.data.created_date?.valueOf() ?? 0));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => {
			const slug = post.data.slug || post.id.replace(/\.[^/.]+$/, '');
			return {
				title: post.data.title,
				description: post.data.description || '',
				pubDate: post.data.created_date || new Date(),
				link: getUrl(`/${slug}/`),
				content: sanitizeHtml(post.rendered?.html || ''),
				// Optional fields
				author: post.data.author,
				categories: post.data.tags || [],
			};
		}),
	});
}
