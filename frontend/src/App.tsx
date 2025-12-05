import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PostCard from './components/PostCard';
import PostComposer from './components/PostComposer';
import RightRail from './components/RightRail';
import SidebarNav from './components/SidebarNav';
import { communities, posts, trendingTopics } from './data/feed';
import CommunityPage from './pages/CommunityPage';
import AppHome from './pages/AppHome';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />

        <div className="app-body">
          <SidebarNav />

          <Routes>
            <Route path="/" element={<AppHome posts={posts} />} />
            <Route path="/community/:communityName/*" element={<CommunityPage />} />
          </Routes>

          <RightRail trendingTopics={trendingTopics} communities={communities} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

