import React from 'react';
import './CreateCommunity.css';

const CreateCommunity = () => {
  return (
    <div className="modal-container">
      <div className="modal-header">
        <h2>Add topics</h2>
        <div className="close-button-container">
            <button className="close-button">
              <svg 
                fill="currentColor" 
                height="16" 
                viewBox="0 0 20 20" 
                width="16" 
                xmlns="http://www.w3.org/2000/svg"
                className="close-icon"
              >
                <path d="M11.273 10l5.363-5.363a.9.9 0 10-1.273-1.273L10 8.727 4.637 3.364a.9.9 0 10-1.273 1.273L8.727 10l-5.363 5.363a.9.9 0 101.274 1.273L10 11.273l5.363 5.363a.897.897 0 001.274 0 .9.9 0 000-1.273L11.275 10h-.002z"></path>
              </svg>
            </button>
        </div>
      </div>
      <div className="modal-body">

      </div>
      <div className="modal-footer">
        <div className = "progress-dots-container">
            <div id="current-page-indicator" className = "progress-dot"></div>
            <div className = "progress-dot"></div>  
            <div className = "progress-dot"></div>
            <div className = "progress-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;