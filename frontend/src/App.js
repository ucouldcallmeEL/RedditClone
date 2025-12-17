import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LogIn from './pages/LoginAndSignup/LogIn';
import ResetPass from './pages/LoginAndSignup/ResetPass';
import SigninPhone from './pages/LoginAndSignup/SigninPhone';
import Signup from './pages/LoginAndSignup/Signup';
import CreateUser from './pages/LoginAndSignup/UsernamePass';
import Interests from './pages/LoginAndSignup/Interests'
function App() {
  return (
    <Router>
      <div className="App">
        <div className="homepage">
          <Routes>            
            <Route path="/" element={<LogIn />} />
            <Route path="/signinPhone" element={<SigninPhone />} />
            <Route path="/reset" element={<ResetPass />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/interests" element={<Interests />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
