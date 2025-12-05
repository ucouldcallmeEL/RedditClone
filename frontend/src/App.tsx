import Header from './components/Header';
import PostCard from './components/PostCard';
import PostComposer from './components/PostComposer';
import RightRail from './components/RightRail';
import SidebarNav from './components/SidebarNav';
import { communities, posts, trendingTopics } from './data/feed';

function App() {
  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <SidebarNav />

        <main className="feed">
          <PostComposer />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>

        <RightRail trendingTopics={trendingTopics} communities={communities} />
      </div>
    </div>
  );
}

export default App;

