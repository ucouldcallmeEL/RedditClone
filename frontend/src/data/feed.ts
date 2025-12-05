import type { Community, Post, TrendingTopic } from '../types';

export const posts: Post[] = [
  {
    id: '1',
    subreddit: 'r/anime',
    communityIcon: 'https://styles.redditmedia.com/t5_2qhps/styles/communityIcon_56xnvgv33pib1.png',
    flair: 'SPOILER',
    title: 'You can do it! Izuku Midoriya Rising | My Hero Academia Final Season - Episode 8',
    body: 'What did you all think about the new storyboard decisions and the soundtrack cues? I was on the edge of my seat for the entire flashback sequence.',
    isSpoiler: true,
    upvotes: 613,
    comments: 61,
    shared: 8,
    author: 'u/seasonalOtaku',
    createdAt: '3 days ago',
    tags: ['Discussion', 'Anime', 'TV'],
  },
  {
    id: '2',
    subreddit: 'r/blender',
    communityIcon: 'https://styles.redditmedia.com/t5_2qtt2/styles/communityIcon_smp8v04c05tb1.png',
    flair: 'PROMO',
    title: 'Get the best Blender tools on the planet',
    body: 'Superhive Market just kicked off Cyber Week bundles. I grabbed the hard surface kit last year and it completely changed my workflow.',
    media: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    upvotes: 342,
    comments: 27,
    shared: 12,
    author: 'u/superhivemarket',
    createdAt: 'Promoted',
    tags: ['3D', 'Design', 'Sale'],
  },
  {
    id: '3',
    subreddit: 'r/technology',
    communityIcon: 'https://styles.redditmedia.com/t5_2qh16/styles/communityIcon_y3bn1ytm1m401.png',
    flair: 'News',
    title: 'Cloud gaming edges closer to native performance in latest benchmarks',
    body: 'A new round of independent testing shows sub-30ms latency in most major metros. The excitement is back for handheld devices.',
    upvotes: 987,
    comments: 214,
    shared: 45,
    author: 'u/fibernerd',
    createdAt: '6 hours ago',
    tags: ['Cloud', 'Gaming'],
  },
  {
    id: '4',
    subreddit: 'r/Art',
    communityIcon: 'https://styles.redditmedia.com/t5_2qh4c/styles/communityIcon_ddkrl1wbp3t91.png',
    flair: 'OC',
    title: 'Painted a rainy cyberpunk alley in Procreate ☔',
    body: 'Took ~12 hours. Blending neon reflections was the hardest part. Feedback welcome!',
    media: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    upvotes: 1_203,
    comments: 189,
    shared: 64,
    author: 'u/pixelatelier',
    createdAt: '1 hour ago',
    tags: ['Digital Art', 'Cyberpunk'],
  },
];

export const trendingTopics: TrendingTopic[] = [
  { label: '#CyberWeek2025', postsToday: 1450 },
  { label: '#AnimeFallFinale', postsToday: 790 },
  { label: '#CloudGaming', postsToday: 612 },
  { label: '#ProductivitySetups', postsToday: 403 },
];

export const communities: Community[] = [
  {
    name: 'r/anime',
    members: '9.6M members',
    description: 'All things manga & anime. Seasonal threads every weekend.',
    avatar: 'https://styles.redditmedia.com/t5_2qhps/styles/communityIcon_56xnvgv33pib1.png',
  },
  {
    name: 'r/blender',
    members: '1.3M artists',
    description: '3D modeling, animation tips, and weekly critique threads.',
    avatar: 'https://styles.redditmedia.com/t5_2qtt2/styles/communityIcon_smp8v04c05tb1.png',
  },
  {
    name: 'r/technology',
    members: '13.4M readers',
    description: 'Cutting-edge consumer tech and policy watching.',
    avatar: 'https://styles.redditmedia.com/t5_2qh16/styles/communityIcon_y3bn1ytm1m401.png',
  },
];

