export type Phase = 'salt' | 'fluid' | 'volatile';
export type Section = 'work' | 'toys' | 'explainers';

export interface Relation {
  slug: string;
  affinity: number;
}

export interface ManifestItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  url: string | null;
  year: number | null;
  phase: Phase;
  section: Section;
  relations: Relation[];
  image: string | null;
}
