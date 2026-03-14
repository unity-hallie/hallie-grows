import type { LayoutLoad } from './$types';
import type { ManifestItem } from '$lib/types';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const manifest: ManifestItem[] = await fetch('/manifest.json').then(r => r.json());
  return { manifest };
};
