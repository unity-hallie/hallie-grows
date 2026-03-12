import type { LayoutLoad } from './$types';
import type { ManifestItem } from '$lib/types';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const res = await fetch('/manifest.json');
  const manifest: ManifestItem[] = await res.json();
  return { manifest };
};
