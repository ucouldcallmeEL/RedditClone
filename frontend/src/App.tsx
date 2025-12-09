import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RightRail from './components/RightRail';
import SidebarNav from './components/SidebarNav';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import { communities, trendingTopics } from './data/feed';

function App() {
  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <SidebarNav />

        <main className="feed">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
          </Routes>
        </main>

        <RightRail trendingTopics={trendingTopics} communities={communities} />
      </div>
    </div>
  );
}

export default App;

