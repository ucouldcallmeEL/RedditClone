import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import type { Post } from '../types';

type Props = { posts: Post[] };

function AppHome({ posts }: Props) {
  return (
    <main className="feed">
      <PostComposer />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}

export default AppHome;
