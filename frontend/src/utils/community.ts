import { posts } from '../data/feed';
import type { Post, CommunityDetails } from '../types';

export function fetchCommunityPosts(communityName: string): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requested = communityName.toLowerCase();
      const normalized = requested.startsWith('r/') ? requested : `r/${requested}`;
      const filtered = posts.filter((p) => p.subreddit.toLowerCase() === normalized);
      resolve(filtered);
    }, 550);
  });
}

export function fetchCommunityDetails(communityName: string): Promise<CommunityDetails> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: `r/${communityName}`,
        members: '123.4k members',
        description: `Welcome to ${communityName} — a place for discussions, links, and more.`,
        avatar: 'https://styles.redditmedia.com/t5_2qhps/styles/communityIcon_56xnvgv33pib1.png',
        bannerColor: '#f97316',
        bannerImage: 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1400&q=80',
        createdAt: 'Jan 12, 2014',
        moderators: ['u/mod_one', 'u/mod_two'],
        rules: [
          { id: '1', title: 'Be respectful' },
          { id: '2', title: 'No spam' },
          { id: '3', title: 'Follow Reddit rules' },
        ],
        bookmarks: ['Wiki', 'Recent Game Threads', 'r/PS5', 'Discord', 'Our Twitter', 'Sony Official'],
        weeklyContributions: '1.5K',
        online: 432,
        joined: false,
      });
    }, 350);
  });
}
