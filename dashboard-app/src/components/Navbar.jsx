import React, { useState } from 'react';
import './Navbar.css';
import { FaReddit, FaSearch, FaPlus, FaBell } from 'react-icons/fa';
import { BsChatDots, BsArrowUpRightCircle, BsList } from 'react-icons/bs'; 
import { IoClose } from 'react-icons/io5';

// FIX: Added 'onToggle' to the props list below
const Navbar = ({ currentSubreddit = "r/ay7aga", onToggle }) => {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <nav className="navbar">
      {/* --- LEFT: Menu Button + Logo --- */}
      <div className="navbar-left">
        
        {/* NEW: The Toggle Button is now here */}
        <button className="icon-btn menu-btn" onClick={onToggle}>
            <BsList style={{ fontSize: '24px' }} />
        </button>

        <a href="/" className="logo-link">
          <div className="logo-icon">
            <FaReddit />
          </div>
          <span className="logo-text">reddit</span>
        </a>
      </div>

      {/* --- CENTER: Search Bar --- */}
      <div className="navbar-center">
        <div className={`search-container ${searchFocus ? 'focused' : ''}`}>
          <label htmlFor="global-search" className="search-icon">
            <FaSearch />
          </label>

          {currentSubreddit && (
            <div className="subreddit-chip">
              <span className="chip-icon">🔞</span> 
              <span className="chip-text">{currentSubreddit}</span>
              <button className="chip-close">
                <IoClose />
              </button>
            </div>
          )}

          <input
            id="global-search"
            type="text"
            placeholder={currentSubreddit ? `Search in ${currentSubreddit}` : "Search Reddit"}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            autoComplete="off"
          />
        </div>
      </div>

      {/* --- RIGHT: Actions --- */}
      <div className="navbar-right">
        <button className="icon-btn" title="Advertise">
          <BsArrowUpRightCircle className="icon-ad" /> 
        </button>
        <button className="icon-btn" title="Chat">
          <BsChatDots />
        </button>
        <button className="icon-btn" title="Create Post">
          <FaPlus />
        </button>
        <button className="icon-btn" title="Notifications">
          <div className="notification-wrapper">
            <FaBell />
            <span className="badge">1</span>
          </div>
        </button>
        <button className="user-profile-btn">
            <div className="avatar-wrapper">
                <img 
                    src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png" 
                    alt="User" 
                    className="avatar-img"
                />
                <div className="online-status"></div>
            </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;