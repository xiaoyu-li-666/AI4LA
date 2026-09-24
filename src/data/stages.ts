export const stages = [
  {
    id: 'research',
    number: '01',
    label: 'Site research',
    short: 'Understand the place',
    description: 'Collect observations, organize field notes, and identify the questions a site analysis should answer.',
  },
  {
    id: 'analysis',
    number: '02',
    label: 'Data & analysis',
    short: 'Read the evidence',
    description: 'Work with maps, datasets, and environmental evidence while keeping sources and assumptions visible.',
  },
  {
    id: 'concept',
    number: '03',
    label: 'Concept design',
    short: 'Explore directions',
    description: 'Use AI to generate options, test an idea against a brief, and explain why a concept fits the site.',
  },
  {
    id: 'development',
    number: '04',
    label: 'Design development',
    short: 'Make it specific',
    description: 'Turn a broad concept into design decisions that can be checked against dimensions, performance, and context.',
  },
  {
    id: 'visualization',
    number: '05',
    label: 'Visualization',
    short: 'Show the proposal',
    description: 'Create and evaluate visual material without losing control of geometry, scale, or design intent.',
  },
  {
    id: 'communication',
    number: '06',
    label: 'Communication',
    short: 'Share the work',
    description: 'Structure presentations, write clearer explanations, and adapt a design story to its audience.',
  },
] as const;

export type StageId = (typeof stages)[number]['id'];
export const stageById = Object.fromEntries(stages.map((stage) => [stage.id, stage])) as Record<StageId, (typeof stages)[number]>;

export function path(url: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (url.startsWith('/') ? url : '/' + url);
}
