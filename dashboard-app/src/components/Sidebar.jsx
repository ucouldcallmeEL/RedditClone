import React from 'react';
import './Sidebar.css'; 
import { 
  Home, TrendingUp, Compass, List, Plus, 
  MessageCircle, Shield, Mail, Settings, Star, ChevronDown, ChevronUp
} from 'lucide-react';

// FIX: We accept 'isOpen' as a prop now
const RedditSidebar = ({ isOpen, onNavigate, activePage }) => {
  return (
    // FIX: Removed the internal button and header. Just the content.
    <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="sidebar-content">  
        {/* Spacer since we removed the header */}
        <div style={{ height: '16px' }}></div>

        {/* Standard Navigation */}
        <nav className="nav-section">
        {/* Update Home Button */}
          <div onClick={() => onNavigate('home')}>
            <SidebarItem 
                icon={<Home size={20} />} 
                label="Home" 
                active={activePage === 'home'} 
            />
          </div>
          <SidebarItem icon={<TrendingUp size={20} />} label="Popular" />
          <SidebarItem icon={<MessageCircle size={20} />} label="Answers" badge="BETA" />
          <SidebarItem icon={<Compass size={20} />} label="Explore" />
          <SidebarItem icon={<List size={20} />} label="All" />
        </nav>

        <hr className="divider" />

        <div className="nav-section">
          <div className="games-header">
            <span>MODERATION</span>
            <ChevronUp size={14} />
          </div>
            {/* Update Mod Queue Button */}
          <div onClick={() => onNavigate('mod-queue')}>
            <SidebarItem 
                icon={<Shield size={20} />} 
                label="Mod Queue" 
                active={activePage === 'mod-queue'}
            />
          </div>
          {/* ... inside the Moderation section ... */}
            <SidebarItem icon={<Shield size={20} />} label="r/Mod" />

            {/* NEW: Wrap the Manage item */}
            <div onClick={() => onNavigate('manage')}>
                <SidebarItem 
                    icon={<Settings size={20} />} 
                    label="Manage" 
                    active={activePage === 'manage'}
                />
            </div>
          <SidebarItem icon={<Mail size={20} />} label="Mod Mail" />
          <SidebarItem icon={<Shield size={20} />} label="r/Mod" />
          <SidebarItem icon={<Settings size={20} />} label="Manage" />
          
          <div className="community-card mt-2">
              <div className="flex items-center gap-2">
                  <div className="community-icon">r/</div>
                  <span className="community-name">r/ay7aga</span>
              </div>
              <Star size={16} className="text-gray-400" />
          </div>
        </div>

        <hr className="divider" />

        <div className="nav-section">
          <button className="create-community-btn">
            <Plus size={20} />
            <span>Start a community</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// Helper Component
const SidebarItem = ({ icon, label, badge, active }) => (
  <div className={`nav-item ${active ? 'active' : ''}`}>
    <div className="nav-item-left">
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </div>
    {badge && <span className="beta-badge">{badge}</span>}
  </div>
);

export default RedditSidebar;