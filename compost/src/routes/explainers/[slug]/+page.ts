import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
  const { manifest } = await parent();
  const item = manifest.find((i: { slug: string }) => i.slug === params.slug);
  if (!item) throw error(404, 'Not found');
  return { item };
};
