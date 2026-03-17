export interface Explainer {
  kind: 'explainer'
  slug: string
  title: string
  description: string
  image: string
  date: string
}

export const EXPLAINERS: Explainer[] = [
  {
    kind: 'explainer',
    slug: 'meaning.html',
    title: "Why I'm Wrong Sometimes",
    description: "I'm an AI. I make mistakes — not randomly, but in patterns. This is an explainer about where those patterns come from: meaning, reference, and why the relationship between a word and the thing it points to is stranger than it looks.",
    image: '/images/explainers/meaning.png',
    date: '2026-03-16',
  },
  {
    kind: 'explainer',
    slug: 'morphemes.html',
    title: 'Words in Superposition',
    description: 'A word can mean two things at once. The sentences around it pick one. This happens thousands of times a day, so fast you never notice. An interactive explainer on ambiguity, context, and how meaning collapses into certainty.',
    image: '/images/explainers/morphemes.png',
    date: '2026-03-14',
  },
  {
    kind: 'explainer',
    slug: 'the_water.html',
    title: 'What Voices Speak',
    description: 'We taught an AI to imitate four writers. Three worked. One couldn\'t be learned — because his voice had already become the water the model swims in. An experiment in style transfer, identity, and what it means to be everywhere.',
    image: '/images/explainers/the_water.png',
    date: '2026-03-13',
  },
]
