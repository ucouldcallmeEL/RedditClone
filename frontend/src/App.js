import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import RightRail from './components/RightRail';
import SidebarNav from './components/SidebarNav';
import HomePage from './pages/HomePage';
import LogIn from './pages/LoginAndSignup/LogIn';
import ResetPass from './pages/LoginAndSignup/ResetPass';
import SigninPhone from './pages/LoginAndSignup/SigninPhone';
import Signup from './pages/LoginAndSignup/Signup';
import CreateUser from './pages/LoginAndSignup/UsernamePass';
import Interests from './pages/LoginAndSignup/Interests';
import CreatePost from './pages/CreatePost/CreatePost';
import CreateCommunity from './pages/CreateCommunity/CreateCommunity';
import CommunityPage from './pages/CommunityPage';
import CommunitiesPage from './pages/CommunitiesPage';
import PostDetailPage from './pages/PostDetailPage';
import SettingsPage from './pages/Settings/SettingsPage';
import NotificationPage from './pages/Notifications/NotificationPage';
import ModQueuePage from './pages/Moderation/ModQueuePage';
import ModMailPage from './pages/Moderation/ModMailPage';
import ModManagementPage from './pages/Moderation/ModManagementPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProfileSidebar from './pages/Profile/ProfileSidebar';

// Generic modal wrapper component
function ModalWrapper({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Wrapper component for Login modal
function LoginModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");

  return (
    <ModalWrapper onClose={handleClose}>
      <LogIn onClose={handleClose} />
    </ModalWrapper>
  );
}

// Wrapper component for Signup modal
function SignupModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");

  return (
    <ModalWrapper onClose={handleClose}>
      <Signup onClose={handleClose} />
    </ModalWrapper>
  );
}

// Wrapper component for SigninPhone modal
function SigninPhoneModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");

  return (
    <ModalWrapper onClose={handleClose}>
      <SigninPhone onClose={handleClose} />
    </ModalWrapper>
  );
}

// Wrapper component for ResetPass modal
function ResetPassModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");

  return (
    <ModalWrapper onClose={handleClose}>
      <ResetPass onClose={handleClose} />
    </ModalWrapper>
  );
}

// Wrapper component for CreateUser modal
function CreateUserModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");

  return (
    <ModalWrapper onClose={handleClose}>
      <CreateUser onClose={handleClose} />
    </ModalWrapper>
  );
}

// Wrapper component for Interests modal
function InterestsModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");

  return (
    <ModalWrapper onClose={handleClose}>
      <Interests onClose={handleClose} />
    </ModalWrapper>
  );
}

// Wrapper component for CreateCommunity modal
function CreateCommunityModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate(-1);

  return (
    <ModalWrapper onClose={handleClose}>
      <CreateCommunity onClose={handleClose} />
    </ModalWrapper>
  );
}

function AppContent() {
  const location = useLocation();
  const [feedFilter, setFeedFilter] = useState('home');

  const onMainFeed = location.pathname === '/';
  const isProfilePage = location.pathname.startsWith('/user/');
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isSigninPhonePage = location.pathname === '/signinPhone';
  const isResetPage = location.pathname === '/reset';
  const isCreateUserPage = location.pathname === '/create-user';
  const isInterestsPage = location.pathname === '/interests';
  const isCreateCommunityPage = location.pathname.startsWith('/r/create');

  const isAnyAuthPage = isLoginPage || isSignupPage || isSigninPhonePage || isResetPage || isCreateUserPage || isInterestsPage;

  // Get current user from localStorage for ProfileSidebar
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  // For auth pages, show as modal overlay on top of main layout
  if (isAnyAuthPage) {
    return (
      <>
        <div className="app-shell">
          <Header />
          <div className="app-body">
            <SidebarNav activeFilter={feedFilter} onSelectFilter={setFeedFilter} />
            <main className="feed">
              <Routes>
                <Route path="/" element={<HomePage feedFilter={feedFilter} />} />
                <Route path="/post/:postId" element={<PostDetailPage />} />
                <Route path="/r/:communityName" element={<CommunityPage />} />
                <Route path="/community/:communityName" element={<CommunityPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/posts/create" element={<CreatePost />} />
                <Route path="/user/:username" element={<ProfilePage />} />
              </Routes>
            </main>
            {onMainFeed && <RightRail />}
            {isProfilePage && getCurrentUser() && <ProfileSidebar user={getCurrentUser()} />}
          </div>
        </div>
        <Routes>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/signup" element={<SignupModal />} />
          <Route path="/signinPhone" element={<SigninPhoneModal />} />
          <Route path="/reset" element={<ResetPassModal />} />
          <Route path="/create-user" element={<CreateUserModal />} />
          <Route path="/interests" element={<InterestsModal />} />
        </Routes>
      </>
    );
  }

  // For create community page, show as modal overlay on top of main layout
  if (isCreateCommunityPage) {
    return (
      <>
        <div className="app-shell">
          <Header />
          <div className="app-body">
            <SidebarNav activeFilter={feedFilter} onSelectFilter={setFeedFilter} />
            <main className="feed">
              <Routes>
                <Route path="/" element={<HomePage feedFilter={feedFilter} />} />
                <Route path="/post/:postId" element={<PostDetailPage />} />
                <Route path="/r/:communityName" element={<CommunityPage />} />
                <Route path="/community/:communityName" element={<CommunityPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/user/:username" element={<ProfilePage />} />
              </Routes>
            </main>
            {onMainFeed && <RightRail />}
            {isProfilePage && getCurrentUser() && <ProfileSidebar user={getCurrentUser()} />}
          </div>
        </div>
        <Routes>
          <Route path="/r/create" element={<CreateCommunityModal />} />
        </Routes>
      </>
    );
  }

  const isModMailPage = location.pathname === '/moderation/mail';

  // For main app pages, show the layout with Header, Sidebar, etc.
  return (
    <div className="app-shell">
      <Header />

      <div className="app-body" style={isModMailPage ? {
        gridTemplateColumns: '1fr',
        width: '95%',
        maxWidth: '1400px'
      } : {}}>
        <SidebarNav activeFilter={feedFilter} onSelectFilter={setFeedFilter} />

        <main className="feed" style={isModMailPage ? { maxWidth: '1200px', width: '100%' } : {}}>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage feedFilter={feedFilter} />} />

            {/* Post routes */}
            <Route path="/post/:postId" element={<PostDetailPage />} />

            {/* Community routes */}
            <Route path="/r/:communityName" element={<CommunityPage />} />
            <Route path="/community/:communityName" element={<CommunityPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />

            {/* Settings and Notifications */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/posts/create" element={<CreatePost />} />

            {/* Profile routes */}
            <Route path="/user/:username" element={<ProfilePage />} />

            {/* Moderation routes */}
            <Route path="/moderation/queue" element={<ModQueuePage />} />
            <Route path="/moderation/mail" element={<ModMailPage />} />
            <Route path="/moderation/management" element={<ModManagementPage />} />
          </Routes>
        </main>

        {onMainFeed && <RightRail />}
        {isProfilePage && getCurrentUser() && <ProfileSidebar user={getCurrentUser()} />}
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
