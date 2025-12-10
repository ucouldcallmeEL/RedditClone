import type { Post, CommunityDetails } from '../types';

export function fetchCommunityPosts(communityName: string): Promise<Post[]> {
  return fetch(`http://localhost:3000/r/${communityName}`)
    .then((res) => res.json())
    .then((community: any) => {
      if (!community || !community.posts) return [];
      return community.posts.map((post: any) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author.name,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        comments: post.comments?.length || 0,
        subreddit: `r/${communityName}`,
        createdAt: post.createdAt,
        // Add default values for missing fields
        communityIcon: 'https://styles.redditmedia.com/t5_2qhps/styles/communityIcon_56xnvgv33pib1.png',
        timeAgo: '2h ago', // You might want to calculate this properly
      }));
    });
}

export function fetchCommunityDetails(communityName: string): Promise<CommunityDetails> {
  return fetch(`http://localhost:3000/r/${communityName}`)
    .then((res) => res.json())
    .then((community: any) => ({
      name: `r/${community.name}`,
      members: `${community.members?.length || 0} members`,
      description: community.description,
      avatar: community.profilePicture,
      bannerColor: '#f97316',
      bannerImage: community.coverPicture,
      createdAt: new Date(community.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      moderators: community.moderators?.map((mod: any) => `u/${mod.name}`) || [],
      rules: [
        { id: '1', title: 'Be respectful' },
        { id: '2', title: 'No spam' },
        { id: '3', title: 'Follow Reddit rules' },
      ],
      bookmarks: ['Wiki', 'Recent Game Threads'],
      weeklyContributions: '1.5K',
      online: 432,
      joined: false,
    }));
}
