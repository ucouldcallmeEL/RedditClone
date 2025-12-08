import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PostCard from './components/PostCard';
import PostComposer from './components/PostComposer';
import RightRail from './components/RightRail';
import SidebarNav from './components/SidebarNav';
import { communities, posts, trendingTopics } from './data/feed';
import CommunityPage from './pages/CommunityPage';
import AppHome from './pages/AppHome';

function AppContent() {
  const location = useLocation();

  const onCommunity = location.pathname.startsWith('/community');

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <SidebarNav />

        <Routes>
          <Route path="/" element={<AppHome posts={posts} />} />
          <Route path="/community/:communityName/*" element={<CommunityPage />} />
        </Routes>

        {!onCommunity && <RightRail trendingTopics={trendingTopics} communities={communities} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

