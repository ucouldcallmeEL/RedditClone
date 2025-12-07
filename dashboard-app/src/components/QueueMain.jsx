// src/components/QueueMain.jsx
import React, { useState } from 'react';
import './QueueMain.css';
import { HelpCircle, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const TABS = ["Needs Review", "Reported", "Removed", "Edited", "Unmoderated"];

const QueueMain = () => {
  const [activeTab, setActiveTab] = useState("Needs Review");

  return (
    <div className="queue-container">
      
      {/* Header Section */}
      <div className="queue-header">
        <div className="queue-title-row">
          <h1>Queue</h1>
          <div className="queue-controls">
            <button className="icon-action"><HelpCircle size={18} /></button>
            <button className="icon-action"><ChevronLeft size={18} /></button>
            <button className="icon-action"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="queue-tabs-row">
          <div className="tabs-list">
            {TABS.map((tab) => (
              <button 
                key={tab}
                className={`queue-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button className="sort-btn">
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {/* Empty State Content */}
      <div className="queue-empty-state">
        <img 
          src="https://www.redditstatic.com/desktop2x/img/snoomoji/cat_blep.png" 
          alt="Kitteh" 
          className="kitteh-img"
        />
        <h2>Queue is clean.</h2>
        <p>Kitteh is pleased.</p>
      </div>

    </div>
  );
};

export default QueueMain;