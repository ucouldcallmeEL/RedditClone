import type { Post } from "../../types";

export const mockPosts: Post[] = [
  {
    id: "1",
    subreddit: "r/reactjs",
    communityIcon: "/react.png",
    flair: "Discussion",
    title: "Why React state updates feel async?",
    body: "I noticed that setState doesn’t update immediately. Can someone explain why?",
    upvotes: 1243,
    comments: 231,
    shared: 12,
    author: "u/frontend_dev",
    createdAt: "3h ago",
    tags: ["React", "State", "Hooks"],
  },
  {
    id: "2",
    subreddit: "r/webdev",
    communityIcon: "/webdev.png",
    flair: "Help",
    title: "Best way to clone Reddit UI?",
    body: "I’m building a Reddit clone in React. What’s the best component structure?",
    media: "/post-image.jpg",
    upvotes: 876,
    comments: 98,
    shared: 5,
    author: "u/ahmed_k",
    createdAt: "6h ago",
    isSpoiler: false,
    tags: ["UI", "React", "CSS"],
  },
];
