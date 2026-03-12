import type { LayoutLoad } from './$types';
import type { ManifestItem } from '$lib/types';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const [manifestRes, contentRes] = await Promise.all([
    fetch('/manifest.json'),
    fetch('/content.json'),
  ]);
  const manifest: ManifestItem[] = await manifestRes.json();
  const content: Record<string, string[]> = await contentRes.json();
  return { manifest, content };
};
