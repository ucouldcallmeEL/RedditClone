import './SelectTopicsPage.css';
import '../CreateCommunity.css';
import AvailableTopicsSection from '../../../components/AvailableTopicsSection';

const SelectTopicsPage = ({
  topicCategories,
  selectedTopics,
  handleRemoveTopic,
  handleTopicClick,
  topicFilter,
  setTopicFilter,
}) => {
  return (
    <>
      <div className="search-container">
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="16"
          viewBox="0 0 20 20"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          className="search-icon"
        >
          <path d="M18.736 17.464l-3.483-3.483A7.961 7.961 0 0016.999 9 8 8 0 109 17a7.961 7.961 0 004.981-1.746l3.483 3.483a.9.9 0 101.272-1.273zM9 15.2A6.207 6.207 0 012.8 9c0-3.419 2.781-6.2 6.2-6.2s6.2 2.781 6.2 6.2-2.781 6.2-6.2 6.2z"></path>
        </svg>
        <input
          type="text"
          name="filter"
          className="search-input"
          placeholder="Filter topics"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        />
      </div>
      <h3>Topics {selectedTopics.length}/3</h3>
      <div className="selected-topics-container">
        {selectedTopics.map((topic) => (
          <div key={topic} className="selected-topic">
            <span className="selected-topic-name">{topic}</span>
            <button
              className="remove-topic-button"
              onClick={() => handleRemoveTopic(topic)}
            >
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
            </button>
          </div>
        ))}
      </div>
      {topicCategories.map((category, index) => {
        // Filter topics based on search input
        // Match if search term is at the beginning of a word or is a complete word
        const filteredTopics = category.topics.filter((topic) => {
          if (!topicFilter) return true; // Show all if no filter

          const topicLower = topic.toLowerCase();
          const filterLower = topicFilter.toLowerCase();

          // Check if filter is at the beginning of the topic
          if (topicLower.startsWith(filterLower)) {
            return true;
          }

          // Check if filter is at the beginning of any word in the topic
          // Split by spaces and check each word
          const words = topicLower.split(/\s+/);
          for (const word of words) {
            if (word.startsWith(filterLower)) {
              return true;
            }
          }

          // Check if filter matches a complete word (word boundary)
          // Use regex to match whole words
          const wordBoundaryRegex = new RegExp(
            `\\b${filterLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
            "i"
          );
          if (wordBoundaryRegex.test(topic)) {
            return true;
          }

          return false;
        });

        // Only show category if it has matching topics
        if (filteredTopics.length === 0) {
          return null;
        }

        return (
          <AvailableTopicsSection
            key={index}
            title={category.title}
            topics={filteredTopics}
            selectedTopics={selectedTopics}
            onTopicClick={handleTopicClick}
          />
        );
      })}
    </>
  );
};

export default SelectTopicsPage;