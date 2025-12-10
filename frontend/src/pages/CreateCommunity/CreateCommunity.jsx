import React, { useState } from 'react';
import './CreateCommunity.css';

// Reusable component for available topics section
const AvailableTopicsSection = ({ title, topics, selectedTopics, onTopicClick }) => {
  // Check if a topic is selected
  const isTopicSelected = (topicName) => {
    return selectedTopics.includes(topicName);
  };

  return (
    <div className="available-topics-container">
      <p className="available-topics-title">{title}</p>
      <div className="available-topics-list">
        {topics.map((topic) => (
          <div key={topic} className="available-topic">
            <button 
              className={`available-topic-name ${isTopicSelected(topic) ? 'selected' : ''}`}
              onClick={() => onTopicClick(topic)}
            >
              <span>{topic}</span>
              {isTopicSelected(topic) && (
                <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg" className="remove-topic-icon">
                  <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm3.94 11.66l-1.27 1.27-2.66-2.66-2.66 2.66-1.27-1.27L8.74 10 6.08 7.34l1.27-1.27 2.66 2.66 2.66-2.66 1.27 1.27L11.28 10l2.66 2.66z"></path>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateCommunity = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  
  // Check if at least one topic is selected
  const isNextButtonDisabled = selectedTopics.length === 0;

  // Available topics organized by category
  const topicCategories = [
    {
      title: 'Entertainment',
      topics: ['Anime & Manga', 'Cosplay', 'Movies', 'TV Shows']
    },
    {
      title: 'Gaming',
      topics: ['Video Games', 'Board Games', 'Esports']
    }
  ];

  // Check if a topic is selected
  const isTopicSelected = (topicName) => {
    return selectedTopics.includes(topicName);
  };

  // Handle topic selection/deselection
  const handleTopicClick = (topicName) => {
    if (isTopicSelected(topicName)) {
      // Remove topic if already selected
      setSelectedTopics(selectedTopics.filter(topic => topic !== topicName));
    } else {
      // Add topic if not selected and limit is not reached
      if (selectedTopics.length < 3) {
        setSelectedTopics([...selectedTopics, topicName]);
      }
    }
  };

  // Handle removing a topic from selected list
  const handleRemoveTopic = (topicName) => {
    setSelectedTopics(selectedTopics.filter(topic => topic !== topicName));
  };

  return (
    <div className="modal-container">
      <div className="modal-header">
        <div className="description-container">
          <h2>Add topics</h2>
          <p className="description-text">Add up to 3 topics to help interested redditors find your community.</p>
        </div>
        
        <div className="button-container">
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
        <div className="search-container">
          <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg" className="search-icon">
            <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7.961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z"></path>
          </svg>
          <input type="text" name='filter' className="search-input" placeholder="Filter topics" />
        </div>
        <h3>Topics {selectedTopics.length}/3</h3>
        <div className="selected-topics-container">
          {selectedTopics.map((topic) => (
            <div key={topic} className="selected-topic">
              <span className="selected-topic-name">{topic}</span>
              <button className="remove-topic-button" onClick={() => handleRemoveTopic(topic)}>
                <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg" className="remove-topic-icon">
                  <path d="M10 1a9 9 0 10.001 18.001A9 9 0 0010 1zm3.94 11.66l-1.27 1.27-2.66-2.66-2.66 2.66-1.27-1.27L8.74 10 6.08 7.34l1.27-1.27 2.66 2.66 2.66-2.66 1.27 1.27L11.28 10l2.66 2.66z"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
        {topicCategories.map((category, index) => (
          <AvailableTopicsSection
            key={index}
            title={category.title}
            topics={category.topics}
            selectedTopics={selectedTopics}
            onTopicClick={handleTopicClick}
          />
        ))}
      </div>
      <div className="modal-footer">
        <div className = "progress-dots-container">
            <div id="current-page-indicator" className = "progress-dot"></div>
            <div className = "progress-dot"></div>  
            <div className = "progress-dot"></div>
            <div className = "progress-dot"></div>
        </div>
          <div className="footer-buttons-container">
            <div className="button-container">
              <button className="cancel-button">Cancel</button>
            </div>
            <div className="button-container">
              <button className="next-button" disabled={isNextButtonDisabled}>Next</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CreateCommunity;