import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import RightRail from './components/RightRail';
import SidebarNav from './components/SidebarNav';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import { communities, trendingTopics } from './data/feed';
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

        <main className="feed">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/community/:communityName/*" element={<CommunityPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
          </Routes>
        </main>

        {!onCommunity && <RightRail trendingTopics={trendingTopics} communities={communities} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;

