import type { Post  , Comment} from "../../types";

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
    userUpvoted: true,
    userDownvoted: false,
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
    userUpvoted: false,
    userDownvoted: true,

  },
];


export const mockCommentsByPost: Record<string, Comment[]> = {
  "1": [
    {
      _id: "c1",
      content:
        "React batches state updates for performance reasons. That’s why they feel async.",
      author: {
        _id: "u1",
        name: "react_guru",
      },
      upvotes: 312,
      downvotes: 4,
      createdAt: "2h ago",
      replies: [
        {
          _id: "c1_r1",
          content:
            "Exactly. Especially inside event handlers, React batches updates together.",
          author: {
            _id: "u2",
            name: "hook_master",
          },
          upvotes: 98,
          downvotes: 1,
          createdAt: "1h ago",
          replies: [],
        },
      ],
    },
    {
      _id: "c2",
      content:
        "If you need the updated value immediately, use useEffect or the functional updater.",
      author: {
        _id: "u3",
        name: "state_ninja",
      },
      upvotes: 187,
      downvotes: 3,
      createdAt: "1h ago",
      replies: [],
    },
  ],

  "2": [
    {
      _id: "c3",
      content:
        "Start by breaking the UI into PostCard, CommentTree, Sidebar, and Navbar components.",
      author: {
        _id: "u4",
        name: "ui_architect",
      },
      upvotes: 145,
      downvotes: 2,
      createdAt: "5h ago",
      replies: [
        {
          _id: "c3_r1",
          content:
            "Also keep your Post and Comment types shared between frontend and backend.",
          author: {
            _id: "u5",
            name: "fullstack_dev",
          },
          upvotes: 61,
          downvotes: 0,
          createdAt: "4h ago",
          replies: [],
        },
      ],
    },
    {
      _id: "c4",
      content:
        "Reddit’s UI is mostly flexbox + conditional rendering. Don’t overthink it.",
      author: {
        _id: "u6",
        name: "css_wizard",
      },
      upvotes: 89,
      downvotes: 6,
      createdAt: "3h ago",
      replies: [],
    },
  ],
};

