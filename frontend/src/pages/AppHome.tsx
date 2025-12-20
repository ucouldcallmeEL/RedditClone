import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import type { Post } from '../types';

type Props = { posts: Post[]; onVote?: (postId: string, upvotes: number, downvotes: number) => void };

function AppHome({ posts, onVote }: Props) {
  return (
    <main className="feed">
      <PostComposer />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onVote={onVote} />
      ))}
    </main>
  );
}

export default AppHome;
