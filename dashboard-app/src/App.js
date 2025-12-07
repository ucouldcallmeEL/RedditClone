import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import ModQueuePage from './components/ModQueuePage.jsx';
// NEW: Import the page
import ModManagementPage from './components/ModManagementPage.jsx'; 
import './components/Sidebar.css'; 

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('home'); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <Navbar onToggle={toggleSidebar} />

      <div className="main-content-wrapper">
        <Sidebar 
            isOpen={isSidebarOpen} 
            onNavigate={navigateTo} 
            activePage={currentPage} 
        />
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
            
            {currentPage === 'home' && (
              <div className="page-content">
                <h1>Home Page</h1>
                <p>Welcome to the Reddit clone home page.</p>
              </div>
            )}

            {currentPage === 'mod-queue' && <ModQueuePage />}

            {/* NEW: Add the condition for the management page */}
            {currentPage === 'manage' && <ModManagementPage />}

        </div>
      </div>
    </div>
  );
}

export default App;