import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LogIn from './pages/LoginAndSignup/LogIn';
import ResetPass from './pages/LoginAndSignup/ResetPass';
import SigninPhone from './pages/LoginAndSignup/SigninPhone';
import Signup from './pages/LoginAndSignup/Signup';
import CreateUser from './pages/LoginAndSignup/UsernamePass';
import Interests from './pages/LoginAndSignup/Interests'
import CreatePost from './pages/CreatePost/CreatePost';
import CreateCommunity from './pages/CreateCommunity/CreateCommunity';

function App() {
  // const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState('home'); // 'home', 'createPost'
  // const [isLoginOpen, setIsLoginOpen] = useState(false);

  // const handleNavigateToCreatePost = () => {
  //   setCurrentPage('createPost');
  // };

  // const handleNavigateToHome = () => {
  //   setCurrentPage('home');
  // };

  // const handleOpenCreateCommunity = () => {
  //   setIsCreateCommunityOpen(true);
  //   setCurrentPage('home');
  // };

  // const handleCloseCreateCommunity = () => {
  //   setIsCreateCommunityOpen(false);
  // };

  // const handleNavigateToLogin = () => {
  //   setCurrentPage('home');
  //   setIsLoginOpen(true);
  // };

  // const handleCloseLogin = () => {
  //   setIsLoginOpen(false);
  // };

  return (
    <div className="App">
      <div className="homepage">
        <Routes>            
          <Route path="/" element={<LogIn />} />
          <Route path="/signinPhone" element={<SigninPhone />} />
          <Route path="/reset" element={<ResetPass />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/communities/create" element={<CreateCommunity />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
