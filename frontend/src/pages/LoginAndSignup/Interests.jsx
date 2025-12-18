import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import InterestsTopicsSection from "./InterestsTopicsSection";
import { apiGet, topicRoutes } from "../../config/apiRoutes";

import "./Login.css";

const Interests = ({ onClose }) => {
  const navigate = useNavigate();

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topicsByCategory, setTopicsByCategory] = useState([]);
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await apiGet(topicRoutes.getAll);
        if (!response.ok) {
          throw new Error("Failed to fetch topics");
        }
        const data = await response.json();
        setTopicsByCategory(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError("Failed to load topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);


  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    if (!selectedInterests.length) return;
    // navigate to your next route in the auth flow
    navigate("/");
  };

  const hasSelection = selectedInterests.length > 0;

  return (
    <div className="log-in-modal auth-flow-modal reset-pass-modal">
      <div className="interests-header">
        <div className="button-wrapper">
          <button
            className="quit-reset-button"
            onClick={() => navigate("/create-user")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M 17.5 9.1 H 4.679 l 5.487 -5.462 a 0.898 0.898 0 0 0 0.003 -1.272 a 0.898 0.898 0 0 0 -1.272 -0.003 l -7.032 7 a 0.898 0.898 0 0 0 0 1.275 l 7.03 7 a 0.896 0.896 0 0 0 1.273 -0.003 a 0.898 0.898 0 0 0 -0.002 -1.272 l -5.487 -5.462 h 12.82 a 0.9 0.9 0 0 0 0 -1.8 Z"
                fill="white"
                stroke="white"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="quit-reset-button" onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.273 10l5.363-5.363a.9.9 0 10-1.273-1.273L10 8.727 4.637 3.364a.9.9 0 10-1.273 1.273L8.727 10l-5.363 5.363a.9.9 0 101.274 1.273L10 11.273l5.363 5.363a.897.897 0 001.274 0 .9.9 0 000-1.273L11.275 10h-.002z"
                fill="white"
                stroke="white"
                strokeWidth="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="interests-scroll-area">
        <div className="log-in-modal-content">
          <h1 className="log-in-modal-title">Interests</h1>
          <p className="log-in-modal-text">
            Pick things you'd like to see in your home feed.
          </p>

          {loading ? (
            <p className="log-in-modal-text">Loading topics...</p>
          ) : error ? (
            <p className="log-in-modal-text" style={{ color: "#ff453a" }}>
              {error}
            </p>
          ) : (
            topicsByCategory.map((category) => (
              <section key={category.title} className="interests-section">
                <InterestsTopicsSection
                  title={category.title}
                  topics={category.topics}
                  selectedTopics={selectedInterests}
                  onTopicClick={toggleInterest}
                />
              </section>
            ))
          )}
        </div>
      </div>

      <div className="log-in-modal-content interests-bottom">
        <Button
            label={hasSelection ? "Continue" : "Select at least 1 to continue"}

          onClick={handleContinue}
          disabled={!hasSelection}
          className={
            hasSelection ? "login-action-button continue-button-interests" : ""
          }
        />
      </div>
    </div>
  );
};

export default Interests;
