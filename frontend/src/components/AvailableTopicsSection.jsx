import './AvailableTopicsSection.css';
// Reusable component for available topics section
const AvailableTopicsSection = ({
    title,
    topics,
    selectedTopics,
    onTopicClick,
  }) => {
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
                className={`available-topic-name ${
                  isTopicSelected(topic) ? "selected" : ""
                }`}
                onClick={() => onTopicClick(topic)}
              >
                <span>{topic}</span>
                {isTopicSelected(topic) && (
                  <svg
                    aria-hidden="true"
                    fill="currentColor"
                    height="16"
                    viewBox="0 0 20 20"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                    className="remove-topic-icon"
                  >
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
  export default AvailableTopicsSection;