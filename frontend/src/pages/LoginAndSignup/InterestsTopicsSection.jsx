import "./InterestsTopicsSection.css";

// Variant of AvailableTopicsSection for the Interests flow
const InterestsTopicsSection = ({
  title,
  topics,
  selectedTopics,
  onTopicClick,
}) => {
  const isTopicSelected = (topicName) => selectedTopics.includes(topicName);

  return (
    <div className="interests-topics-container">
      <p className="interests-topics-title">{title}</p>
      <div className="interests-topics-list">
        {topics.map((topic) => {
          const selected = isTopicSelected(topic);
          return (
            <div key={topic} className="interests-topic">
              <button
                type="button"
                className={`interests-topic-name ${
                  selected ? "selected" : ""
                }`.trim()}
                onClick={() => onTopicClick(topic)}
              >
                <span>{topic}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterestsTopicsSection;


