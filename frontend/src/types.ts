export type Post = {
  id: string;
  subreddit: string;
  communityIcon: string;
  flair?: string;
  title: string;
  body: string;
  media?: string;
  isSpoiler?: boolean;
  upvotes: number;
  downvotes?: number; // Optional for backward compatibility
  comments: number;
  shared: number;
  author: string;
  createdAt: string;
  tags?: string[];
};

export type Comment = {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  upvotes: number;
  downvotes: number;
  createdAt: string;
  replies: Comment[];
};

export type TrendingTopic = {
  label: string;
  postsToday: number;
};

export type Community = {
  name: string;
  members: string;
  description: string;
  avatar: string;
};

export type CommunityDetails = Community & {
  bannerColor?: string;
  bannerImage?: string;
  createdAt?: string;
  moderators?: string[];
  rules?: { id: string; title: string; description?: string }[];
  online?: number;
  joined?: boolean;
  bookmarks?: string[];
  weeklyContributions?: string;
};

