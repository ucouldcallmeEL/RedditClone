// src/pages/ModQueuePage.jsx
import React from 'react';
import QueueMain from './QueueMain';
import QueueStatsSidebar from './QueueStatsSidebar';
import './ModQueuePage.css';

const ModQueuePage = () => {
  return (
    <div className="mod-queue-layout">
      {/* Center Content: Queue Tabs & Items */}
      <div className="queue-main-wrapper">
        <QueueMain />
      </div>

      {/* Right Sidebar: Stats & Insights */}
      <div className="queue-right-sidebar-wrapper">
        <QueueStatsSidebar />
      </div>
    </div>
  );
};

export default ModQueuePage;