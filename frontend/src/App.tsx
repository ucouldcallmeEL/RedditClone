import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import RightRail from './components/RightRail';
import SidebarNav from './components/SidebarNav';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import CommunitiesPage from './pages/CommunitiesPage';
import NotificationPage from './pages/Notifications/NotificationPage';
import SettingsPage from './pages/Settings/SettingsPage';

type FeedFilter = 'home' | 'popular' | 'all';

function AppContent() {
  const location = useLocation();
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('home');

  const onMainFeed = location.pathname === '/';

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <SidebarNav activeFilter={feedFilter} onSelectFilter={setFeedFilter} />

        <main className="feed">
          <Routes>
            <Route path="/" element={<HomePage feedFilter={feedFilter} />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:communityName/*" element={<CommunityPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        {onMainFeed && <RightRail />}
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;

