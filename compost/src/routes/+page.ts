import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { manifest } = await parent();
  return { manifest };
};
